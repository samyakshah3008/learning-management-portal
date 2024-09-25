"use client";

import useIsBrowser from "@/utils/hooks/useIsBrowser";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

const ThemeSwitch = () => {
  const isBrowser = useIsBrowser();
  const { theme, setTheme } = useTheme();

  if (!isBrowser) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mx-4">
      {theme == "light" ? (
        <BiMoon
          className="cursor-pointer"
          fill="black"
          size={25}
          onClick={() => setTheme("dark")}
        />
      ) : (
        <BiSun
          size={25}
          fill="white"
          className="cursor-pointer"
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
};

export default ThemeSwitch;
