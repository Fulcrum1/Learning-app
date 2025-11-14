"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect ne s'exécute que côté client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Pendant le SSR, retourne un placeholder neutre
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" disabled>
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {theme === "dark" ? (
        <Button variant="outline" size="icon" onClick={() => setTheme("light")}>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" onClick={() => setTheme("dark")}>
          <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
        </Button>
      )}
    </div>
  );
}
