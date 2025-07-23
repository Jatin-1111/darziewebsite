import ShoppingHeader from "../../components/shopping-view/header"; // Update path if needed
import ShoppingFooter from "../../components/shopping-view/footer";

const PrivacyPolicy = () => {
  return (
    <>
      <ShoppingHeader />
      <main className="max-w-5xl mx-auto px-4 py-16 text-gray-800 font-josefin">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#6C3D1D]">Privacy Policy</h1>

        <p className="mb-6">
          Welcome to Darzie’s Couture. We respect your privacy and are committed to protecting it through this Privacy Policy. This document explains how we collect, use, and safeguard your information when you visit our website at <a href="https://darziescouture.com" className="text-[#6C3D1D] underline">https://darziescouture.com</a>.
        </p>

        <p className="mb-6">
          By accessing or using our Website, you agree to the terms of this Privacy Policy. If you do not agree, please refrain from using our Website.
        </p>

        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>We at Darzie’s Couture are committed to respect and protect the information provided by you to us.</li>
          <li>Whether it is your address, mobile number, email ID or name, we make sure your information doesn’t leak to undesirable hands or unlawful entities.</li>
          <li>Your privacy is of utmost importance to us.</li>
          <li>On receiving your personal data, we accept your consent for collection, storage, use, disclosure and transfer of data by us for the purpose of transactions made by you for the purchase of product.</li>
          <li>This data collection does not violate any specific provision of law.</li>
        </ul>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-2 font-semibold">a. Personal Information:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and shipping addresses</li>
            <li>Payment details (processed securely by third-party services)</li>
          </ul>
          <p className="mb-2 font-semibold">b. Non-Personal Information:</p>
          <ul className="list-disc list-inside">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device type</li>
            <li>Pages viewed on our Website</li>
            <li>Time and date of visits</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Process orders and payments</li>
            <li>Deliver products and manage shipments</li>
            <li>Communicate regarding inquiries, updates, and promotional offers</li>
            <li>Improve our Website and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Sharing Your Information</h2>
          <p>We do not sell, rent, or trade your personal information. However, we may share your information with:</p>
          <ul className="list-disc list-inside mt-2">
            <li><strong>Service Providers:</strong> To assist with payment processing, shipping, and other essential business functions.</li>
            <li><strong>Legal Authorities:</strong> If required to comply with legal obligations or protect our rights.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
          <p className="mb-2">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="list-disc list-inside">
            <li>Enhance your browsing experience</li>
            <li>Analyze Website performance</li>
            <li>Deliver personalized content and advertising</li>
          </ul>
          <p className="mt-2">You can manage your cookie preferences through your browser settings.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission or storage is 100% secure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Links</h2>
          <p>
            Our Website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before providing your information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="mb-2">Depending on your location, you may have the following rights:</p>
          <ul className="list-disc list-inside">
            <li>Access, correct, or delete your personal information</li>
            <li>Withdraw consent for data processing</li>
          </ul>
          <p className="mt-2">
            To exercise your rights, contact us at <a href="mailto:darziescouture@gmail.com" className="text-[#6C3D1D] underline">darziescouture@gmail.com</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in our practices or legal requirements. Updates will be posted on this page with the effective date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="mt-2">
            <li><strong>Darzie’s Couture</strong></li>
            <li>SCO 22-23, Madhya Marg</li>
            <li>Sector 9D, CHANDIGARH</li>
            <li><strong>Email:</strong> <a href="mailto:darziescouture@gmail.com" className="underline">darziescouture@gmail.com</a></li>
            <li><strong>Phone:</strong> 9872591994</li>
          </ul>
        </section>
      </main>
      <ShoppingFooter />
    </>
  );
};

export default PrivacyPolicy;