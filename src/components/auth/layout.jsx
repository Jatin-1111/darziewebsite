import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="font-josefin flex min-h-screen w-full">
      {/* Left section with background image and transparent overlay */}
      <div
        className="hidden lg:flex items-center justify-center w-1/2 px-12 relative" // Added 'relative' for positioning the overlay
        style={{
          backgroundImage: `url(https://res.cloudinary.com/dpxiwelxk/image/upload/v1754394892/Best-4_v8jek0.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Transparency Overlay - adjust opacity-X0 for desired effect */}
        {/* bg-black can be changed to any color for a tinted overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content for the left section, placed above the overlay */}
        <div className="max-w-md space-y-6 text-center text-primary-foreground relative z-10"> {/* Added 'relative z-10' to ensure content is above overlay */}
          <h2 className="font-josefin text-6xl text-[#C4BA97] font-extrabold tracking-tight">
            Welcome to
          </h2>
          <h1 className="font-faux text-[#C4BA97] text-6xl font-extrabold tracking-tight">
            Darzie's Couture
          </h1>
        </div>
      </div>

      {/* Right section for Outlet */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;