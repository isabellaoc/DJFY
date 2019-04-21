import React, { Component } from 'react';
import './css/bootstrap.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

var tracks = [''];
var listItems = tracks.map((tracks) =>
  <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button>{tracks.name}</li>
);

var snapshot = '';
var currentTrack = '';

class App extends Component {
    // Get access token to be able to fetch data from the Spotify API
    constructor() {
      super();
      const params = this.getHashParams();
      const token = this.getUrlParams2("access_token");
      if (token) {
		  console.log("setting token...");
          spotifyApi.setAccessToken(token);
      }
      this.state = {
          loggedIn: token ? true : false,
          spotifyAccount: {accountName: 'Not Logged In', accountPic: ''},
          
		  playlistName:'',
	      roomCode: '',
		  value: ''
          };
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

		this.getHashParams = this.getHashParams.bind(this);	
		this.createRoom = this.createRoom.bind(this);
        this.getConnectedAccount = this.getConnectedAccount.bind(this);
        this.createNewPlaylist = this.createNewPlaylist.bind(this);
        this.search = this.search.bind(this);
        this.getTrack = this.getTrack.bind(this);
        this.addTracks = this.addTracks.bind(this);
        this.removeTracks = this.removeTracks.bind(this);
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
	
	 getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          vars[key] = value;
      });
      return vars;
  }



  getUrlParams() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("#access_token");

    console.log("testy: " + c);

    return c;
  } 

  getUrlParams2( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '#' ) + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );

    return ( prop && prop in params ) ? params[ prop ] : params;
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

  //makeid(length) {
    //var text = "";
    //var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     //for (var i = 0; i < length; i++)
       //text += possible.charAt(Math.floor(Math.random() * possible.length));
     //return text;
   //}

  createRoom(id) {
    if (this.state.loggedIn) {
        //enters playlist name
		var playlistName = ''
        this.setState( {
          roomCode: window.location.href,
          playlistName: 'Name that is entered'
        })
        //enter room
		this.createNewPlaylist(id, playlistName);

        var x = document.getElementById("createroom");
        var playlistname = "";
        playlistname = x.elements[0].value;
        var roomcode = window.location.href;
        console.log("playlistname: " + playlistname);
        console.log("room code: " + roomcode);
		this.createNewPlaylist();
		//var url = window.location.href;// + 
        //enter room
        //Spotify calls: makeplaylist(playlistname)
        //save to database the room code, spotify access token, playlist name
        //display the playlist
        var token = this.getUrlParams2("access_token");
        console.log("token create room: " + token);
        spotifyApi.setAccessToken(token);
        console.log("create room user id: " + spotifyApi.getMe().id)
      }

    else {
        //get room code input
        //enter room
        alert("You need to connect to Spotify before you can create a room.");
        var token2 = this.getUrlParams("access_token");
        var token = this.getUrlParams2("access_token");
        console.log("token create room: " + token);
        spotifyApi.setAccessToken(token);
        console.log("create room user id: " + spotifyApi.getMe().id)
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

createNewPlaylistCallback(error, value) {
  //console.log("playlist callbacK");
    //var playlistID = value.id;
    //var url = window.location.href + "?x=" + playlistID;
   // console.log("playlist ID from callback: " + playlistID);
  if(error!=null) {
    //get the playlist ID
    var playlistID = value.id;
    var url = window.location.href + "?x=" + playlistID;
    console.log("playlist ID: " + playlistID);
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

	createNewPlaylist(id, n)	{
		var snId = '';
		var playlistObject = spotifyApi.createPlaylist(id,null,this.createNewPlaylistCallback())
			.then((response) => {
				this.setState( {
					newPlaylist: {
						name: response.name,
						//snapshot is most up to date version of the playlist its called from
						snId: response.snapshot_id,
					}
				});
			})
		snapshot = snId
		var playlistID = playlistObject.id; 
		console.log("playlist ID not from callback: " + playlistID)
			
		var name = {
				name: n
		}
		spotifyApi.changePlaylistDetails(snId, name)
	}
	
	//types.join is a mystery
	search(q) {
		spotifyApi.search(q, 'track')
		.then((response) => {
			this.setState( {
				//gets an array of items from within a package object
				results: response.track.items
			});
		})
		//want to make these clickable so that currentTrack gets the id
		var list = this.state.results.map((results) =>
			<li>{this.state.results.name}</li>
		//currentTrack = 'stores the track id'	
		//getTrack(currentTrack)	
		);
	}

	//traId is the id of the track object, not playlist or user
	getTrack(traId) {
		spotifyApi.getTrack(traId)
			.then((response) => {
				this.setState( {
					name: response.name,
					//uri is a resource identifer to locate an artist, album, or track
					newTrack: response.uri
				});				
			})
		//display name of track
		currentTrack = newTrack
		//add track button onClick() => addTracks
		//first button = addTracks()
		//second button = removeTracks()
	}
	
	
	addTracks() {
		spotifyApi.addTracksToPlaylist(snapshot, currentTrack)
			.then((response) => {
				this.setState( {
					snId: response.snapshot_id
				});
			})
		//updates the tracks array everytime a new track is added	
		//spotifyApi.getPlaylist(snapshot)
			//.then((response) => {
				//tracks: response.tracks
			//});
		//tracks = tracks
		snapshot = snId
	}

	removeTracks() {
		spotifyApi.removeTracksFromPlaylistWithSnapshotId(snapshot, currentTrack)
			.then((response) => {
				this.setState( {
					snId: response.snapshot_id
				});
			})
			//updates when a track is removed
			//spotifyApi.getPlaylist(snapshot)
				//.then((response) => {
					//tracks: response.tracks
				//});
			//tracks = tracks
			snapshot = snId
	}

    // Display our data
    render() {
		var us = this.state.spotifyAccount
        return (
          <div className="App">
            <h1 class="cover-heading">DJFY</h1>
            <div class="row">
              <div class="col-sm-6">
                <div class ="row">
                  <div class="col-lg-6">
                  </div>
                  <div class="col-lg-6">
                    Spotify Account: {" "+ this.state.spotifyAccount.accountName + " "}
					ID: {this.state.spotifyAccount.id}
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
                          <input type="text" name="playlistname"/>
                          <br/>
                    </form> 
                    <p class="lead">
                          <a id="YOUR_ID" href="#" onClick={() => this.createRoom(us.id)} class="btn btn-lg btn-secondary">CREATE ROOM	</a>
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
                    <button class="btn btn-lg btn-secondary" onClick={() => this.createRoom()}>Join</button>
                  </div>
                  <div class="col-lg-6">
                  </div>
                </div>
              </div>
            </div> {/* Closing div for first row */}
            <h2>{this.state.playlistName} - {this.state.roomCode}</h2>
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