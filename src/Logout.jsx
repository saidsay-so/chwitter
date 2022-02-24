import React from "react";

export default class Logout extends React.Component {
    render() {
        return (
            <button onClick={this.props.logout}>Se déconnecter</button>
        );
    }
}