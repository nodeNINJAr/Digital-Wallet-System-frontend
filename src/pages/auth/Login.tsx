/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/features/authSlice";
import { toast } from "sonner";
import { Wallet, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/slice/authSlice";

// zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormType = z.infer<typeof loginSchema>;

// Get role-based route
const getRoleRoute = (role: string): string => {
  const routes: Record<string, string> = {
    user: "/dashboard/user",
    agent: "/dashboard/agent",
    admin: "/dashboard/admin",
  };
  return routes[role] || "/dashboard";
};

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Regular login
  const onSubmit = async (data: LoginFormType) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setUser(result?.data?.user));
      toast.success("Login successful!");
      navigate(getRoleRoute(result?.data?.user?.role));
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  // Demo login - fixed version
  const handleDemoLogin = async (email: string) => {
    const password = import.meta.env.VITE_ADMIN_PASS;
    setValue("email", email);
    setValue("password", password);
    try {
      const result = await login({ email, password }).unwrap();
      
      // Fixed: Access user from result.data.user (not result.user)
      dispatch(setUser(result?.data?.user));
      toast.success("Demo login successful!");
      
      // Fixed: Use result.data.user.role (not result.user.role)
      navigate(getRoleRoute(result?.data?.user?.role));
    } catch (error: unknown) {
          const message = error instanceof Error 
            ? error.message 
            : (error as any)?.data?.message || "Demo login failed.";
          toast.error(message);
          console.error(error);
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Wallet className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">PayWallet</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit(onSubmit)}
                className="w-full dark:!border-gray-400 dark:!text-gray-200 "
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or try demo accounts</span>
              </div>
            </div>

            {/* Demo Buttons */}
            <div className="mt-6 space-y-2">
              {[
                { email: "testuser@gmail.com", label: "Demo User Account" },
                { email: "testagent@gmail.com", label: "Demo Agent Account" },
                { email: import.meta.env.VITE_ADMIN_EMAIL, label: "Demo Admin Account" },
              ].map(({ email, label }) => (
                <Button
                  key={email}
                  type="button"
                  variant="outline"
                  className="w-full dark:!text-white/60 dark:!border-white/40"
                  onClick={() => handleDemoLogin(email)}
                  disabled={isLoading}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}