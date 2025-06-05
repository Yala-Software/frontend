"use client";

import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { PredefinedUsers } from '@/components/auth/PredefinedUsers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 py-12">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="items-center">
            <Logo size="lg" />
            <CardTitle className="text-3xl font-headline mt-2">Welcome Back</CardTitle>
            <CardDescription>Login to access your Yala Exchange account.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-6 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <PredefinedUsers />
      </motion.div>
    </div>
  );
}
