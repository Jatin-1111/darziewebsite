import { Link } from "react-router-dom";
import logo from "../../assets/Logo.svg";

function ShoppingFooter() {
  return (
    <footer className="bg-[#231C13] font-josefin text-white px-4 md:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {/* Logo & Social Icons */}
        <div>
          <img src={logo} alt="logo" className="h-22 w-22" />
          <div className="flex gap-4 mt-4 text-white text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f hover:text-[#CBB47B]"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram hover:text-[#CBB47B]"></i>
            </a>
            <a href="https://tumblr.com" target="_blank" rel="noreferrer">
              <i className="fab fa-tumblr hover:text-[#CBB47B]"></i>
            </a>
            <a href="https://wa.me/919872591994" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp hover:text-[#CBB47B]"></i>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer">
              <i className="fab fa-pinterest hover:text-[#CBB47B]"></i>
            </a>
          </div>
        </div>

        {/* Important Stops */}
        <div className="py-10">
          <h4 className="font-semibold text-lg mb-4">Important Stops</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#CBB47B]">Home</Link>
            </li>
            <li>
              <Link to="/shop/about" className="hover:text-[#CBB47B]">About Us</Link>
            </li>
            <li>
              <Link to="/shop/listing" className="hover:text-[#CBB47B]">Categories</Link>
            </li>
            <li>
              <Link to="/shop/account" className="hover:text-[#CBB47B]">Account</Link>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="py-10">
          <h4 className="font-semibold text-lg mb-4">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/privacypolicy" className="hover:text-[#CBB47B]">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-[#CBB47B]">
                Refund, Return & Replacement
              </Link>
            </li>
            <li>
              <Link to="/shop/account" className="hover:text-[#CBB47B]">Track your Order</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="py-10">
          <h4 className="font-semibold text-lg mb-4">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-2">
              <span className="text-[#CBB47B]">📍</span>
              SCO 22-23, Sector 9-D, Madhya Marg, Chandigarh
            </li>
            <li className="flex gap-2">
              <span className="text-[#CBB47B]">✉️</span>
              <a href="mailto:rajnigupta655@gmail.com" className="hover:text-[#CBB47B]">
                rajnigupta655@gmail.com
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-[#CBB47B]">📞</span>
              <a href="tel:+919872591994" className="hover:text-[#CBB47B]">
                +91 98725 91994
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;

