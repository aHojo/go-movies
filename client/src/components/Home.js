import React from 'react';
import "./Home.css";
import Ticket from '../images/movie_tickets.jpg'

const Home = () => {


    return (
        <div className="text-center">
            <h1>Welcome to the Home Page</h1>
            <hr/>
            <img src={Ticket} alt="movie ticket" />
            <hr/>
            <div className="tickets"></div>
        </div>
    );
}

export default Home