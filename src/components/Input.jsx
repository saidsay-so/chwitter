import PropTypes from "prop-types";
import { useState } from "react";
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
  const [reveal, setReveal] = useState(false);

  const revealChar = reveal ? "゠" : "👁";

  return (
    <div className="input">
      {type === "password" && (
        <div className="pass-reveal" onClick={() => setReveal(!reveal)}>
          {revealChar}
        </div>
      )}
      <input
        name={name}
        type={type === "password" ? (reveal ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(ev) => listener(ev.target.value)}
      />
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
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
