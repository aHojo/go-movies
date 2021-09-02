import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


const Genres = () => {
  const [genres, setGenres] = useState([])
  const [isLoaded, setisLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {

    async function fetchMovies() {

      try {

        const result = await fetch("http://localhost:4000/v1/genres")
        if (result.status !== 200) {
          let err = new Error();
          err.message = "Invalid response code: " + result.status
          setError(err)
        }
        const data = await result.json()

        setGenres(data.genres)
        setisLoaded(true)

      } catch (err) {
        setError(err)
      }
    }

    fetchMovies()

  }, [])

  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!isLoaded) {
    return <p>Loading....</p>
  }
  return (
    <React.Fragment>
      <h2>Genres: </h2>
      <div className="list-group">
        {genres.length !== 0 ?
          genres.map((m) => {
            return (

              <Link key={m.id} className="list-group-item list-group-item-action" to={{
                pathname: `/genres/${m.id}`,
                state: { genreName: m.genre_name }
              }}>{m.genre_name}</Link>

            )
          })
          :
          null
        }
      </div>
    </React.Fragment>
  )
}
export default Genres;