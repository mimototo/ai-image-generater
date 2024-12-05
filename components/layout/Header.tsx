"use client";

import Link from "next/link";
import ToggleTheme from "./ToggleTheme";

const Header = () => {
  return (
    <header className="mb-10 border-b border-gray-300 dark:border-gray-700">
      <div className="container mx-auto flex max-w-screen-md items-center justify-between px-2 py-3">
        <Link href="/" className="cursor-pointer text-xl font-bold">
          AI Image Generator
        </Link>
        <ToggleTheme />
      </div>
    </header>
  );
};

export default Header;
