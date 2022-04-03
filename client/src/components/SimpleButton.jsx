import React from "react";
import PropTypes from "prop-types";
import "./SimpleButton.css";
import cx from "classnames";

/**
 * Bouton
 */
const SimpleButton = ({
  onClick,
  label,
  className,
  round,
  children,
  ...props
}) => (
  <button
    {...props}
    onClick={onClick}
    className={cx("button", className, { round })}
  >
    {label || children}
  </button>
);

export default SimpleButton;

SimpleButton.propTypes = {
  /**
   * Champ standard
   */
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  /**
   * Indique si le bouton doit être arrondi
   */
  round: PropTypes.bool,
};
