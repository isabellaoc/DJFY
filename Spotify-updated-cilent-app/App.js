import React, { Component } from 'react';
import './css/bootstrap.css';

import SpotifyWebApi from 'spotify-web-api-js';
//import url from 'url-parameters';

const urlListener = require('url-listener')
 
urlListener(event => {
  // your logic here!
  console.log('URL UPDATED!')
})

var spotifyApi = new SpotifyWebApi();
var tracks = [];
var listTracks = tracks.map((tracks) =>
  <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button>{tracks}</li>
);

//var snapshot = '';
//var currentTrack = '';
//var mainid = '';



class App extends Component {

  //This checks if there is a playlist ID currently in the URL
  //this is for the guest users that have the shared link
  //it should immediately print the playlist tracks/info 
   isTherePlaylistID() {
    var idCheck = this.getUrlParams2("playlist_id");
    if(idCheck && idCheck.length >2) {
      console.log("WE HAVE A PLAYLIST ID IN THE URL: " + idCheck);
      this.getPlaylistHelper(idCheck);

    }
  }
    // Get access token to be able to fetch data from the Spotify API
    constructor(props) {
      super(props);
      const token = this.getUrlParams2("access_token");
      console.log("token: " + token);
      if (token) {
        console.log("setting token...");
          spotifyApi.setAccessToken(token);
      }
      this.isTherePlaylistID();
      this.state = {
          loggedIn: token ? true : false,
          spotifyAccount: {accountName: 'Not Logged In', accountPic: '', Id: ''},
          
          playlistName:'',
          roomCode: '',
          value: '',

          };
          
          this.handleChange = this.handleChange.bind(this);
          this.handleSearch = this.handleSearch.bind(this);
        
          //this.getHashParams = this.getHashParams.bind(this);
          this.getConnectedAccount = this.getConnectedAccount.bind(this);
          this.createNewPlaylist = this.createNewPlaylist.bind(this);
          this.createNewPlaylistCallback = this.createNewPlaylistCallback.bind(this);
          this.createNewPlaylistHelper = this.createNewPlaylistHelper.bind(this);
          this.getPlaylistHelper = this.getPlaylistHelper.bind(this);
          this.getPlaylistTracksCallback = this.getPlaylistTracksCallback.bind(this);
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
            var token = this.getUrlParams2("access_token");

           spotifyApi.setAccessToken(token);

    }

    /*joinRoom() {

          var x = document.getElementById("joinroom");
          var text = "";
          text = x.elements[0].value;
          console.log("code: " + text);

          //check if its a legal inputted code (4 capital characters)
          if(this.state.value.length == 4){
            //check if the database has the inputted code
            if(false/* inDatabase(this.state.value.toUpperCase()){
              //if the database has that code, display the corresponding playlist
              //enter room
            }
            else{
              //if it doesnt then error out
              alert(this.state.value.toUpperCase() + " is an invalid room code.");
            }
          }
          else{
            alert(this.state.value.toUpperCase() + " is an invalid room code. \nRoom codes are 4 characters long.")
          }
    
  }*/

  makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     for (var i = 0; i < length; i++)
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     return text;
   }

  async createNewPlaylistHelper(id, name) {
    console.log("helper id: "+ id);
    await this.createNewPlaylist(id, name);
    var playlistID = this.getUrlParams2("x");
    console.log("here is the playlist ID: "+ playlistID);
  }

  createRoom() {
    if (this.state.loggedIn) {
        this.setState( {
          //roomCode: this.makeid(4),
          playlistName: this.state.value
        })

        var x = document.getElementById("createroom");
        var playlistname = "";
        playlistname = x.elements[0].value;
        var token = this.getUrlParams2("access_token");
        fetch('https://api.spotify.com/v1/me', {headers: {'Authorization':'Bearer ' + token}})
            .then(response => response.json())
            .then(data => this.createNewPlaylistHelper(data.id,playlistname));
        console.log("back in createRoom()");
        spotifyApi.setAccessToken(token);
      }
    else {
        //get room code input
        //enter room
        alert("You need to connect to Spotify before you can create a room.");
    }
}


//Callback function thats called when after spotify API runs getPlaylistTracks()
//error is an error object, null if no error
//value is the value if the request succeeded 
//This prints the total tracks, adds the tracks to the tracks array, and prints them
getPlaylistTracksCallback(error, value) {
  console.log("error: " + error);
  console.log("in the callback...totala: "+ value.total);
  var total = value.total;
  console.log("total assigned: "+ total);
  var i;
  for(i=0; i<value.total; i++) {
    tracks.push(value.items[i].track.name); //name of the track
    console.log("track: " + tracks[i]);
    //console.log("track " + i + value.items[i].track.name);
  } 
}

//this calls getPlaylistTracks given the playlist ID
getPlaylistHelper(playlistID) {
  console.log("getting playlist..." + playlistID);
  var token = this.getUrlParams2("access_token");
  spotifyApi.setAccessToken(token);
  spotifyApi.getPlaylistTracks(playlistID,this.getPlaylistTracksCallback);
}

//Callback function thats called when after spotify API runs createPlaylist()
//error is an error object, null if no error
//value is the value if the request succeeded 
//adds the playlist id as a url parameter 
//calls getPlaylistHelper() after getting the playlist id
createNewPlaylistCallback(error, value) {

   console.log("2error: "+error);
   var playlistID = value.id;
 
   console.log("playilstID: " + playlistID);
   var url = window.location.href + "&playlist_id=" + playlistID;
   console.log("2URL TO SHARE: " + url);
   this.getPlaylistHelper(playlistID);

   window.location.assign(url);
   window.location.href = url;

   var idcheck = this.getUrlParams2("playlist_id");
   console.log("playlist id from params: " + idcheck);
   
   //return playlistID;
  }


//id is the user id, playlist name is what the user inputs as the name
//calls createPlaylist() from the spotify api
//has createNewPlaylistCallback as callback function
createNewPlaylist(id, playlistname)	{
  //var playlistID;
spotifyApi.createPlaylist(id,{name:playlistname},this.createNewPlaylistCallback);
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
      //mainid = this.props.id;
      //console.log("im in render: " + mainid);
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
                    {/*user id: {this.state.spotifyAccount.Id}*/}
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
                          <input  type = 'text' onChange={this.handleChange} />
                          <br/>
                    </form> 
                    <p class="lead">
                          <a id="YOUR_ID" onClick={() => this.createRoom()} class="btn btn-lg btn-secondary">CREATE ROOM</a>
                    </p>
                  </div>
                </div>
              </div>

              {/*<div class="col-sm-6">
                <div class ="row">
                  <div class="col-lg-6">

                    <form id="joinroom"> 
                      <p class="lead">
                        <a>ROOM CODE:</a>
                      </p>
                      <input type="text" name="roomcode" onChange={this.handleChange} />
                      <br/>
                    </form>

                    Join Room
                    <button class="btn btn-lg btn-secondary" onClick={() => this.joinRoom()}>Join</button>
                  </div>
                  <div class="col-lg-6">
                  </div>
                </div>
              </div>*/}
            </div> {/* Closing div for first row */}
            
            <ul align = "left">
            <h2>{this.state.playlistName} - {this.state.roomCode}</h2>
            <form onSubmit={this.handleSearch}>
              <label>
                Search:
                <input  type = 'text' onChange={this.handleChange} />
              </label>
              <input type="submit" value="Search" />
            </form>
              
                  <br/> <br/>
                  {listTracks}
            </ul> 

          </div>
        );
    }
}


export default App;