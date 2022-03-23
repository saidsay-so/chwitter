import React from "react";
import PropTypes from "prop-types";
import "./SimpleButton.css";

const SimpleButton = ({ onClick, label, className = "" }) => (
  <button onClick={onClick} className={`button${" " + className}`}>
    {label}
  </button>
);

export default SimpleButton;

SimpleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
};
