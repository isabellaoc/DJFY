import React, { Component } from 'react';
/*import {render} from "render.dom";*/
/*import {
  BrowserRouter as Router,
  Route,
  //Redirect,
  //withRouter,
  Link
} from "react-router-dom";*/
import './App.css';



class App extends Component {

  state = {
    playlistName:'Playlist Name',
    roomCode: '',
    roomCodeLogin: 'RoomCode',
  }
    changePlaylistName = (event) =>  {
      this.setState({
            playlistName: event.target.value 
      })
    }
    changeRoomCode = (code) =>  {
      this.setState({
            roomCode: code
      })
    }
    changeRoomCodeLogin = (event) =>  {
      this.setState({
            roomCodeLogin: event.target.value 
      })
    }

  render() {
    return (
        <div className="App">
          <h1>DJfy</h1>
          <Connect> </Connect>
          <Room> </Room>

    
        </div>    
    );
  }
}

class Connect extends Component {

  render() {
    return (
        <div className="Connect">
          <h3>Connect to Spotify <button>Connect</button> Join Room <button> Join </button></h3>
        </div>    
    );
  }
}



class Room extends Component {

  render() {
    return (
      <div className="Room">
      <h2>Playlist</h2>

      <ul>
          Search: <input type = "text"/>
          <br/> <br/>

          <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button> Song 1</li>
          <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button> Song 2</li>
          <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button> Song 3</li>
      </ul>
    </div>    
    );
  }
}


export default App;
