import SimpleButton from "./SimpleButton";
import PropTypes from "prop-types";
import "./User.css";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import FriendButton from "./FriendButton";

const User = ({
  isFriend,
  profileLink,
  picture,
  name,
  description,
  action,
}) => {
  return (
    <div className="user">
      <Avatar profileLink={profileLink} picture={picture} name={name} />
      <div className="text">
        <Link to={profileLink} className="name">
          {name}
        </Link>
        <p className="description">{description}</p>
      </div>
      <FriendButton action={action} isFriend={isFriend} />
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
