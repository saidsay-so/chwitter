import React, { useState } from "react";
import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import "./Register.css";

const Register = ({ onSubmit }) => {
  const [password, setPassword] = useState("")  


  return (
    <form
      className="register"
      onSubmit={onSubmit}
    >
      <Input name="login" label="Login" required listener={() => {}} />
      <Input
        name="password"
        label="Mot de passe"
        type="password"
        required
        value={password}
        listener={setPassword}
      />
      <SimpleButton label="Se connecter" />
    </form>
  );
};

export default Register;
