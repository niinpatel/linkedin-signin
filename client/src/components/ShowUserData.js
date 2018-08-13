import React, { Component } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaUserAlt } from "react-icons/fa";

class ShowUserData extends Component {
  render() {
    let { user, logout } = this.props;
    return (
      <div>
        <h1>{user.name}</h1>
        <p className="lead">{user.headline}</p>

        <p>{user.summary}</p>
        <p>
          <a
            className="btn btn-lg btn-success"
            href={user.linkedinProfileURL}
            role="button"
          >
            <FaUserAlt /> Visit LinkedIn Profile
          </a>
        </p>

        <p>
          <FaEnvelope /> {user.email}
        </p>
        <p>
          <FaMapMarkerAlt /> {user.location}
        </p>

        <button type="button" className="btn btn-secondary" onClick={logout}>
          Log Out
        </button>
      </div>
    );
  }
}

export default ShowUserData;
