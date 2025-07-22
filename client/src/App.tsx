import "./App.css";
import { button } from "./common/design-system/variants/button";

export const App = () => {
  return (
    <button
      className={button({
        size: "sm",
        bg_color: "secondary",
        hover: "cursor",
        text_color: "primary",
      })}
    >
      Click me now
    </button>
  );
};
