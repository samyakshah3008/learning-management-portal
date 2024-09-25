import { navItemsData } from "@/constants/layouts";
import Link from "next/link";
import { FC } from "react";

type Props = {
  activeItem: number;
  isMWeb: boolean;
};

const NavItems: FC<Props> = ({ activeItem, isMWeb }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData.map((navItem, index) => {
          return (
            <Link key={navItem.name} href={navItem.url} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                } text-[18px] px-6 font-Poppins font-[400] `}
              >
                {navItem.name}
              </span>
            </Link>
          );
        })}
      </div>

      {isMWeb ? (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href={"/"} passHref>
              <span
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                PomoSuperLearn
              </span>
            </Link>
          </div>
          {navItemsData.map((navItem, index) => {
            return (
              <Link href={navItem.url} passHref>
                <span
                  className={`${
                    activeItem === index
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } block py-5 text-[18px] px-6 font-Poppins font-[400] `}
                >
                  {navItem.name}
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default NavItems;
