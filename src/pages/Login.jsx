import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Input from "../components/Input";
import LoginButton from "../components/LoginButton";
import { useAuth } from "../providers/AuthProvider";
import "./Login.css";

const Login = ({}) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const before = location.state?.from.pathname ?? "/";

  const loginAction = (e) => {
    e.preventDefault();
    signIn({ login, password }, () => navigate(before));
  };

  return (
    <div className="login">
      <h1>Se connecter</h1>
      <form className="input-container" onSubmit={loginAction}>
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
        <LoginButton />
      </form>
    </div>
  );
};

export default Login;
