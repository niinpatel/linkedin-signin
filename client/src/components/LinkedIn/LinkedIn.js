import React, { Component } from "react";
import getURL from "./getURL";
import PropTypes from "prop-types";

class LinkedIn extends Component {
  static propTypes = {
    clientId: PropTypes.string,
    callback: PropTypes.func.isRequired,
    className: PropTypes.string,
    text: PropTypes.node,
    scope: PropTypes.arrayOf(PropTypes.string)
  };

  componentDidMount() {
    this.restart();
  }

  restart = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUri = localStorage.linkedInReactLoginRedirectUri;
    const previousState = localStorage.linkedInReactLogin;

    localStorage.linkedInReactLogin = "";
    localStorage.linkedInReactLoginRedirectUri = "";

    const newState = urlParams.get("state");
    const code = urlParams.get("code");

    let newURL = window.location.pathname;
    urlParams.delete("state");

    if (urlParams.get("error")) {
      urlParams.delete("error");
      urlParams.delete("error_description");
      if (urlParams.toString()) {
        newURL = newURL + "?" + urlParams.toString();
      }

      window.history.replaceState(null, null, newURL);
      return;
    }

    urlParams.delete("code");
    if (urlParams.toString()) {
      newURL = newURL + "?" + urlParams.toString();
    }
    window.history.replaceState(null, null, newURL);

    if (redirectUri && code && previousState === newState) {
      this.props.callback({ code, redirectUri });
    }
  };

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
