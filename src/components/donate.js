import React, { Component } from 'react';

class Donate extends Component{
    constructor(props){
        super(props)
        this.setState={

        }
    }

    redirect = path => { this.props.history.push(path) }

    render(){
        return(
          <div className="flex-center margin-t-10 ">
             <button  class="btn btn-primary" onClick={() => this.redirect('/donate/food')}>Donate Food</button>
          </div>
        );
    }
}

export default Donate;