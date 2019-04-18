import React, { Component } from 'react';
//import {render} from "render.dom";
/*import {
  BrowserRouter as Router,
  Route,
  //Redirect,
  //withRouter,
  Link
} from "react-router-dom";*/
import './App.css';

var tracks = ["Song 1", "Song 2", "Song 3", "Song 4", "Song 5"];
var listItems = tracks.map((tracks) =>
  <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button>{tracks}</li>
);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: "",
      deviceId: "",
      loggedIn: false,
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 0,

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
  
    

  render() {
    return (
        <div className="App">

          <h1>DJfy</h1>
          
      
            <h3>Connect to Spotify 
              <button>Connect</button> 
              Join Room 
              <button> Join </button>
            </h3>
         
            <h2>{this.state.playlistName}</h2>
            <h3>{this.state.search}</h3>

            <ul>

            <form onSubmit={this.handleSubmit}>
              <label>
                Search:
                <textarea value={this.state.search} onChange={this.handleChange} />
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
