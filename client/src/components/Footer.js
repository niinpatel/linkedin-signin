import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()}</p>
      </footer>
    );
  }
}
