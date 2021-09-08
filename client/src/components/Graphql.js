import React, { Component } from 'react'


export default class Graphql extends Component {
  constructor(props) {
    super(props)

    this.state = {
      movies: [],
      isLoaded: false,
      error: null,
      alert: {
        type: "d-none",
        message: "",
      }
    }
  }

  componentDidMount() {

    const getMovies = async () =>{
      const payload = `
      {list {
        id
        title
        runtime
        year
        description
      }}
    `

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        body: payload,
        headers: myHeaders,
      }

      const response = await fetch("http://localhost:4000/v1/graphql/list", requestOptions)
      const data = await response.json()
      console.log(data)
      const movies = Object.values(data.data.list)
    
      console.log(movies);
      this.setState({
        movies
      })
    }


    getMovies()
  }
  
  render() {
    let {movies, isLoaded, error} = this.state

    return (
      <React.Fragment>
        <h2>Movies Graphql</h2>
        <hr/>
        <div className="list-group">
          {movies.map(m => (
            <a key={m.id} 
            className="list-group-item list-group-item-action"
            href="#!">
              {m.title}
              <small className="text-muted">
                ({m.year} - {m.runtime} min)
              </small>
            </a>
          ))}
        </div>
      </React.Fragment>
    )
  }
}
