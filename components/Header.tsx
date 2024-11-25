"use client"

import React from 'react';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { Menu, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from './auth/AuthProvider';
import { signOut } from '@/lib/auth';
import { useToast } from './ui/use-toast';
import { Avatar, AvatarFallback } from './ui/avatar';

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const navItems = [
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const NavLink = ({ href, label, className = '', onClick }: NavLinkProps) => (
    <Link
      href={href}
      className={`${className} ${
        pathname === href ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
      } transition-colors`}
      onClick={onClick}
    >
      {label}
    </Link>
  );

  const getInitials = (email: string): string => {
    return email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user ? getInitials(user.email!) : 'UK'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Kingdom Runners
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            {!loading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <NavLink href="/login" label="Sign In" />
                )}
              </>
            )}
            <ModeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4 md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      {...item}
                      className="text-lg py-2"
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <NavLink
                            href="/dashboard"
                            label="Dashboard"
                            className="text-lg py-2"
                            onClick={() => setIsOpen(false)}
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              handleSignOut();
                              setIsOpen(false);
                            }}
                            className="w-full justify-start"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <NavLink
                          href="/login"
                          label="Sign In"
                          className="text-lg py-2"
                          onClick={() => setIsOpen(false)}
                        />
                      )}
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;