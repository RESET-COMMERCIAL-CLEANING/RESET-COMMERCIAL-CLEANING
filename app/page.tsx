'use client';

import { Hero } from '@/components/sections/Hero';
import { WhyReset } from '@/components/sections/WhyReset';
import { Industries } from '@/components/sections/Industries';
import { BeforeAfter } from '@/components/sections/BeforeAfter';
import { Testimonials } from '@/components/sections/Testimonials';
import { PricingPreview } from '@/components/sections/PricingPreview';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyReset />
      <Industries />
      <BeforeAfter />
      <Testimonials />
      <PricingPreview />
      <FinalCTA />
    </>
  );
}
