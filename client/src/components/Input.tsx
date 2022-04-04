import PropTypes from "prop-types";
import { useState } from "react";
import "./Input.css";

/**
 * Champ de saisie de texte
 */
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
        required={required}
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
  /**
   * Champ standard
   */
  name: PropTypes.string.isRequired,
  /**
   * Champ standard
   */
  label: PropTypes.string,
  /**
   * Champ standard
   */
  value: PropTypes.string.isRequired,
  /**
   * Champ standard
   */
  placeholder: PropTypes.string,
  /**
   * Champ standard
   */
  type: PropTypes.string,
  /**
   * Champ standard
   */
  required: PropTypes.bool,
  /**
   * Appelé lors d'une modification
   * @param {string} input Valeur
   */
  listener: PropTypes.func.isRequired,
};
