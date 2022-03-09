import SimpleButton from "./SimpleButton";
import "./LogoutButton.css";

const LogoutButton = (props) => (
  <SimpleButton {...props} className="logout" label="Se déconnecter" />
);

export default LogoutButton;

LogoutButton.propTypes = {
  ...SimpleButton.propTypes,
  className: undefined,
  label: undefined,
};
