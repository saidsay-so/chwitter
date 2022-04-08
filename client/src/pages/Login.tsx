import React, { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import { useAuth } from "../providers/AuthProvider";
import "./Login.css";

const loginStrings = {
  below: "Vous n'avez pas de compte ?",
  action: "Se connecter",
  invert: "Créer un compte",
};

const registerStrings = {
  below: "Vous avez déjà un compte ?",
  action: "Créer un compte",
  invert: loginStrings.action,
};

const Login = () => {
  const { signIn, register } = useAuth();
  const navigate = useNavigate();

  const [registerView, setRegisterView] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const text = registerView ? registerStrings : loginStrings;

  const location = useLocation();
  const before = (location.state as any)?.from?.pathname ?? "/";

  const loginAction: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const action = registerView ? register : signIn;
    //@ts-expect-error
    action({ login, password }, () => navigate(before, { replace: true }));
  };

  return (
    <div className="login">
      <h1>{text.action}</h1>
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
        {registerView && (
          <Input
            name="password"
            label="Confirmer le mot de passe"
            type="password"
            required
            value={password}
            listener={setPassword}
          />
        )}

        <div className="buttons">
          <SimpleButton label={text.action} />
        </div>
      </form>
      <div className="invert-container">
        <p className="text">{text.below}</p>
        <SimpleButton
          className="button"
          label={text.invert}
          onClick={(e) => {
            e.preventDefault();
            setRegisterView(!registerView);
          }}
        ></SimpleButton>
      </div>
    </div>
  );
};

export default Login;
