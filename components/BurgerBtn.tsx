import { Dispatch, SetStateAction } from "react";
import { Button } from "./Button";

interface BurgerBtnProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children?: React.ReactNode;
}

export function BurgerBtn({ menuOpen, setMenuOpen, className, children }: BurgerBtnProps) {
  return (
    <Button
      id="hamburger-menu-btn"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen((prev) => !prev)}
      className={className}
    >
      {children}
    </Button>
  );
}