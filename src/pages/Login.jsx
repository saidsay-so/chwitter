import React, { useState } from "react";
import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import "./Login.css";

const Login = ({ submitAction }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login">
      <h1>Se connecter</h1>
      <form
        className="input-container"
        onSubmit={(e) => {
          e.preventDefault();
          submitAction(login, password);
        }}
      >
        <Input
          name="login"
          label="Login"
          required
          value={login}
          listener={setLogin}
        />
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
    </div>
  );
};

export default Login;
