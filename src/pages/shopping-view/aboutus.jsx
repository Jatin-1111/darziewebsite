import React from "react";

const AboutUs = () => {
  return (
    <div className="font-josefin min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Image Section */}
      <div className="lg:w-1/2 w-full h-[300px] lg:h-auto">
        <img
          src='https://res.cloudinary.com/dpxiwelxk/image/upload/v1754385539/account_azjgs6.jpg'
          alt="Darzie's Couture"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Text Section */}
      <div className="lg:w-1/2 w-full px-6 py-10 lg:px-16 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-800">
          About Darzie's Couture
        </h1>
        <p className="text-gray-700 mb-4 leading-relaxed">
          At <strong>Darzie’s Couture</strong>, fashion isn’t just fabric — it’s a feeling,
          a story, and a bold expression of individuality. Born out of a passion for
          craftsmanship and timeless design, we bring you carefully tailored pieces that
          blend heritage with modern luxury.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Each creation from our atelier is a result of meticulous detailing, skilled hands,
          and a vision to make every customer feel confident and uniquely beautiful. Whether
          it’s traditional wear with a twist or contemporary elegance, our collections are
          designed to stand out.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Based in India, we are proud to celebrate local artistry, support sustainable fashion,
          and deliver couture that speaks from the heart. Thank you for being part of our journey.
        </p>
        <p className="text-gray-700 font-medium mt-6">
          With style and grace,  
          <br />
          <span className="italic">Team Darzie's Couture</span>
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
