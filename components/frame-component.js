import { useEffect, useState } from "react";
import { Button, Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { RiArrowDownSFill, RiMenu3Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Text } from "@mantine/core";
import { useAuth } from "../context/authContext";

const FrameComponent = ({ className = "" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { isAuthenticated, logout, handleGoogleSignIn } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLoginSignup = () => {
    router.push("/login");
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  const isActiveLink = (path) => {
    return router.pathname === path
      ? "text-darkorange font-semibold"
      : "text-gray-100";
  };

  return (
    <header
      className={`w-full flex flex-col items-center gap-4 pt-4 ${className}`}
    >
      <div className="flex items-center justify-between w-11/12">
        {/* Logo */}
        <div>
          <Image
            loading="lazy"
            width={87}
            height={28}
            alt="Logo"
            src="/image-5@2x.png"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-16 hover:text-darkorange font-medium">
          <Link href="/" className={`${isActiveLink("/")}`}>
            Home
          </Link>
          <Link href="/showroom" className={`${isActiveLink("/showroom")}`}>
            Showroom
          </Link>
          <Link href="/pricing" className={`${isActiveLink("/pricing")}`}>
            Pricing
          </Link>
          <Link
            href="/products"
            className={`${isActiveLink("/products")} flex items-center`}
          >
            Products
            <RiArrowDownSFill className="text-black" />
          </Link>
          <Link href="/blog" className={`${isActiveLink("/blog")}`}>
            Blog
          </Link>
        </nav>

        {/* Auth Buttons or Avatar */}
        <div className="hidden md:flex text-gray-100 gap-4 items-center">
          {!isAuthenticated ? (
            <>
              <Button
                className="text-gray-300 no-underline"
                onClick={handleLoginSignup}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  router.push("/signup");
                }}
                disableElevation
                variant="contained"
                sx={{
                  textTransform: "none",
                  background: "#ff733b",
                  borderRadius: "50px",
                  "&:hover": { background: "#ff733b" },
                }}
              >
                Sign up For Free
              </Button>
            </>
          ) : (
            <>
              <FaHeart className="text-red-500 w-[25px] h-[25px]" />
              <Button
                className="text-orange-600 font-bold no-underline"
                onClick={logout}
              >
                Logout
              </Button>
              <Image
                src={
                  session
                    ? session.user?.image
                    : "https://avatar.iran.liara.run/public"
                }
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </>
          )}
        </div>

        {/* Mobile Burger Icon */}
        <div className="block md:hidden">
          <IconButton onClick={toggleMenu}>
            <RiMenu3Line size={24} />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={menuOpen} onClose={toggleMenu}>
        <div className="w-64 p-4 flex flex-col gap-4">
          <IconButton onClick={toggleMenu} className="self-end">
            <AiOutlineClose size={24} />
          </IconButton>
          <nav className="flex flex-col gap-4 font-medium text-gray-100">
            <Link href="/" className="no-underline" onClick={toggleMenu}>
              Home
            </Link>
            <Link
              href="/showroom"
              className="no-underline font-semibold text-darkorange"
              onClick={toggleMenu}
            >
              Showroom
            </Link>
            <Link href="/pricing" className="no-underline" onClick={toggleMenu}>
              Pricing
            </Link>
            <Link
              href="/products"
              className="flex items-center no-underline"
              onClick={toggleMenu}
            >
              <Text>Products </Text>
              <RiArrowDownSFill />
            </Link>
            <Link href="/blog" className="no-underline" onClick={toggleMenu}>
              Blog
            </Link>
          </nav>
          <div className="flex flex-col mt-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  className="no-underline bg-orange-500 text-white mb-4 rounded-lg"
                  onClick={() => {
                    handleLoginSignup();
                    toggleMenu();
                  }}
                >
                  Login
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleGoogleSignIn}
                  className="text-gray-300 no-underline border border-orange-600 rounded-xl mb-4"
                >
                  Sign in with Google
                </Button>
                <Button
                  onClick={() => {
                    router.push("/signup");
                    toggleMenu();
                  }}
                  disableElevation
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    background: "#ff733b",
                    borderRadius: "50px",
                    "&:hover": { background: "#ff733b" },
                  }}
                >
                  Sign up For Free
                </Button>
              </>
            ) : (
              <>
                <FaHeart className="text-red-600 w-[25px] h-[25px]" />
                <Button
                  variant="filled"
                  className="text-orange-600 font-bold no-underline"
                  onClick={logout}
                >
                  Logout
                </Button>
                <Image
                  src={
                    session?.user?.image ||
                    "https://avatar.iran.liara.run/public"
                  }
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full self-center"
                />
              </>
            )}
          </div>
        </div>
      </Drawer>
      <div className="w-full border-t border-gray-300 opacity-50" />
    </header>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;
