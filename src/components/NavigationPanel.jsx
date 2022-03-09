import PropTypes from "prop-types";
import "./NavigationPanel.css";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Avatar from "../components/Avatar";
import SimpleButton from "./SimpleButton";

const NavigationPanel = ({
  authAction,
  createMessage,
  picture,
  name,
  profileLink,
  isConnected,
  page = "48teur",
}) => {
  const ButtonTag = isConnected ? LogoutButton : LoginButton;

  return (
    <aside className="panel">
      <h2 className="title">{page}</h2>

      {isConnected && (
        <div className="user-info">
          <Avatar picture={picture} name={name} profileLink={profileLink} />
          <a href={profileLink}>{name}</a>
        </div>
      )}

      <div className="auth-action">
        <ButtonTag onClick={authAction} />
      </div>

      {isConnected && (
        <SimpleButton
          className="create-message"
          label="📣 &nbsp; 8ter"
          onClick={createMessage}
        />
      )}
    </aside>
  );
};

export default NavigationPanel;

NavigationPanel.propTypes = {
  authAction: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  picture: PropTypes.string,
  name: PropTypes.string,
  profileLink: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired,
};
