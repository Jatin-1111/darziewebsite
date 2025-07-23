import ShoppingHeader from "../../components/shopping-view/header"; // Update path if needed
import ShoppingFooter from "../../components/shopping-view/footer";


const ReturnPolicy = () => {
  return (
    <>
      <ShoppingHeader />
      <main className="max-w-5xl mx-auto px-4 py-16 text-gray-800 font-josefin">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#6C3D1D]">
          Refund, Returns & Replacement Policy
        </h1>

        <section className="mb-10 space-y-4">
          <p>
            We have a <strong>strict no return and no refund policy</strong>. However, we can replace defective products — the extent of defect and eligibility for replacement is solely at our discretion.
          </p>
          <p>
            To ensure your product is eligible for corrective action, please <strong>contact us within 24 hours</strong> of receiving the product.
          </p>
          <p>
            As our products involve <strong>customisation</strong> (both unstitched and stitched), any discrepancy in size, damage, or defects will be addressed through <strong>alteration or correction</strong>.
          </p>
          <p>
            <strong>Shipping costs for returning the product</strong> (whether for replacement or alteration) must be borne by the customer.
          </p>
          <p>
            Once we receive and inspect the returned product, you will be notified via email about the status of your replacement — whether it is approved or rejected.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
          <p className="mb-2">
            If you wish to exchange a product, email us at:{" "}
            <a href="mailto:darziescouture@gmail.com" className="underline text-[#6C3D1D]">
              darziescouture@gmail.com
            </a>
          </p>
          <p>
            Then send your item to the following address:
            <br />
            <strong>Darzie’s Couture</strong><br />
            SCO 22-23, Sector 9-D,<br />
            Madhya Marg, Chandigarh
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Customisation Policy</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>We offer customisation of unstitched products and modification/alteration of stitched products.</li>
            <li>You must provide accurate body measurements using our <strong>"Measurement Form"</strong>.</li>
            <li>Customisation, modification, or alteration charges will apply as per mutual agreement via chat.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p>
            For any questions related to our policies, please contact us at:
            <br />
            <a href="mailto:rajnigupta655@gmail.com" className="underline text-[#6C3D1D]">
              rajnigupta655@gmail.com
            </a>
          </p>
        </section>
      </main>
      <ShoppingFooter />
    </>
  );
};

export default ReturnPolicy;