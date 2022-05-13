import { ComponentPropsWithoutRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import cx from "classnames";
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
  className
}: InputProps) => {
  const [reveal, setReveal] = useState(false);

  const RevealIcon = reveal ? AiFillEyeInvisible : AiFillEye;

  return (
    <div className={cx("input", className)}>
      {type === "password" && (
        <div className="pass-reveal" onClick={() => setReveal(!reveal)}>
          <RevealIcon className="icon" />
        </div>
      )}
      <input
        name={name}
        type={type === "password" ? (reveal ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(ev) => listener((ev.target as HTMLInputElement).value)}
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

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  /**
   * Label
   */
  label: string;
  /**
   * Appelé lors d'une modification
   * @param {string} input Valeur
   */
  listener: (msg: string) => void;
}
