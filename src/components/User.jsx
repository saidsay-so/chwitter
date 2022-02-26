import React from "react";
import "./User.css";

export default class User extends React.Component {
  render() {
    return (
      <div className="user">
        <div className="picture">
          <img src={this.props.picture} alt={`${this.props.name}'s picture`} />
        </div>
        <div>
          <p className="name">{this.props.name}</p>
          <p className="description">{this.props.description}</p>
        </div>
      </div>
    );
  }
}
