import { tv } from "tailwind-variants";

export const button = tv({
  base: "rounded-sm shadow-md px-4 py-2",
  variants: {
    bg_color: {
      primary: "bg-orange-500 ",
      secondary: "bg-orange-500",
    },
    text_color: {
      white: "text-white",
      black: "text-black",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "px-4 py-3 text-lg",
    },
    hover: {
      cursor:
        "hover:cursor-pointer shadow-lg transition-all duration-200 ease-in-out hover:bg-orange-600 hover:text-white",
    },
  },
});
