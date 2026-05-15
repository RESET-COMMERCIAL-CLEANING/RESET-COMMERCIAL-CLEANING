'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const comparisons = [
  {
    title: 'Corporate Office Space',
    before: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1497366811353-6798859bbbab?w=600&h=400&fit=crop',
    completed: false,
  },
  {
    title: 'Retail Store Front',
    before: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    completed: false,
  },
  {
    title: 'Reception Area',
    before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    completed: false,
  },
];

function ComparisonSlider({ before, after, title, completed: initialCompleted }: { before: string; after: string; title: string; completed: boolean }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [completed, setCompleted] = useState(initialCompleted);

  const updateSliderPosition = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPos(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    updateSliderPosition(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    updateSliderPosition(e.touches[0].clientX, rect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full"
    >
      <div
        className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden cursor-col-resize group touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* After image (background) */}
        <div className="absolute inset-0 bg-gray-900 rounded-xl overflow-hidden">
          <Image
            src={after}
            alt={`${title} - After`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Before image (overlay) */}
        <div
          className="absolute inset-0 overflow-hidden rounded-xl"
          style={{ width: `${sliderPos}%` }}
        >
          <Image
            src={before}
            alt={`${title} - Before`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-reset-green group-hover:w-2 transition-all"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-reset-green rounded-full p-3 shadow-lg">
            <div className="flex gap-2">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/60 px-4 py-2 rounded-lg backdrop-blur">
          <span className="text-white font-bold text-sm">Before</span>
        </div>
        <div className="absolute top-4 right-4 bg-black/60 px-4 py-2 rounded-lg backdrop-blur">
          <span className="text-white font-bold text-sm">After</span>
        </div>
      </div>
    </motion.div>
  );
}

export function BeforeAfter() {
  return (
    <section className="relative w-full bg-black py-16 md:py-20 lg:py-32">
      <div className="container px-4 md:px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="block text-white">See The</span>
            <span className="gradient-text">Difference</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-400">
            Real transformations from our clients. Move or drag the slider to see the impact of a true reset.
          </p>
        </motion.div>

        {/* Comparisons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {comparisons.map((comparison, index) => (
            <ComparisonSlider
              key={index}
              before={comparison.before}
              after={comparison.after}
              title={comparison.title}
              completed={comparison.completed}
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
