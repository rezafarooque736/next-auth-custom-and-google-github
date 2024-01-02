"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignUpFormSchemaFrontend } from "@/schema";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import LogoIcons from "../icons/logo-icons";
import { useEffect } from "react";
import LoadingIcons from "../icons/loading-icons";
import { toast } from "sonner";
import GoogleIcons from "../icons/google-icons";
import GithubIcons from "../icons/github-icons";

const SignUpForm = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const form = useForm<z.infer<typeof SignUpFormSchemaFrontend>>({
    resolver: zodResolver(SignUpFormSchemaFrontend),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading" || sessionStatus === "authenticated") {
    return (
      <div className="grid place-items-center">
        <LoadingIcons />
      </div>
    );
  }

  const onSubmit = async (values: z.infer<typeof SignUpFormSchemaFrontend>) => {
    const res = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });

    const data = await res.json();
    console.log(res);

    console.log({ data });

    if (res.ok) {
      router.push("/auth/sign-in");
      toast.success(data.message);
    } else {
      console.error("Registration failed");
      if (data.type === "warn") {
        toast.error(data.message);
      } else {
        toast.warning(data.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-center my-3">
        <LogoIcons />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
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
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full mt-6" type="submit">
            Sign up
          </Button>
        </form>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-slate-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-slate-400">
          or
        </div>
        <div className="flex items-center justify-center space-x-4">
          <span className="font-semibold">Continue with</span>
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6 hover:bg-white"
            onClick={() => {
              signIn("google");
            }}
          >
            <GoogleIcons />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-6 h-6 hover:bg-white"
            onClick={() => {
              signIn("github");
            }}
          >
            <GithubIcons />
          </Button>
        </div>
        <p className="text-center text-sm text-slate-600 mt-2">
          Have an account?
          <Button
            asChild
            className="text-sky-600 font-medium pl-1"
            variant={"link"}
          >
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
        </p>
      </Form>
    </div>
  );
};

export default SignUpForm;
