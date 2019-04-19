import React, { Component } from 'react';
import './css/bootstrap.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

var tracks = ["Song 1", "Song 2", "Song 3", "Song 4", "Song 5"];
var listItems = tracks.map((tracks) =>
  <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button>{tracks}</li>
);

class App extends Component {

    // Get access token to be able to fetch data from the Spotify API
    constructor() {
      super();
      const params = this.getHashParams();
      const token = params.access_token;
      if (token) {
          spotifyApi.setAccessToken(token);
      }
      this.state = {
          loggedIn: token ? true : false,
          spotifyAccount: {accountName: 'Not Logged In', accountPic: ''},
          
          playlistName:'Playlist Name',
          search: '',
          };
          
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
      }
    

    handleChange(event) {
        this.setState({search: event.target.value});
      }
    
    handleSearch(event) {
        alert(this.search.value);
        event.preventDefault();
    }
    
    changePlaylistName = (event) =>  {
        this.setState({
        playlistName: event.target.value 
          })
    }
    // Using code from authorization_code/public/index.html
    // (https://github.com/spotify/web-api-auth-examples)
    // Extracts token params from hash string of the URL into an object with key-value pairs.
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
    // Using library provided by JMPerez/spotify-web-api-js
    // (https://github.com/JMPerez/spotify-web-api-js)
    getConnectedAccount() {
        spotifyApi.getMe()
            .then((response) => {
                this.setState( {
                    spotifyAccount: {
                        accountName: response.display_name,
                        accountPic: response.images[0].url
                    }
                });
            })
    }

    joinRoom() {
        // 
    }

    // Display our data
    render() {
        return (
          <div className="App">
            <h1 class="cover-heading">DJFY</h1>
            <div>
                Spotify Account: {this.state.spotifyAccount.accountName}
            </div>
            <div>
                <img  src={this.state.spotifyAccount.accountPic} style={{ height: 100 }}/>
                <br /> <br />
            </div>

            {/* Show button to check spotify account */}
            {
                this.state.loggedIn &&
                <button class="btn btn-sm btn-primary" onClick={() => this.getConnectedAccount()}>
                    ShowAccount
                </button>
            }

            <br /> <br /> <br />
            <p>
                Connect to Spotify &nbsp;
                <a href="http://localhost:8888" class="btn btn-lg btn-secondary">Connect</a>

                &nbsp;&nbsp;&nbsp;&nbsp;{/* Adding space in between the two buttons */}

                Join Room &nbsp;
                <button class="btn btn-lg btn-secondary" onClick={() => this.joinRoom()}>Join</button>
            </p>

            <h2>{this.state.playlistName}</h2>
            <h3>{this.state.search}</h3>

            <ul align = "left">
            <h2>{this.state.playlistName}</h2> 
            <form onSubmit={this.handleSubmit}>
              <label>
                Search:
                <textarea  type = 'text' value={this.state.search} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Search" />
            </form>
              
                  <br/> <br/>
                  {listItems}
            </ul> 

          </div>
        );
    }
}



export default App;
