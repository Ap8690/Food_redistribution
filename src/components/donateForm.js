import React, { Component, useState } from 'react';
import ipfs from './ipfs';

class DonateForm extends Component{

    constructor(props){
        super(props)
        this.state={
            food_type: '',
            food_name: '',
            pick_up_time_from: '',
            pick_up_time_to: '',
            image: '',
            buffer: null,
            latitude: null,
            longitude: null,
        }

        this.onsubmit = this.onsubmit.bind(this);
        this.captureFile = this.captureFile.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
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
        console.log(this.state.latitude)
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
    
    onsubmit(event){
        event.preventDefault()
        ipfs.files.add(this.state.buffer, (error,result) => {
            if(error){
                console.error(error)
                return
            }
            const lati = Math.round(this.state.latitude)
            const long = Math.round(this.state.longitude)
            this.props.createPost(this.state.food_type, this.state.food_name, result[0].hash, lati, long, this.state.pick_up_time_from, this.state.pick_up_time_to);
        })
                
    }

    captureFile(event){
       event.preventDefault()
       const file = event.target.files[0]
       const reader = new window.FileReader()
       reader.readAsArrayBuffer(file)
       reader.onloadend = () =>{
           this.setState({buffer: Buffer(reader.result)})
       }
    }
    
    render(){
        console.log(this.props)
        return(
            <div className=" bg-brown width-600 height-500 position-relative mob">
              <form action="" className="form" onSubmit={onsubmit}>
                  <div className="flex-column">
                        <lable htmlFor="Food_type" >Food type</lable>
                        <input type="text" name="Food_type" id="Food_type" className="border-cadetblue"
                            value={this.state.food_type}
                            onChange={(e) => this.setState({food_type: e.target.value})}
                            placeholder="Enter food type" 
                            required 
                        />
                  </div>
                  <div className="flex-column">
                        <lable htmlFor="Food_name">Food name</lable>
                        <input type="text" name="Food_name" id="Food_name" className="border-cadetblue"
                            value={this.state.food_name}
                            onChange={(e) => this.setState({food_name: e.target.value})}
                            placeholder="Enter food name" 
                            required 
                        />
                  </div>
                  <div className="flex-column">
                      <lable htmlFor="Pick_up_time_from">Time from</lable>
                        <input type="text" name="Pick_up_time_from" id="Pick_up_time_from" className="border-cadetblue"
                            value={this.state.pick_up_time_from}
                            onChange={(e) => this.setState({pick_up_time_from: e.target.value})}
                            placeholder="ex- 6am" 
                            required 
                        />
                  </div>
                  <div className="flex-column">
                      <lable htmlFor="Pick_up_time_to">Time to</lable>
                        <input type="text" name="Pick_up_time_to" id="Pick_up_time_to" className="border-cadetblue"
                            value={this.state.pick_up_time_to}
                            onChange={(e) => this.setState({pick_up_time_to: e.target.value})}
                            placeholder="ex- 9pm" 
                            required 
                        />
                  </div>
                  <div className="flex-column">
                      <lable htmlFor="Image">Image</lable>
                      <input type="file" name="Image" id="Image" 
                            onChange={this.captureFile}
                        />
                  </div>
    
                  <button class="btn btn-primary margin-t-10" type="submit" onClick={this.onsubmit}>Submit</button>
              </form>
            </div>
        )
    }
}

export default DonateForm;