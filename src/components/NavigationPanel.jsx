import PropTypes from "prop-types";
import "./NavigationPanel.css";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Avatar from "../components/Avatar";

const NavigationPanel = ({
  action,
  picture,
  name,
  profileLink,
  isConnected,
  page = "48teur",
}) => {
  const ButtonTag = isConnected ? LogoutButton : LoginButton;

  return (
    <nav className="panel">
      <h2>{page}</h2>
      <div className="action">
        <ButtonTag onClick={action} />
      </div>
      {isConnected && (
      <div className="user-info">
        <Avatar picture={picture} name={name} profileLink={profileLink} />
        <a href={profileLink}>{name}</a>
      </div>
      )}
    </nav>
  );
};

export default NavigationPanel;

NavigationPanel.propTypes = {
  action: PropTypes.func.isRequired,
  picture: PropTypes.string,
  name: PropTypes.string,
  profileLink: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired,
};
