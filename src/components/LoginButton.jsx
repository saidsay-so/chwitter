import SimpleButton from "./SimpleButton";
import "./LoginButton.css";

const LoginButton = (props) => (
  <SimpleButton {...props} className="login-button" label="Se connecter" />
);

export default LoginButton;

LoginButton.propTypes = {
  ...SimpleButton.propTypes,
  className: undefined,
  label: undefined,
};
