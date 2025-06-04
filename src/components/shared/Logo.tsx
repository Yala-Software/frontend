import Link from 'next/link';
import { Coins } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 'md', className, showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${className || ''}`}>
      <Coins className={`${sizeClasses[size]} text-primary`} />
      {showText && <span className={`font-headline font-bold ${textSizeClasses[size]} text-primary`}>YALA</span>}
    </Link>
  );
}
