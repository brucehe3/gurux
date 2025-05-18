import Image from 'next/image';
import { siteConfig } from '@/lib/home';
import Link from 'next/link';
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const { ctaSection } = siteConfig;

  return (

    <section className="py-24 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-chart-1/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-2/20 rounded-full filter blur-3xl" />
      </div>

      <div className="container px-4 md:px-6">
        <FadeIn>
          <div className="max-w-[900px] mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-6">
            {ctaSection.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-[600px] mx-auto">
              Join thousands of learners who have accelerated their education and achieved their goals with our AI-powered platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center items-center">
       
              <Link href={ctaSection.button.href} className="bg-white text-black font-semibold text-sm h-10 w-fit px-4 rounded-full flex items-center justify-center shadow-md">
                {ctaSection.button.text}
              </Link>

            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              {ctaSection.subtext}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>


  );
}
