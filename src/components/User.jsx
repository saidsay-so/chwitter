import React from "react";
import SimpleButton from "./SimpleButton";
import PropTypes from "prop-types";
import "./User.css";

export default class User extends React.Component {
  render() {
    const label = this.props.isFriend
      ? "➖ Supprimer des amis"
      : "➕ Ajouter aux amis";
    const className = this.props.isFriend ? "friend" : "";

    return (
      <div className={`user ${this.props.className} ${className}`}>
        <div className="picture">
          <a href={this.props.profileLink}>
            <img
              src={this.props.picture}
              alt={`${this.props.name}'s picture`}
            />
          </a>
        </div>
        <div className="text">
          <a href={this.props.profileLink} className="name">
            {this.props.name}
          </a>
          <p className="description">{this.props.description}</p>
        </div>
        <SimpleButton
          onClick={this.props.action}
          className="action"
          label={label}
        />
      </div>
    );
  }
}

User.propTypes = {
  isFriend: PropTypes.bool,
  className: PropTypes.string,
  profileLink: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};