"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  BookOpen, 
  Brain, 
  LayoutDashboard, 
  Menu, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/components/AuthProvider';
import { FadeIn } from "@/components/ui/motion";

export function SiteHeader(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 10);

      // Update active section based on scroll position
      const sections = ["features", "testimonials", "pricing", "faq"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      setActiveSection(currentSection || "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-border"
          : "bg-transparent border-transparent"
      )}
    >
      <FadeIn>
        <div className="mx-auto max-w-[1440px] flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">
              GuruX
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {[
              { href: "#features", label: "Features" },
              { href: "#testimonials", label: "Testimonials" },
              { href: "#pricing", label: "Pricing" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all after:duration-300",
                  activeSection === href.slice(1)
                    ? "text-primary after:bg-primary after:w-full"
                    : "text-muted-foreground hover:text-primary after:w-0 hover:after:w-full after:bg-primary/50"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">

            {user ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
                <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            )}
              
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="mx-auto max-w-[1440px] flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">GuruX</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="mx-auto max-w-[1440px] grid gap-6 py-6 px-4 md:px-6">
            <Link
              href="#features"
              className="flex items-center gap-2 text-lg font-medium border-b border-border pb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              Features
            </Link>
            <Link
              href="#testimonials"
              className="flex items-center gap-2 text-lg font-medium border-b border-border pb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="flex items-center gap-2 text-lg font-medium border-b border-border pb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              Pricing
            </Link>

            <div className="flex flex-col gap-2 mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}