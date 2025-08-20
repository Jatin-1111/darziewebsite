// src/components/shopping-view/home/TestimonialsSection.jsx - ENHANCED WITH FRAMER MOTION 🎨
import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonialData = {
  text: "Darzie Couture offers a perfect blend of elegance, style, and craftsmanship. Each piece is thoughtfully designed and impeccably tailored, making you feel confident and unique. Their attention to detail and quality truly sets them apart in the world of fashion.",
  variations: [
    "Darzie Couture offers a perfect blend of elegance, style, and craftsmanship. Each piece is thoughtfully designed and impeccably tailored, making you feel confident and unique.",
    "The attention to detail and quality at Darzie's Couture truly sets them apart in the world of fashion. Every garment tells a story of tradition and modern sophistication.",
    "Exceptional craftsmanship meets contemporary design at Darzie's Couture. Their pieces are not just clothing, they're expressions of art and culture.",
    "From the first stitch to the final detail, Darzie's Couture delivers unmatched quality. Their designs celebrate both heritage and innovation beautifully.",
    "Darzie's Couture transforms fabric into poetry. Each creation is a testament to skilled artisanship and timeless elegance that speaks to the soul.",
    "The perfect fusion of traditional techniques and modern aesthetics makes Darzie's Couture a true masterpiece in the fashion world. Simply extraordinary.",
  ],
  count: 6,
};

const TestimonialsSection = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotateX: 15,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        delay: index * 0.1,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
      },
    }),
  };

  const quoteVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={ref} className="relative">
      {/* Enhanced Visual Separation Border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />

      <motion.div
        className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-[#f9f6ef] via-[#f4efd6] to-[#ded6c1] relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-[#C4BA97]/20 rounded-full"
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-32 right-32 w-3 h-3 bg-[#6C3D1D]/15 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-2 h-2 bg-[#C4BA97]/25 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <motion.div
            className="text-center mb-12 md:mb-16 lg:mb-20"
            variants={titleVariants}
          >
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-faux text-[#6C3D1D] mb-4 relative"
              variants={titleVariants}
            >
              <span className="relative inline-block">
                testimonials
                {/* Animated underline */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-[#6C3D1D] to-[#C4BA97] rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "60%" } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </span>
            </motion.h2>

            <motion.p
              className="text-gray-600 font-medium max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
              variants={quoteVariants}
            >
              Hear what our valued customers have to say about their Darzie's
              Couture experience
            </motion.p>
          </motion.div>

          {/* Enhanced Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: testimonialData.count }, (_, i) => (
              <motion.div
                key={i}
                className="group relative"
                variants={cardVariants}
                custom={i}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#eee] relative overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#C4BA97]/30">
                  {/* Decorative quote mark */}
                  <motion.div
                    className="absolute top-4 left-4 text-4xl md:text-5xl text-[#C4BA97]/20 font-serif leading-none"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  >
                    "
                  </motion.div>

                  {/* Gradient overlay on hover */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-[#C4BA97]/5 to-[#6C3D1D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  {/* Testimonial text */}
                  <motion.p
                    className="text-[#6C3D1D] text-sm md:text-base leading-relaxed font-medium text-center relative z-10 pt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                  >
                    {testimonialData.variations[i] || testimonialData.text}
                  </motion.p>
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "100%",
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Call to Action */}
          <motion.div
            className="text-center mt-12 md:mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="text-[#6C3D1D] font-medium text-lg md:text-xl mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Join thousands of satisfied customers
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
