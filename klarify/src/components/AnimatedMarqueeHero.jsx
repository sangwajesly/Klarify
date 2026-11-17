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
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#F3F6FD] via-[#FAFBFD] to-[#EDF2FB] dark:from-[#0C1226] dark:via-[#0A0E17] dark:to-[#080B12] flex flex-col items-center justify-between pt-7 pb-6 sm:pt-8 sm:pb-8 md:pt-10 md:pb-0 md:h-[calc(100vh-4.25rem)] md:min-h-[560px] md:max-h-[820px] px-4 transition-colors border-b border-slate-200/50 dark:border-slate-800/80 md:border-b-0 ${className}`}
    >
      {/* Ambient background glow blending Sky Blue and Yellow Green */}
      <div 
        className="pointer-events-none absolute inset-0 -top-12 opacity-80 dark:opacity-40"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 30% 12%, rgba(31, 59, 143, 0.12), transparent 70%), radial-gradient(ellipse 60% 45% at 75% 16%, rgba(198, 212, 51, 0.15), transparent 65%)"
        }}
      />
      {/* Subtle micro dot texture for depth */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.045] bg-[radial-gradient(#1F3B8F_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Main Content Area - Upper Center */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Tagline / Badge */}
        {tagline && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_VARIANTS}
            className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-primary-500/20 dark:border-secondary-500/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm max-w-[94vw]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden="true" />
            <span className="truncate sm:whitespace-normal">{tagline}</span>
          </motion.div>
        )}

        {/* Main Title - Proportional 2-Line Heading */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={STAGGER_CONTAINER}
          className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight leading-[1.14] mb-3 sm:mb-4"
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

        {/* Call to Action Button - Proportional & Mobile-Refined */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_VARIANTS}
          transition={{ delay: 0.35 }}
          className="flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCtaClick}
            type="button"
            className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold sm:font-extrabold dark:bg-secondary-500 dark:hover:bg-secondary-400 dark:text-slate-950 dark:font-black text-xs sm:text-sm md:text-base border border-primary-400/30 dark:border-white/60 shadow-[0_10px_24px_-6px_rgba(31,59,143,0.35),0_4px_10px_-2px_rgba(31,59,143,0.18)] dark:shadow-[0_0_30px_rgba(198,212,51,0.4),0_10px_20px_-5px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_30px_-6px_rgba(31,59,143,0.45)] dark:hover:shadow-[0_0_40px_rgba(198,212,51,0.6)] transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/40 dark:focus:ring-secondary-500/50 cursor-pointer overflow-hidden"
          >
            {/* Top Specular Gloss Sheen */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/20 dark:from-white/35 to-transparent rounded-t-full" />
            
            <span className="relative z-10 tracking-tight">{ctaText}</span>
            <div className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-secondary-500 text-slate-950 dark:bg-slate-950 dark:text-secondary-400 flex items-center justify-center font-black group-hover:translate-x-1 group-hover:scale-105 transition-all shadow-xs shrink-0">
              <ArrowRight size={13} className="stroke-[2.5]" />
            </div>
          </motion.button>

          {/* Social Proof Trust Strip */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_VARIANTS}
            transition={{ delay: 0.45 }}
            className="mt-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium"
          >
            <span className="font-bold text-slate-700 dark:text-slate-300">320+ Programs</span>
            <span>&bull;</span>
            <span>Free AI Guidance</span>
            <span>&bull;</span>
            <span>Cameroon-Wide</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Image Marquee - Positioned directly below CTA on mobile, docked at bottom on desktop */}
      <div 
        className="w-full mt-6 sm:mt-8 md:mt-0 md:absolute md:bottom-0 md:left-0 md:h-[28%] lg:h-[30%] overflow-hidden touch-pan-y pointer-events-auto [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] md:[mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_100%)]"
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
