import React from "react";

const Input = ({ name, prettyName, type, listener }) => {
  return (
    <div>
      <label htmlFor={name}>{prettyName}</label>
      <input
        name={name}
        type={type}
        onChange={(ev) => listener(ev.target.value)}
      />
    </div>
  );;
};

export default Input;
