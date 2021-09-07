import React, { useState, useEffect, Fragment } from "react";
import { Link } from 'react-router-dom'

const Admin = () => {
    const [movies, setMovies] = useState([])
    const [isLoaded, setisLoaded] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {

        async function fetchMovies() {
            try {

                const result = await fetch("http://localhost:4000/v1/movies")
                if (result.status !== 200) {
                    let err = new Error();
                    err.message = "Invalid response code: " + result.status
                    setError(err)
                }
                const data = await result.json()

                setMovies(data.movies)
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
        <Fragment>
            <h2>Choose a movie</h2>
            <div className="list-group">
                {movies.map((m) => (
                    <Link key={m.id} className="list-group-item list-group-item-action" to={`/admin/movie/${m.id}`}>{m.title}</Link>
                ))}
            </div>
        </Fragment>
    );
}

export default Admin