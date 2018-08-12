import React, { Component } from "react";
import LinkedIn from "./components/LinkedIn/LinkedIn";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null // logged in user
    };
  }

  componentDidMount() {
    if (localStorage.jwt) {
      axios
        .get("/get-logged-user", {
          headers: { Authorization: `Bearer ${localStorage.jwt}` }
        })
        .then(res => {
          this.setState({
            user: res.data
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
              user: res.data.user
            });
          })
          .catch(err => console.log("errrr", err));
      })
      .catch(err => console.log("err", err));
  };

  render() {
    // if user not authenticated, show linkedin button
    // else show user data
    const scope = [
      "r_basicprofile",
      "r_emailaddress",
      "w_share",
      "rw_company_admin"
    ];
    return this.state.user ? (
      <div>
        {this.state.user.linkedinId}

        <button onClick={this.logout}>Logout</button>
      </div>
    ) : (
      <div>
        <LinkedIn
          text="Login Now"
          clientId="81hgqjt8upjpv4"
          callback={this.callback}
          scope={scope}
        />
      </div>
    );
  }
}

export default App;
