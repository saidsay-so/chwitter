import { t, Trans } from "@lingui/macro";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import * as y from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import { Severity } from "../components/Toast";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";
import { editUser } from "../services/user";
import "./EditProfile.css";
import { descriptionSchema, displayNameSchema } from "../utils/form-schemas";
import { useEffect } from "react";

const EditProfileInput = y.object({
  displayName: displayNameSchema.required(t`Le pseudo est requis`),
  description: descriptionSchema.required(t`La description est requise`),
});

type EditProfileInput = y.InferType<typeof EditProfileInput>;

export default function EditProfile() {
  const { user: rawUser, signIn } = useAuth();
  const user = rawUser!;

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<EditProfileInput>({
    resolver: yupResolver(EditProfileInput),
  });

  useEffect(() => {
    setValue("displayName", user.displayName);
    setValue("description", user.description);
  }, []);

  const navigate = useNavigate();
  const { report } = useToast();

  const cancel = () => {
    navigate(user.profileLink);
  };

  const submit: SubmitHandler<EditProfileInput> = ({
    displayName,
    description,
  }) => {
    const controller = new AbortController();
    editUser({ displayName, description }, controller.signal)
      .then(() => {
        signIn(null, () => navigate(user.profileLink));
      })
      .catch((error) => report({ severity: Severity.ERROR, error }));
  };

  return (
    <div className="responsive-container">
      <div className="edit-profile">
        <form className="edit-form" onSubmit={handleSubmit(submit)}>
          <div className="edit-field edit-name">
            <h3>
              <Trans>Nom</Trans>
            </h3>
            <Input
              label={t`Nom d'affichage`}
              message={errors.displayName?.message}
              state={errors.displayName ? "error" : undefined}
              {...register("displayName")}
            />
          </div>
          <div className="edit-field edit-description">
            <h3>Description</h3>
            <Input
              label={t`Description`}
              message={errors.description?.message}
              state={errors.description ? "error" : undefined}
              {...register("description")}
            />
          </div>
          <div className="edit-buttons">
            <SimpleButton
              label={t`Annuler`}
              onClick={(e) => {
                e.preventDefault();
                cancel();
              }}
              className="abort-button"
            />
            <SimpleButton label={t`Confirmer`} className="confirm-button" />
          </div>
        </form>
      </div>
    </div>
  );
}
