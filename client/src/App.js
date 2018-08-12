import React, { Component } from "react";
import LinkedIn from "./components/LinkedIn/LinkedIn";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      redirectUri: ""
    };
  }
  callback = ({ code, redirectUri }) => {
    console.log(code, redirectUri);

    axios
      .post("http://localhost:5000/get-linkedin-token", { code, redirectUri })
      .then(res => {
        axios
          .post("http://localhost:5000/auth/linkedin/token", res.data)
          .then(console.log)
          .catch(err => console.log("errrr", err));
      })
      .catch(err => console.log("err", err));
  };

  render() {
    return (
      <div>
        <LinkedIn
          text="Login Now"
          clientId="81oynrgqpfcd7f"
          callback={this.callback}
        />
      </div>
    );
  }
}

export default App;
