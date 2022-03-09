import PropTypes from "prop-types";

import "./Avatar.css";

const Avatar = ({ profileLink, picture, name }) => (
  <div className="avatar">
    <a href={profileLink}>
      <img src={picture} alt={`${name}'s picture`} />
    </a>
  </div>
);

export default Avatar;

Avatar.propTypes = {
  profileLink: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
