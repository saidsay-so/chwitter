import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import "./SimpleButton.css";
import cx from "classnames";

interface SimpleButtonProps extends ComponentPropsWithoutRef<"button"> {
  label?: ReactNode;
  /**
   * Indique si le bouton doit être arrondi
   */
  round?: boolean;
}

/**
 * Bouton
 */
const SimpleButton = ({
  label,
  className,
  round,
  children,
  ...props
}: SimpleButtonProps) => (
  <button {...props} className={cx("button", className, { round })}>
    {label || children}
  </button>
);

export default SimpleButton;
