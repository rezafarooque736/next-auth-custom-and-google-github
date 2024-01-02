"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { SignInFormSchema } from "@/schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import LoadingIcons from "../icons/loading-icons";
import { toast } from "sonner";

// import icons
import LogoIcons from "../icons/logo-icons";
import Title from "../ui/title";
import GoogleIcons from "../icons/google-icons";
import GithubIcons from "../icons/github-icons";

const SignInForm = () => {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [sessionStatus, router, callbackUrl]);

  const onSubmit = async (values: z.infer<typeof SignInFormSchema>) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error === "CredentialsSignin") {
      form.setError("password", { message: "Invalid credentials" });
      toast.error("Invalid credentials");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  if (sessionStatus === "loading" || sessionStatus === "authenticated") {
    return (
      <div className="grid place-items-center">
        <LoadingIcons />
      </div>
    );
  }

  return (
    sessionStatus === "unauthenticated" && (
      <div>
        <div className="flex justify-center my-3">
          <LogoIcons />
        </div>
        <div className="mb-2">
          <Title>Log in to RailTel SOC</Title>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mail@example.com" {...field} />
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Button
                        asChild
                        variant={"link"}
                        className="pl-1 font-medium text-sky-600"
                      >
                        <Link href={"/auth/reset-password"}>
                          Reset password?
                        </Link>
                      </Button>
                    </div>
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
            </div>
            <Button className="w-full mt-6" type="submit">
              Sign in
            </Button>
          </form>
          <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
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
          <div className="text-center text-sm text-slate-600 mt-3">
            Don&apos;t have an account?
            <Button
              asChild
              variant={"link"}
              className="pl-1 font-medium text-sky-600"
            >
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        </Form>
      </div>
    )
  );
};

export default SignInForm;
