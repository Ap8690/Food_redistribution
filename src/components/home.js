import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
class Home extends Component{
    constructor(props){
        super(props)
        this.state={
            type: '',
            distance: '',
            latitude: '',
            longitude: '',
            postsByType: [],
            psotByArea: [],
            search:'',
            flag: 0
        }
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.sortByArea = this.sortByArea.bind(this);
        this.sortByType = this.sortByType.bind(this);
    }

    getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        }
        else{
            alert("Geolocation is not supported by this browser.");
        }
    }

    getCoordinates(position){
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }

    handleLocationError(error){
        switch(error.code) {
            case error.PERMISSION_DENIED:
              alert("User denied the request for Geolocation.")
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.")
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.")
              break;
            case error.UNKNOWN_ERROR:
              alert("An unknown error occurred.")
              break;
            default:
              alert("An unknown error occurred.")

          }
        
    }

    distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }

    sortByArea = ()=>{
        this.props.posts.map((post, key)=>{
            if(post.food_name){
                this.setState({flag: 2})
                if(this.distance(post.latitude, post.longitude, this.state.latitude, this.state.longitude, 'M')<this.state.distance){
                    this.state.postsByArea.push(post)
                }
            }
        })
    }

    sortByType = ()=>{
        this.props.posts.map((post, key)=>{
            if(post.food_name){
                this.setState({flag: 1})
                post.food_type = post.food_type.toUpperCase()
                if(post.food_type === this.state.type.toUpperCase()){
                    this.state.postsByType.push(post);
                }
            }
        })
    }

    byType = () =>{
        this.setState({flag: 1})
        this.setState({postsByType: []})
    }

    bydistance = () =>{
        this.setState({flag: 2})
        this.setState({postsByArea: []})
    }

    doNotSort = () =>{
        this.setState({flag: 0})
    }

    redirect = path => { this.props.history.push(path) }

    render(){
        return(
            <div className="width-80per margin-l-r-auto margin-t-10 ">
                    <ul className="list-style-none mobile sort">
                        <li  onClick={()=> this.doNotSort()}>Regular</li>
                        <li onClick={()=>this.byType()}>Typewise</li>
                        <li onClick={()=>this.bydistance()}>Distancewise</li>
                    </ul>
                
                {
                    this.state.flag==1?
                    <div>
                        <form>
                        <div>
                        <input 
                            type="text" 
                            value={this.state.type}
                            onChange={event => this.setState({ type: event.target.value })}
                            placeholder="Enter food type" 
                            required 
                        />
                        </div>
                    </form>
                    <button class="btn btn-primary margin-t-10" type="submit" onClick={()=>this.sortByType()}>Go!</button>
                    </div>
                    :<></>
                }
                {
                    this.state.flag==1?
                    this.state.postsByType.map((post,key)=>{
                        if(post.food_name){
                            return(
                                <div class="card bg-grey" style={{marginBottom: '10px', display: 'flex',alignItems: 'center'}} onClick={()=>this.redirect('/item')}>    
                                    <div class="card-body">
                                    <h5 class="card-title">{post.food_name}</h5>
                                    </div>
                                    <div className="flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                        </svg>
                                        <p>{`${this.distance(post.latitude, post.longitude, this.state.latitude, this.state.longitude, 'M').toFixed(1)}miles`}</p>
                                    </div>
                               </div>
                            )
                        }
                    })
                    :<></>
                }
                {
                    this.state.flag==2?
                    <div>
                        <form>
                        <div>
                        <input 
                            type="text" 
                            value={this.state.distance}
                            onChange={event => this.setState({ distance: event.target.value })}
                            placeholder="Enter distance in miles" 
                            required 
                        />
                        </div>
                    </form>
                    <button class="btn btn-primary margin-t-10" type="submit" onClick={()=>this.sortByArea()}>Go!</button>
                    </div>
                    :<></>
                }
                {
                    this.state.flag==2?
                    this.state.postsByArea.map((post,key)=>{
                        if(post.food_name){
                            return(
                                <div class="card bg-grey" style={{marginBottom: '10px', display: 'flex',alignItems: 'center'}} onClick={()=>this.redirect('/item')} >    
                                    <div class="card-body">
                                    <h5 class="card-title">{post.food_name}</h5>
                                    </div>
                                    <div className="flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                        </svg>
                                        <p>{`${this.distance(post.latitude, post.longitude, this.state.latitude, this.state.longitude, 'M').toFixed(1)}miles`}</p>
                                    </div>
                               </div>
                            )
                        }
                    })
                    :<></>
                }
                {   this.state.flag==0?
                    this.props.posts.map((post,key)=>{
                        if(post.food_name){
                            return(
                                <div>
                                    <div class="card bg-grey" style={{marginBottom: '10px', display: 'flex',alignItems: 'center'}} onClick={()=>this.redirect('/item')} >    
                                    <div class="card-body">
                                    <h5 class="card-title">{post.food_name}</h5>
                                    </div>
                                    <div className="flex-row">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                        </svg>
                                        <p>{`${this.distance(post.latitude, post.longitude, this.state.latitude, this.state.longitude, 'M').toFixed(1)}miles`}</p>
                                        
                                    </div>
                               </div>
                               <Switch>
                               <Route path="/item"
                                  render={()=>{
                                   return(
                                       <>
                                           <p className="text-center">Learner Report</p>
                                       </>
                                   )
                                }}
                               />
                               </Switch>
                                </div>
                            )
                        }
                    }):<></>
                }
                
            </div>
        )
    }

}

export default Home;