import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { t } from "@lingui/macro";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as y from "yup";
import { usernameSchema } from "../utils/form-schemas";

import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import { Severity } from "../components/Toast";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";
import "./Login.css";

const LoginInput = y.object({
  register: y.boolean().required(),
  username: usernameSchema.required(t`Le nom d'utilisateur est requis`),
  password: y.string().required(t`Le mot de passe est requis`),
  passwordConfirm: y.string().when("register", {
    is: true,
    then: (s) =>
      s
        .required(t`La confirmation du mot de passe est requise`)
        .equals([y.ref("password")], t`Les mots de passe ne correspondent pas`),
  }),
});

type LoginInput = y.InferType<typeof LoginInput>;

export default function Login() {
  const { signIn, register } = useAuth();
  const { report } = useToast();
  const navigate = useNavigate();

  const [registerView, setRegisterView] = useState(false);
  const {
    register: registerInput,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({ resolver: yupResolver(LoginInput) });

  useEffect(() => {
    registerInput("register", { value: registerView });
  }, []);

  useEffect(() => {
    setValue("register", registerView);
  }, [registerView]);

  const location = useLocation();
  const before = (location.state as any)?.from?.pathname ?? "/";

  const below = registerView
    ? t`Vous avez déjà un compte ?`
    : t`Vous n'avez pas de compte ?`;
  const action = registerView ? t`Créer un compte` : t`Se connecter`;
  const invert = registerView ? t`Se connecter` : t`Créer un compte`;

  const formHandler: SubmitHandler<LoginInput> = ({
    passwordConfirm,
    password,
    username: name,
  }) => {
    if (!registerView || passwordConfirm === password) {
      const action = registerView ? register : signIn;
      action({ name, password }, (err) => {
        if (err) report({ severity: Severity.ERROR, error: err });
        else navigate(before, { replace: true });
      });
    }
  };

  return (
    <div className="login">
      <h1>{action}</h1>
      <form
        className="input-container"
        onSubmit={handleSubmit(formHandler, console.log)}
      >
        <Input
          label={t`Nom d'utilisateur`}
          message={errors.username?.message}
          state={errors.username ? "error" : undefined}
          required
          {...registerInput("username", {
            required: t`Le nom d'utilisateur est requis`,
          })}
        />
        <Input
          label={t`Mot de passe`}
          type="password"
          message={errors.password?.message}
          state={errors.password ? "error" : undefined}
          required
          {...registerInput("password", {
            required: t`Le mot de passe est requis`,
          })}
        />
        {registerView && (
          <Input
            label={t`Confirmer le mot de passe`}
            type="password"
            message={errors.passwordConfirm?.message}
            state={errors.passwordConfirm ? "error" : undefined}
            required
            {...registerInput("passwordConfirm")}
          />
        )}
        <div className="buttons">
          <SimpleButton label={action} />
        </div>
      </form>
      <div className="invert-container">
        <p className="text">{below}</p>
        <SimpleButton
          label={invert}
          onClick={(e) => {
            e.preventDefault();
            setRegisterView(!registerView);
          }}
        ></SimpleButton>
      </div>
    </div>
  );
}
