import React, { Component } from 'react';
/*import {render} from "render.dom";*/
import {
  BrowserRouter as Router,
  Route,
  //Redirect,
  //withRouter,
  Link
} from "react-router-dom";
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
      <Router>
        <div className="App">
        <h1>DJfy</h1>

              <Route path = "/home" render ={
                ()=> {
                  return(
                    <div>
                      <button><Link to = "/createroom"> Create Room </Link></button>
                        <br/> <br/>
                      <button><Link to = "/joinroom"> Join Room </Link></button>
                    </div>
                    );
                }
              }/>


              <Route path = "/createroom" render ={
                ()=> {
                  var rand = (Math.random() * (9999999999));
                    return (
                      <div className="CreateRoom">
                        <h2>Create Room</h2>
              
                          Enter Playlist Name: 
                          <input type = "text" onChange = {this.changePlaylistName} value = {this.state.playlistName}/> 
                          
                          <br/> <br/>
                              <button onClick = {this.changeRoomCode.bind(this, {rand})}><Link to = "/Room/{rand}"> Create Room </Link></button>
                          <br/> <br/>
                      </div>  
                    );
                }
              }/>

              <Route path = "/joinroom" render ={
                ()=> {
                  return (
                    <div className="JoinRoom">
                      <h2>Join Room</h2>
                        Enter Room Code:  
                          <input type = "text" onChange = {this.changeRoomCodeLogin} value = {this.state.roomCodeLogin}/>

                          <br/> <br/>
                              <button>Join Room</button>
                          <br/> <br/>
                    </div>
                  );
                }
              }/>

            <Route path = "/Room" render ={
                ()=> {
                  return (
                    <div className="Room">
                      <h3>{this.state.playlistName}</h3>
  
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
              }/>
        </div>
      </Router>
    );
  }
}
export default App;
