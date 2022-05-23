import logo from './logo.svg';
import './App.css';
import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {apiResponse: ""};
  }

  callTest(){
    fetch('https://localhost:3001/')
    .then(res => res.text())
    .then(res => console.log(res))
    .then(res => this.setState({apiResponse: res}));
  }

  componentWillMount(){
    this.callTest();
  }

  render(){


  return (
    <div className="App">
      <p>{this.state.apiResponse}</p>
    </div>
  );
  }
}




export default App;
