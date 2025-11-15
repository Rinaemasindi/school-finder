'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { School, Map, BarChart3, HelpCircle, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/find', label: 'Find', icon: Map },
  { href: '/browse', label: 'Browse', icon: List },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo - Icon only on mobile, with text on desktop */}
          <Link href="/find" className="flex items-center space-x-2">
            <School className="h-6 w-6" />
            <span className="hidden sm:block font-bold text-sm sm:text-base">SA Schools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname === '/' && item.href === '/find');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Icon Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/find');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'fill-primary/20')} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Add bottom padding to content so it doesn't hide behind mobile nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
