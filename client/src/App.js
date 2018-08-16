import React, { Component } from "react";
import LinkedIn from "linkedin-login-for-react";
import axios from "axios";
import ShowUserData from "./components/ShowUserData";
import Footer from "./components/Footer";
import Header from "./components/Header";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null, // logged in user, null if no one is logged in
      fetchingData: false, // check if client is fetching data
      error: "" // to display errors from server
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
          this.setState({
            error: JSON.stringify(err),
            fetchingData: false
          });
          this.logout(); // logout user if there's error
        });
    }
  }

  logout = () => {
    localStorage.jwt = "";
    this.setState({
      user: null
    });
  };

  callback = (error, code, redirectUri) => {
    if (error) {
      this.setState({
        error: error
      });
      return;
    } else {
      this.setState({
        fetchingData: true
      });
      axios
        .post("/auth/linkedin/get-linkedin-token", {
          code,
          redirectUri
        })
        .then(res => {
          axios.post("/auth/linkedin/token", res.data).then(res => {
            localStorage.jwt = res.data.jwt;
            this.setState({
              user: res.data.user,
              fetchingData: false
            });
          });
        })
        .catch(err => {
          console.log(err);
          this.logout(); // logout user if there's error
          this.setState({
            error: JSON.stringify(err),
            fetchingData: false
          });
        });
    }
  };

  render() {
    const scope = [
      "r_basicprofile",
      "r_emailaddress",
      "w_share",
      "rw_company_admin"
    ];
    const clientId = "81hgqjt8upjpv4";

    const { user, fetchingData, error } = this.state;

    return (
      <div className="container">
        <Header />

        {/* if user not authenticated, show linkedin button else show user data */}
        <div className="jumbotron">
          {/*Display error message if there's any */}
          {error && `There was an error.. ${error}`}
          {/*display the message if client is fetching data*/}
          {(fetchingData && "Fetching data... ") ||
            (!user ? (
              <LinkedIn
                text="Login with LinkedIN"
                clientId={clientId}
                callback={this.callback}
                scope={scope}
                className="btn btn-primary"
              />
            ) : (
              <ShowUserData user={user} logout={this.logout} />
            ))}
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
