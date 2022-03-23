import SimpleButton from "./SimpleButton";
import PropTypes from "prop-types";
import "./User.css";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const User = ({
  isFriend,
  profileLink,
  picture,
  name,
  description,
  action,
}) => {
  const label = isFriend ? "➖ Supprimer des amis" : "➕ Ajouter aux amis";
  const className = isFriend ? "friend" : "";

  return (
    <div className={`user ${className}`}>
      <Avatar profileLink={profileLink} picture={picture} name={name} />
      <div className="text">
        <Link to={profileLink} className="name">
          {name}
        </Link>
        <p className="description">{description}</p>
      </div>
      <SimpleButton onClick={action} className="action" label={label} />
    </div>
  );
};

export default User;

User.propTypes = {
  isFriend: PropTypes.bool,
  profileLink: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};
