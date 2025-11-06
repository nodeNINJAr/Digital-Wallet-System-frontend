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
import { setCredentials } from "@/redux/slice/authSlice";

// Zod Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormType = z.infer<typeof loginSchema>;

export function Login() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
   const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormType) => {
    try {
      const result = await login(data).unwrap();
        dispatch(setCredentials(result));
      toast.success("Login successful!");
      
      // Redirect based on role (adjust paths as needed)
      const roleRoutes = {
        user: "/dashboard/user",
        agent: "/dashboard/agent",
        admin: "/dashboard/admin",
      };
      
      navigate(roleRoutes[result.user.role] || "/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setValue("email", email);
    setValue("password", "password");
    
    try {
      const result = await login({ email, password: "password" }).unwrap();
      toast.success("Demo login successful!");
      
      const roleRoutes = {
        user: "/dashboard/user",
        agent: "/dashboard/agent",
        admin: "/dashboard/admin",
      };
      
      navigate(roleRoutes[result.user.role] || "/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Demo login failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Wallet className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">PayWallet</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

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
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full !border-gray-400 !text-gray-200" disabled={isLoading} variant={"outline"}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or try demo accounts
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("user@test.com")}
                  disabled={isLoading}
                >
                  Demo User Account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("agent@test.com")}
                  disabled={isLoading}
                >
                  Demo Agent Account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("admin@test.com")}
                  disabled={isLoading}
                >
                  Demo Admin Account
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}