import React, { Component } from "react";
import getURL from "./getURL";

class LinkedIn extends Component {
  componentDidMount() {
    const state = localStorage.linkedInReactLogin;
    const redirectUri = localStorage.linkedInReactLoginRedirectUri;
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!redirectUri || !state || !code || state !== urlParams.get("state")) {
      return;
    }

    let newURL = window.location.href.replace(
      `code=${code}&state=${state}`,
      ""
    );
    if (newURL.endsWith("?")) {
      newURL = newURL.slice(0, -1);
    }
    window.history.replaceState(null, null, newURL);

    localStorage.linkedInReactLogin = "";
    localStorage.linkedInReactLoginRedirectUri = "";

    this.props.callback({ code, redirectUri });
  }

  start = () => {
    const { clientId, scope } = this.props;
    const state = Math.random()
      .toString(36)
      .substring(7);
    localStorage.linkedInReactLogin = state;
    localStorage.linkedInReactLoginRedirectUri = window.location.href;
    window.location.href = getURL(clientId, state, scope); // build url out of clientid, scope and state
  };

  render() {
    return (
      <button className={this.props.className} onClick={this.start}>
        {this.props.text}
      </button>
    );
  }
}

export default LinkedIn;
