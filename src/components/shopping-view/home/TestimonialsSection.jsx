// src/components/shopping-view/home/TestimonialsSection.jsx - SIMPLIFIED ANIMATIONS
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

  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section ref={ref} className="relative">
      <motion.div
        className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-[#f9f6ef] via-[#f4efd6] to-[#ded6c1] relative"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Simplified Header */}
          <motion.div
            className="text-center mb-12 md:mb-16 lg:mb-20"
            variants={fadeInUp}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-faux text-[#6C3D1D] mb-4">
              testimonials
            </h2>
            <p className="text-gray-600 font-medium max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
              Hear what our valued customers have to say about their Darzie's
              Couture experience
            </p>
          </motion.div>

          {/* Simplified Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: testimonialData.count }, (_, i) => (
              <motion.div
                key={i}
                className="group"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#eee] transition-all duration-300 group-hover:shadow-xl group-hover:border-[#C4BA97]/30">
                  {/* Simple quote mark */}
                  <div className="text-4xl text-[#C4BA97]/30 font-serif leading-none mb-4">
                    "
                  </div>

                  {/* Testimonial text */}
                  <p className="text-[#6C3D1D] text-sm md:text-base leading-relaxed font-medium text-center">
                    {testimonialData.variations[i] || testimonialData.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Simplified Call to Action */}
          <motion.div
            className="text-center mt-12 md:mt-16"
            variants={fadeInUp}
          >
            <p className="text-[#6C3D1D] font-medium text-lg md:text-xl">
              Join thousands of satisfied customers
            </p>
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
