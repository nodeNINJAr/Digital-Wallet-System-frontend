import { Link, useNavigate } from "react-router";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/features/authSlice";
import { toast } from "sonner";

// Zod Validation
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type LoginFormType = z.infer<typeof loginSchema>;


// 
export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

// 
const [login] = useLoginMutation();
const navigate = useNavigate()

  const onSubmit:SubmitHandler<FieldValues> = async(data) => {
        console.log(data);
        try {
          const res = await login(data).unwrap();
          console.log(res);
          toast.success("")
          navigate('/dashboard')
        } catch (error) {
           console.log(error);
        }

  }


  // 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className=" w-96 md:w-lg shadow-xl border border-gray-200 rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <p className="text-sm text-gray-500 mt-2">Log in to access your wallet</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label className="mb-2">Email Address</Label>
              <Input type="email" {...register("email")} placeholder="example@gmail.com" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Label className="mb-2">Password</Label>
              <Input type="password" {...register("password")} placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <Button variant={'default'} type="submit" className="w-full bg-amber-50">Login</Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
