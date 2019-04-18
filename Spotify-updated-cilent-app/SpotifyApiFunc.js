import React, { Component } from 'react';
import './css/bootstrap.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

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
          spotifyAccount: {accountName: 'Not Logged In', accountPic: ''}
      }
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
                        accountPic: response.images[0].url,
						Id: response.id
                    }
                });
            })
    }
	
	createRoom(){
		let rand = Math.random(99999999)
		
	}
	
	joinRoom(){
		let code = ''
		
	}
	
	createNewPlaylist()	{
		spotifyApi.createPlaylist(this.state.getConnectedAccount.Id)
			.then((response) => {
				this.setState( {
					newPlaylist: {
						name: response.name,
						snId: response.snapshot_id,
						tracks: response.tracks.items
					}
				});
			})
	}
	
	search() {
		spotifyApi.search()
		.then((response) => {
			this.setState( {
				results: response.track.items
			});
		})
	}
	
	getTrack() {
		spotifyApi.getTrack()
			.then((response) => {
				this.setState( {
					newTrack: response.id
				});				
			})
	}
	
	addTracks() {
		spotifyApi.addTracksToPlaylist(this.state.createNewPlaylist.snId)
			.then((response) => {
				this.setState( {
					snId: response.snapshot_id
				});
			})
	}
	
	removeTracks() {
		spotifyApi.removeTracksFromPlaylistWithSnapshotId(this.state.createNewPlaylist.snId)
			.then((response) => {
				this.setState( {
					snId: response.snapshot_id
				});
			})
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
                <img src={this.state.spotifyAccount.accountPic} style={{ height: 100 }}/>
                <br /> <br />
            </div>
            <p class="lead">
                <a href="http://localhost:8888" class="btn btn-sm btn-secondary">CONNECT SPOTIFY</a>
            </p>
            {
                this.state.loggedIn &&
                <button onClick={() => this.getConnectedAccount()}>
                    Check Account
                </button>
            }
          </div>
        );
    }
}

export default App;
