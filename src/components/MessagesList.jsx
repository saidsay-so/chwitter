import React from "react";
import Message from "./Message";

export default class MessagesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.messages.map((msg) => (
          <li>
            <Message {...msg} />
          </li>
        ))}
      </ul>
    );
  }
}
