import PropTypes from "prop-types";
import React from "react";
import "./Input.css";

const Input = ({
  name,
  label,
  value,
  placeholder,
  type,
  required,
  listener,
}) => {
  return (
    <div className="input">
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(ev) => listener(ev.target.value)}
      />
    </div>
  );
};

export default Input;

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  listener: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};
