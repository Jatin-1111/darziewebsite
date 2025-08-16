import { memo } from "react";

const testimonialData = {
  text: "Darzie Couture offers a perfect blend of elegance, style, and craftsmanship. Each piece is thoughtfully designed and impeccably tailored, making you feel confident and unique. Their attention to detail and quality truly sets them apart in the world of fashion.",
  count: 6,
};

const TestimonialsSection = memo(() => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#f9f6ef] to-[#ded6c1]">
      <h2 className="text-5xl font-faux text-center text-[#6C3D1D] mb-12">
        testimonials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
        {Array.from({ length: testimonialData.count }, (_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl shadow-lg border border-[#eee] relative"
          >
            <p className="text-[#6C3D1D] text-sm leading-relaxed font-medium text-center">
              {testimonialData.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
