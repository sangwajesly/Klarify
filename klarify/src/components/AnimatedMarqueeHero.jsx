import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const AnimatedMarqueeHero = ({
  tagline,
  taglineIcon: TaglineIcon = Sparkles,
  title,
  titlePrefix,
  titleHighlight,
  description,
  ctaText,
  onCtaClick,
  images = [],
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  // Duplicate images for a seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#FAFAFC] dark:bg-[#0A0E17] flex flex-col items-center justify-between pt-6 pb-6 sm:pt-8 sm:pb-8 md:pt-10 md:pb-0 md:h-[calc(100vh-4.25rem)] md:min-h-[560px] md:max-h-[820px] px-4 transition-colors ${className}`}
    >
      {/* Ambient background glow blending Sky Blue and Yellow Green */}
      <div 
        className="pointer-events-none absolute inset-0 -top-24 opacity-50 dark:opacity-25"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 50% 10%, rgba(198, 212, 51, 0.09), transparent 65%), radial-gradient(ellipse 70% 50% at 50% 28%, rgba(31, 59, 143, 0.07), transparent 75%)"
        }}
      />

      {/* Main Content Area - Upper Center */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Tagline / Badge */}
        {tagline && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_VARIANTS}
            className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs"
          >
            {TaglineIcon && <TaglineIcon size={13} className="text-secondary-600 dark:text-secondary-400" />}
            <span>{tagline}</span>
          </motion.div>
        )}

        {/* Main Title - Proportional 2-Line Heading */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={STAGGER_CONTAINER}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight leading-[1.15] mb-3 sm:mb-4"
        >
          {title ? (
            title
          ) : (
            <>
              <span className="text-slate-900 dark:text-white font-extrabold">{titlePrefix} </span>
              {titleHighlight && (
                <span className="text-primary-500 dark:text-secondary-400 italic font-black">
                  {titleHighlight}
                </span>
              )}
            </>
          )}
        </motion.h1>

        {/* Description - Concise & Compact */}
        {description && (
          <motion.p
            initial="hidden"
            animate="show"
            variants={FADE_IN_VARIANTS}
            transition={{ delay: 0.25 }}
            className="max-w-xl text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-5 sm:mb-6"
          >
            {description}
          </motion.p>
        )}

        {/* Call to Action Button - Electric Yellow Green with Luminous Highlight Halo */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_VARIANTS}
          transition={{ delay: 0.35 }}
          className="flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCtaClick}
            type="button"
            className="group relative inline-flex items-center justify-center gap-3.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold dark:bg-secondary-500 dark:hover:bg-secondary-400 dark:text-slate-950 dark:font-black text-sm sm:text-base border border-primary-400/30 dark:border-white/60 shadow-[0_12px_28px_-6px_rgba(31,59,143,0.38),0_4px_12px_-2px_rgba(31,59,143,0.2)] dark:shadow-[0_0_35px_rgba(198,212,51,0.45),0_10px_20px_-5px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_34px_-6px_rgba(31,59,143,0.48)] dark:hover:shadow-[0_0_45px_rgba(198,212,51,0.65)] transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/40 dark:focus:ring-secondary-500/50 cursor-pointer overflow-hidden"
          >
            {/* Top Specular Gloss Sheen */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/20 dark:from-white/35 to-transparent rounded-t-full" />
            
            <span className="relative z-10 tracking-tight">{ctaText}</span>
            <div className="relative z-10 w-7 h-7 rounded-full bg-secondary-500 text-slate-950 dark:bg-slate-950 dark:text-secondary-400 flex items-center justify-center font-black group-hover:translate-x-1 group-hover:scale-105 transition-all shadow-xs">
              <ArrowRight size={14} className="stroke-[3]" />
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Animated Image Marquee - Positioned directly below CTA on mobile, docked at bottom on desktop */}
      <div 
        className="w-full mt-6 sm:mt-8 md:mt-0 md:absolute md:bottom-0 md:left-0 md:h-[28%] lg:h-[30%] overflow-hidden touch-pan-y pointer-events-auto [mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_100%)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex w-max gap-3 sm:gap-4 md:gap-5 items-end h-full md:translate-y-4 md:pb-2"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: isHovered ? 60 : 35,
            repeat: Infinity,
          }}
        >
          {duplicatedImages.map((src, index) => {
            const isEven = index % 2 === 0;
            const rotation = isEven ? -1.5 : 2;
            return (
              <div
                key={`${src}-${index}`}
                className="relative aspect-[3/4] h-36 sm:h-44 md:h-52 flex-shrink-0 transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-20"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <div className="w-full h-full p-1.5 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-200/70 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
                  <img
                    src={src}
                    alt={`Student showcase ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedMarqueeHero;
