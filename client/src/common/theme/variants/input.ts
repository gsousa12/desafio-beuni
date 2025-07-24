import { tv } from "tailwind-variants";

export const inputVariant = tv({
  base: "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500 transition-colors pr-10",
  variants: {
    text_color: {
      white: "text-white",
      black: "text-black",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "px-4 py-3 text-lg",
    },
  },
});
