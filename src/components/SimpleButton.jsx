import React from "react";
import "./SimpleButton.css";

export default class SimpleButton extends React.Component {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        className={`button ${this.props.className}`}
      >
        {this.props.icon && <span>{this.props.icon}</span>}
        {this.props.label}
      </button>
    );
  }
}
