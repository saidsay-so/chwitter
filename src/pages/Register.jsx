import React from "react";
import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import "./Register.css";

const Register = ({}) => {
  return (
    <form
      className="register"
      onSubmit={(e) => console.log(e.preventDefault())}
    >
      <Input name="login" label="Login" required listener={() => {}} />
      <Input
        name="password"
        label="Mot de passe"
        type="password"
        required
        listener={() => {}}
      />
      <SimpleButton label="Se connecter" />
    </form>
  );
};

export default Register;
