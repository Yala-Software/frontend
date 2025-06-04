"use client";

import Link from 'next/link';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl">
        <CardHeader className="items-center">
          <Logo size="lg" />
          <CardTitle className="text-3xl font-headline mt-2">Create Account</CardTitle>
          <CardDescription>Join Yala Exchange today!</CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
          <p className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline flex items-center justify-center gap-1">
               <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
