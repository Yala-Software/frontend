"use client";
import { motion } from 'framer-motion';

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-[hsl(var(--auth-layout-background))]"
    >
      {children}
    </motion.div>
  );
}
