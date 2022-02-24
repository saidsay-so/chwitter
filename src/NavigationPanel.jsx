import React from "react";
import Login from "./Login";
import Logout from "./Logout";


export default class NavigationPanel extends React.Component {
    render() {
        const button = this.props.isConnected ?
            <Logout logout={this.props.logout} /> :
            <Login login={this.props.login} />;

        return (
            <nav>
                {button}
            </nav>
        );
    }
}