import { Link, useNavigate } from "react-router";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/redux/features/authSlice";
import { toast } from "sonner";


// Zod
const registerSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });



  // 
const [signUp] = useRegisterMutation();
const navigate = useNavigate();

  //  
  const onSubmit:SubmitHandler<FieldValues> = async(data) => {
        console.log(data);
        try {
          const res = await signUp(data).unwrap();
          console.log(res);
          toast.success("")
          navigate('/dashboard')
        } catch (error) {
           console.log(error);
        }

  }
   

  // 
  return (
    <div className="min-h-screen flex items-center justify-center px-4 w-full">
      <Card className="!w-lg shadow-xl border border-gray-200 rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
          <p className="text-sm text-gray-500 mt-2">Join our digital wallet community</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label className="mb-2">Full Name</Label>
              <Input {...register("name")} placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label className="mb-2">Email</Label>
              <Input type="email" {...register("email")} placeholder="example@gmail.com" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Label className="mb-2">Password</Label>
              <Input type="password" {...register("password")} placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div>
              <Label className="mb-2">Phone</Label>
              <Input {...register("phone")} placeholder="+8801XXXXXXXXX" />
            </div>

            <Button variant={"default"} type="submit" className="w-full bg-amber-50 ">Register</Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
