import React from "react";
import PropTypes from "prop-types";
import "./SimpleButton.css";

/**
 * Bouton
 */
const SimpleButton = ({ onClick, label, className = "", round }) => (
  <button
    onClick={onClick}
    className={`button${" " + className + (round ? " round" : "")}`}
  >
    {label}
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
