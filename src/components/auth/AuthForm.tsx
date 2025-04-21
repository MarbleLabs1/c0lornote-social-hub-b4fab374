
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  isRegister?: boolean;
}

export function AuthForm({ isRegister = false }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: isRegister
      ? { name: "", username: "", email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      if (isRegister) {
        const registerData = data as RegisterFormValues;
        await register(
          registerData.username, 
          registerData.email, 
          registerData.password,
          registerData.name
        );
        toast.success("Account created successfully");
      } else {
        const loginData = data as LoginFormValues;
        await login(loginData.email, loginData.password);
        toast.success("Logged in successfully");
      }
      
      navigate("/");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(isRegister ? `Registration failed: ${errorMsg}` : `Login failed: ${errorMsg}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center gradient-text">
          {isRegister ? "Create an account" : "Welcome back"}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegister 
            ? "Enter your details to create your c0lornote account"
            : "Enter your credentials to sign in to your account"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isRegister && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button 
              type="submit" 
              className="w-full gradient-bg text-white hover:opacity-90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegister ? "Creating Account..." : "Logging In..."}
                </>
              ) : (
                <>
                  {isRegister ? (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-c0lor-purple hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link to="/register" className="text-c0lor-purple hover:underline">
                Create one
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
