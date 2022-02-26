import React from "react";
import SimpleButton from "./components/SimpleButton";
import "./NavigationPanel.css";

export default class NavigationPanel extends React.Component {
  render() {
    const button = this.props.isConnected
      ? {
          className: "logout",
          label: "Se déconnecter",
          onClick: this.props.logout,
        }
      : {
          className: "login",
          label: "Se connecter",
          onClick: this.props.login,
        };

    return (
      <nav>
        <h2>Panel</h2>
        <SimpleButton {...button} />
      </nav>
    );
  }
}
