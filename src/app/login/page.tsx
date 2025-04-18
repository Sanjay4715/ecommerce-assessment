"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SiFraunhofergesellschaft } from "react-icons/si";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/lib/api";
import { useAuth, User } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .nonempty({ message: "Username is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(20, { message: "Password cannot exceed 20 characters." })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must include at least one digit.",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must include at least one special character.",
    }),
});

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response: AxiosResponse = await api.post("/auth/login", values, {
        requiresAuth: false, // Move requiresAuth to the config root
      });
      const { token } = response.data;
      if (token) {
        const decodedData: User = jwtDecode(token);
        await login(token, decodedData);
        router.push("/");
        setLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 404) {
          form.setError("username", { message: error.response.data.message });
        }
        if (error.response.status === 401) {
          form.setError("password", { message: error.response.data });
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] pl-5 pr-5 sm:pl-40 sm:pr-40 pt-5 pb-5 flex flex-col items-center justify-center space-y-2">
      <div className="text-3xl font-bold">Welcome to My Ecommerce</div>
      <Card className="w-full max-w-md border-0">
        <CardContent>
          <div className="text-right">
            New User?{" "}
            <Link
              href={"/signup"}
              className="hover:underline text-[var(--site-primary)]"
            >
              Register
            </Link>
          </div>
        </CardContent>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[var(--site-primary)] p-3 rounded-full">
              <SiFraunhofergesellschaft className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">User Login</CardTitle>
          <CardDescription>
            Enter your credentials to login to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        className="focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px]"
                      />
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          className="focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px] pr-10" // Add padding for the icon
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-[var(--site-primary)] cursor-pointer hover:bg-gray-500 dark:bg-white flex"
              >
                {loading && <LoaderCircle className="animate-spin-slow" />}
                <div>Submit</div>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
