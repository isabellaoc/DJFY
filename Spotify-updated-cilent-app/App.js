import React, { Component } from 'react';
import './css/bootstrap.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

var tracks = ["Song 1", "Song 2", "Song 3", "Song 4", "Song 5"];
var listItems = tracks.map((tracks) =>
  <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button>{tracks}</li>
);

var snapshot = '';
var currentTrack = '';



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
          
          playlistName:'',
          roomCode: '',
          value: 'Unchanged'
          };
          
          this.handleChange = this.handleChange.bind(this);
          this.handleSearch = this.handleSearch.bind(this);
        
          this.getHashParams = this.getHashParams.bind(this);
          this.getConnectedAccount = this.getConnectedAccount.bind(this);
          this.createNewPlaylist = this.createNewPlaylist.bind(this);
          this.search = this.search.bind(this);
          this.getTrack = this.getTrack.bind(this);
          this.addTracks = this.addTracks.bind(this);
          this.removeTracks = this.removeTracks.bind(this);
      }
    

    handleChange(event) {
        this.setState({value: event.target.value});
      }
    
    handleSearch(event) {
        this.search(this.state.search);
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
                        accountPic: response.images[0].url,
						Id: response.id
                    }
                });
            })
    }

    joinRoom() {
    	if (this.state.loggedIn) {
      		//enters playlist name
      		/*this.setState( {
        		roomCode: Math.random() * 99999999,
        		playlistName: 'Name that is entered'
      		})
          this.createNewPlaylist();*/
          var x = document.getElementById("joinroom");
          var text = "";
          text = x.elements[0].value;
          console.log("code: " + text);
          //check if its a legal inputted code (4 capital characters)
          //check if the database has the inputted code
          //if the database has that code, display the corresponding playlist
          //if it doesnt then error out
          
          //enter room
          
    	} 
    	else { //shouldnt need the if else statement
      		//get room code input
          //enter room
          var x = document.getElementById("joinroom");
          var text = "";
          text = x.elements[0].value;
          console.log("code: " + text);
    	}
  }

  makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     for (var i = 0; i < length; i++)
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     return text;
   }

  createRoom() {
    if (this.state.loggedIn) {
        //enters playlist name
        this.setState( {
          roomCode: this.makeid(4),
          playlistName: this.state.value
        })
        var x = document.getElementById("createroom");
        var playlistname = "";
        playlistname = x.elements[0].value;
        var roomcode = this.makeid(4)
        console.log("playlistname: " + playlistname);
        console.log("room code: " + roomcode)
        
        this.createNewPlaylist();
        //enter room
        //Spotify calls: makeplaylist(playlistname)
        //save to database the room code, spotify access token, playlist name
        //display the playlist
    } 
    else {
        //get room code input
        //enter room
        alert("You need to connect to Spotify before you can create a room.");
        var x = document.getElementById("createroom");
        var playlistname = "";
        playlistname = x.elements[0].value;
        var roomcode = this.makeid(4)
        console.log("playlistname: " + playlistname);
        console.log("room code: " + roomcode)
        //this shouldn't create a code. I only have it here for testing purposes. 
        //if its not logged in they shouldny be able to make a room
    }
}

/*createlink() { 
  var code = makeid(4);
  console.log("test")
  var url = "playlist.html?x=" + code;
  var element = document.getElementById('YOUR_ID');
  element.setAttribute("href",url)
  return code;
}*/


	
	createNewPlaylist(id)	{
		spotifyApi.createPlaylist(id)
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
	
	search(q) {
		spotifyApi.search(q, 'track')
		.then((response) => {
			this.setState( {
				results: response.track.items
			});
		})
		var list = this.state.results.map((results) =>
			<li>{this.state.results.name}</li>
		);
	}
	
	getTrack(traId) {
		spotifyApi.getTrack(traId)
			.then((response) => {
				this.setState( {
					newTrack: response.uri
				});				
			})
	}
	
	addTracks(snId) {
		var uri = this.state.getTrack.newTrack
		spotifyApi.addTracksToPlaylist(snId, uri)
			.then((response) => {
				this.setState( {
					snId: response.snapshot_id
				});
			})
	}
	
	removeTracks(snId) {
		var uri = this.state.getTrack.newTrack
		spotifyApi.removeTracksFromPlaylistWithSnapshotId(snId, uri)
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
            <div class="row">
              <div class="col-sm-6">
                <div class ="row">
                  <div class="col-lg-6">
                  </div>
                  <div class="col-lg-6">
                    Spotify Account: {this.state.spotifyAccount.accountName}
                    <img  src={this.state.spotifyAccount.accountPic} style={{ height: 100 }}/>
                    <br /> <br /> {/* Show button to check spotify account */}
                  {
                    this.state.loggedIn &&
                    <button class="btn btn-sm btn-primary" onClick={() => this.getConnectedAccount()}>
                        ShowAccount
                    </button>
                  }
                    <p>Connect to Spotify &nbsp;</p>
                    <a href="http://localhost:8888" class="btn btn-lg btn-secondary">Connect</a>
                    <form id="createroom">
                          <p class="lead">
                            <a>NAME PLAYLIST:</a>
                          </p>
                          <input  type = 'text' value={this.state.search} onChange={this.handleChange} />
                          <br/>
                    </form> 
                    <p class="lead">
                          <a id="YOUR_ID" href="#" onClick={() => this.createRoom()} class="btn btn-lg btn-secondary">CREATE ROOM</a>
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-sm-6">
                <div class ="row">
                  <div class="col-lg-6">
                    <form id="joinroom"> 
                      <p class="lead">
                        <a>ROOM CODE:</a>
                      </p>
                      <input type="text" name="roomcode"/>
                      <br/>
                    </form>
                    Join Room
                    <button class="btn btn-lg btn-secondary" onClick={() => this.joinRoom()}>Join</button>
                  </div>
                  <div class="col-lg-6">
                  </div>
                </div>
              </div>
            </div> {/* Closing div for first row */}
            
            <ul align = "left">
            <h2>{this.state.playlistName} - {this.state.roomCode}</h2>
            <form onSubmit={this.handleSearch}>
              <label>
                Search:
                <input  type = 'text' value={this.state.search} onChange={this.handleChange} />
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