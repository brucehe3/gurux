'use client';

import { useEffect, useState } from 'react';
import { CTASection } from '@/components/home/sections/cta-section';
// import { FAQSection } from "@/components/sections/faq-section";
import { FooterSection } from '@/components/home/sections/footer-section';
import { HeroSection } from '@/components/home/sections/hero-section';
import { OpenSourceSection } from '@/components/home/sections/open-source-section';
import { PricingSection } from '@/components/home/sections/pricing-section';
import { FeatureSection } from '@/components/home/sections/feature-section';
import { TestimonialsSection } from '@/components/home/sections/testimonials-section';

import { SiteHeader } from '@/components/home/sections/site-header';

export default function Home() {
  return (
    <>
    <SiteHeader />
    <main className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full divide-y divide-border">
        <HeroSection />

        <div className="mx-auto max-w-[1440px]">
          <FeatureSection />
          <TestimonialsSection />
          <PricingSection />
        </div>
        {/* <GrowthSection /> */}

        {/* <TestimonialSection /> */}
        {/* <FAQSection /> */}
        <CTASection />
        <FooterSection />
      </div>
    </main>
    </>
  );
}
