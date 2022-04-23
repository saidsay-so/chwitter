import React, { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import { Severity } from "../components/Toast";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";
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

export default function Login() {
  const { signIn, register } = useAuth();
  const { report } = useToast();
  const navigate = useNavigate();

  const [registerView, setRegisterView] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const text = registerView ? registerStrings : loginStrings;

  const location = useLocation();
  const before = (location.state as any)?.from?.pathname ?? "/";

  const loginAction: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!registerView || (registerView && confirmPass === password)) {
      const action = registerView ? register : signIn;
      action({ name, password }, (err) => {
        if (err) report({ severity: Severity.ERROR, error: err });
        else navigate(before, { replace: true });
      });
    }
  };

  return (
    <div className="login">
      <h1>{text.action}</h1>
      <form className="input-container" onSubmit={loginAction}>
        <Input
          name="username"
          label="Nom d'utilisateur"
          required
          value={name}
          listener={setName}
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
            value={confirmPass}
            listener={setConfirmPass}
          />
        )}
        <div className="buttons">
          <SimpleButton label={text.action} />
        </div>
      </form>
      <div className="invert-container">
        <p className="text">{text.below}</p>
        <SimpleButton
          label={text.invert}
          onClick={(e) => {
            e.preventDefault();
            setRegisterView(!registerView);
          }}
        ></SimpleButton>
      </div>
    </div>
  );
}
