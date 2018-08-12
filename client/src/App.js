import React, { Component } from "react";
import LinkedIn from "./components/LinkedIn/LinkedIn";
import axios from "axios";
import { FaMapMarkerAlt, FaEnvelope, FaUserAlt } from "react-icons/fa";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null, // logged in user, null if no one is logged in
      fetchingData: false // check if client is fetching data
    };
  }

  componentDidMount() {
    if (localStorage.jwt) {
      this.setState({
        fetchingData: true
      });
      axios
        .get("/get-logged-user", {
          headers: { Authorization: `Bearer ${localStorage.jwt}` }
        })
        .then(res => {
          this.setState({
            user: res.data,
            fetchingData: false
          });
        })
        .catch(err => {
          console.log("e", err);
        });
    }
  }

  logout = () => {
    localStorage.jwt = "";
    this.setState({
      user: null
    });
  };

  callback = ({ code, redirectUri }) => {
    this.setState({
      fetchingData: true
    });
    axios
      .post("/auth/linkedin/get-linkedin-token", {
        code,
        redirectUri
      })
      .then(res => {
        axios
          .post("/auth/linkedin/token", res.data)
          .then(res => {
            localStorage.jwt = res.data.jwt;
            this.setState({
              user: res.data.user,
              fetchingData: false
            });
          })
          .catch(err => console.log("errrr", err));
      })
      .catch(err => console.log("err", err));
  };

  render() {
    const scope = [
      "r_basicprofile",
      "r_emailaddress",
      "w_share",
      "rw_company_admin"
    ];
    const clientId = "81hgqjt8upjpv4";

    const { user, fetchingData } = this.state;

    return (
      <div className="container">
        <div className="header clearfix mt-5">
          <h3 className="text-muted">Your LinkedIN Profile</h3>
        </div>
        <div className="jumbotron">
          {/* if user not authenticated, show linkedin button else show user data */}
          {/*display the message if client is fetching data*/}
          {(fetchingData && "Fetching data... ") ||
            (!user ? (
              <div>
                <LinkedIn
                  text="Login with LinkedIN"
                  clientId={clientId}
                  callback={this.callback}
                  scope={scope}
                  className="btn btn-primary"
                />
              </div>
            ) : (
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

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.logout}
                >
                  Log Out
                </button>
              </div>
            ))}
        </div>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }
}

export default App;
