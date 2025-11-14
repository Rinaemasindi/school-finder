'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, School, Map, BarChart3, List, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Browse', icon: List },
  { href: '/find', label: 'Find', icon: Map },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <School className="h-6 w-6" />
          <span className="font-bold text-sm sm:text-base">SA Schools</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-auto space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden border-t">
          <nav className="container px-4 py-4 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
