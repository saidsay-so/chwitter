import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

export type ColorScheme = "light" | "dark";

interface Context {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

const ColorSchemeContext = createContext<Context>({} as Context);

export const useColorScheme = () => useContext(ColorSchemeContext);

export default function ColorSchemeProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [colorScheme, setColorScheme] = useState(
    (localStorage.getItem("colorscheme") || "dark") as ColorScheme
  );

  const root = document.querySelector(":root") as HTMLElement;

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const callback = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? "dark" : "light";
      setColorScheme(newColorScheme);
    };

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQueryList.addEventListener("change", callback);

    return () => {
      mediaQueryList.removeEventListener("change", callback);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("colorscheme", colorScheme);

    if (colorScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [colorScheme]);

  return (
    <ColorSchemeContext.Provider
      value={{ colorScheme, setColorScheme, toggleColorScheme }}
    >
      <div style={{ colorScheme, display: "contents" }}>{children}</div>
    </ColorSchemeContext.Provider>
  );
}
