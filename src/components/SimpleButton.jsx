import React from "react";
import PropTypes from "prop-types";
import "./SimpleButton.css";

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
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
};
