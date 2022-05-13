import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import SimpleButton from "../components/SimpleButton";
import { Severity } from "../components/Toast";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";
import { editUser } from "../services/user";
import "./EditProfile.css";

export default function EditProfile() {
  const { user: rawUser, signIn } = useAuth();
  const user = rawUser!;

  const navigate = useNavigate();
  const { report } = useToast();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [description, setDescription] = useState(user.description);

  const submit = () => {
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
        <form
          className="edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="edit-field edit-name">
            <h3>Nom</h3>
            <Input
              label="Nom d'affichage"
              value={displayName}
              listener={setDisplayName}
              maxLength={16}
            />
          </div>
          <div className="edit-field edit-description">
            <h3>Description</h3>
            <Input
              label="Description"
              value={description}
              listener={setDescription}
              maxLength={64}
            />
          </div>
          <div className="edit-buttons">
            <SimpleButton
              label="Annuler"
              onClick={(e) => {
                e.preventDefault();
                navigate(user.profileLink);
              }}
              className="abort-button"
            />
            <SimpleButton label="Confirmer" className="confirm-button" />
          </div>
        </form>
      </div>
    </div>
  );
}
