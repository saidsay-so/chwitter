import { ComponentPropsWithoutRef, useState, forwardRef } from "react";
import cx from "classnames";
import "./Input.css";

/**
 * Champ de saisie de texte
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      required,
      className,
      children,
      message,
      state,
      ...props
    }: InputProps,
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    return (
      <div
        className={cx(
          "input",
          className,
          { "input-focused": focused },
          { error: state === "error" }
        )}
      >
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
        <input
          name={name}
          {...props}
          onFocus={(ev) => {
            setFocused(true);
            props.onFocus?.(ev);
          }}
          onBlur={(ev) => {
            setFocused(false);
            props.onBlur?.(ev);
          }}
          ref={ref}
        />
        <p className="input-message">{message}</p>
      </div>
    );
  }
);

export default Input;

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  /**
   * Label
   */
  label?: string;
  /**
   * Message à afficher en dessous du champ
   */
  message?: string;
  /**
   * Etat du champ
   */
  state?: "error";
  /**
   * Appelé lors d'une modification
   * @param {string} input Valeur
   */
  listener?: (msg: string) => void;
}
