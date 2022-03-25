import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./Avatar.css";

const Avatar = ({ profileLink, picture, name }) => (
  <div className="avatar">
    <Link to={profileLink}>
      <img src={picture} alt={`${name}`} />
    </Link>
  </div>
);

export default Avatar;

Avatar.propTypes = {
  profileLink: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
