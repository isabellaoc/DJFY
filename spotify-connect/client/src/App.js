import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
    constructor(){
      super();
      const params = this.getHashParams();
      const token = params.access_token;
      if (token) {
          spotifyApi.setAccessToken(token);
      }
      this.state = {
          loggedIn: token ? true : false,
          spotifyAccount: { accountName: 'Not Logged In' }
      }
    }
    getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      e = r.exec(q)
      while (e) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
         e = r.exec(q);
      }
      return hashParams;
    }

    // Request API data
    getConnectedAccount() {
        spotifyApi.getMe()
            .then((response) => {
                this.setState({
                    spotifyAccount: {
                        accountName: response.display_name
                    }
                });
            })
    }

    render() {
    return (
      <div className="App">
        <a href='http://localhost:8888'> Connect Spotify </a>
        <div>
            Connected Spotify Account: {this.state.spotifyAccount.accountName}
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getConnectedAccount()}>
            Check Account
          </button>
        }
      </div>
    );
  }
}

export default App;
