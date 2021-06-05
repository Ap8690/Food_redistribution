import React, { Component } from 'react';
import './App.css';
import Home from './home';
import Web3 from 'web3';
import Food_redistribution from '../abis/Food_redistribution.json';
import DonateForm from './donateForm';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link
} from "react-router-dom";

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockChainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0]})

    const netID = await web3.eth.net.getId();
    const networkData = Food_redistribution.networks[netID]
    if(networkData){
      const food_redistribution = web3.eth.Contract(Food_redistribution.abi, networkData.address)
      this.setState({ food_redistribution })
      const postCount = await food_redistribution.methods.donorCount().call()
      this.setState({postCount})
      
      for(var i=0;i <= postCount; i++){
        const post = await food_redistribution.methods.donorPosts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }

    }
    else{
      window.alert('Food_redistribution contract not deployed to detected network.')
    }
  }

  createPost(type, name, image, latitude, longitude, time_from, time_to){
     this.state.food_redistribution.methods.createDonorPost(type, name, image, latitude, longitude, time_from, time_to).send({from: this.state.account})
        
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      food_redistribution: null,
      postCount: 0,
      posts: [],
    }
    this.createPost = this.createPost.bind(this)
  }

  redirect = path => { this.props.history.push(path) }

  render() {
    return (
      <div>
        <nav className="bg-black color-white height-50 ">
        <ul className="padding list-style-none flex-row mob">
            <li className="mob-width" onClick={() => this.redirect('/')}>Home</li>
            <li className="mob-width" onClick={() => this.redirect('/donate/food')}>Donate</li>
            <li className="mob-width" onClick={() => this.redirect('/help')}>Help</li>
            <li className="mob-width" onClick={() => this.redirect('/account')}>Accoount</li>    
        </ul>
        </nav>
        <Switch>
              <Route path="/donate/food" render={(props)=><DonateForm createPost={this.createPost}{...props}/>}/>
              <Route exact path="/" render={(props)=><Home posts={this.state.posts}{...props}/>}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);