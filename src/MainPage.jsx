import React from "react";
import NavigationPanel from "./NavigationPanel";
// import Register from "./Register"
import Message from "./components/Message";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isConnected: false };
  }

  getConnected = () => {
    this.setState({ isConnected: true });
  };

  setLogout = () => {
    this.setState({ isConnected: false });
  };

  render() {
    // const component = this.state.isConnected
    //     ? <Register />
    //     : <Register />;

    return (
      <main>
        <NavigationPanel
          login={this.getConnected}
          logout={this.setLogout}
          isConnected={this.state.isConnected}
        />
      </main>
    );
  }
}
