import React from "react";
import Input from "./Input";

export default class Register extends React.Component {
  render() {
    // const { getConnected } = this.props

    return (
      <div>
        <Input name="login" prettyName="Login" type="text" />
        <Input name="password" prettyName="Password" type="password" />
      </div>
    );
  }
}
