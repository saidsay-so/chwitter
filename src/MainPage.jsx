import React from "react";
import NavigationPanel from "./NavigationPanel";

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isConnected: false };
    }

    getConnected = () => {
        this.setState({ isConnected: true });
    }

    setLogout = () => {
        this.setState({ isConnected: false });
    };

    render() {
        return (
            <main>
                <NavigationPanel login={this.getConnected}
                    logout={this.setLogout} isConnected={this.state.isConnected} />
            </main>
        );
    }
}