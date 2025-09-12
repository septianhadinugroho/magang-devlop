"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await loginUser(data);
      if (result) {
        document.cookie = `is_login=${1}`;
        toast("Login Success", {
          description: "You have successfully logged in.",
        });
        router.push("/");
      }
    } catch (error) {
      toast("Login Failed", {
        description:
          error.message ||
          "Unable to login. Please check your credentials and try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            CMS GRABSMART
          </CardTitle>
          <CardDescription className="text-center mt-1">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email_username">Email / Username</Label>
              <Input
                id="email_username"
                type="text"
                {...register("email", {
                  required: "Email / Username is required",
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="mt-2 w-full">
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Dont have an account?
          <Link
            href={"/register"}
            className="ml-1 hover:underline cursor-pointer text-blue-500"
          >
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}