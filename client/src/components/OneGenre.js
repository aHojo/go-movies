import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';


const OneGenre = ({match, location}) => {
  const [movies, setMovies] = useState([])
  const [isLoaded, setisLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [genreName, setGenreName] = useState("")

  useEffect(() => {
    
    async function fetchMovies(){

      try {
        
        const result = await fetch(`http://localhost:4000/v1/movies/${match.params.id}`)
        if (result.status !== 200) {
          let err = new Error();
          err.message = "Invalid response code: " + result.status
          setError(err)
        }
        const data = await result.json()
    
        setMovies(data.movies)
        setGenreName(location.state.genreName)
        setisLoaded(true)
      } catch (err){
        setError(err)
      }
    }

    fetchMovies()

  }, [match.params.id, location])

  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!isLoaded) {
    return <p>Loading....</p>
  } 
  return (
    <React.Fragment>
      <h2>Genre: {genreName}</h2>
      <div className="list-group">
          {movies.length && movies.map( (m) => (
                  <Link to={`/movies/${m.id}`} className="list-group-item list-group-item-action">{m.title}</Link>
          ))}
      </div>
    </React.Fragment>
  );
}
export default OneGenre;