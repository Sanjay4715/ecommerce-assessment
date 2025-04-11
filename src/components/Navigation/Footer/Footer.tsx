"use client";

const Footer = () => {
  return (
    <footer className="w-full text-white bg-[var(--site-primary)] dark:bg-black m-0">
      <div className="flex w-full h-15 items-center justify-center">
        &copy; {new Date().getFullYear()} My Ecommerce Pvt. Ltd
      </div>
    </footer>
  );
};

export default Footer;
