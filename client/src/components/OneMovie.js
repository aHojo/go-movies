import React, { useState, useEffect, Fragment } from 'react'

const OneMovie = ({ match }) => {

    const [movie, setMovie] = useState({})
    const [error, setError] = useState(null)
    const [isLoaded, setisLoaded] = useState(false)

    useEffect(() => {

        async function fetchMovies() {

            try {

                const result = await fetch(`http://localhost:4000/v1/movie/${match.params.id}`)
                if (result.status !== 200) {
                    let err = new Error();
                    err.message = "Invalid response code: " + result.status
                    setError(err)
                }
                const data = await result.json()
                console.log(data);

                setMovie(data.movie)
                setisLoaded(true)
            } catch (err) {
                setError(err)
            }
        }

        fetchMovies()
    }, [match.params.id])

 
    const genres =   movie.genres ?  Object.values(movie.genres) : {};

    if (error) {
        return <div>Error: {error.message}</div>
    }
    if (!isLoaded) {
        return <p>Loading....</p>
    }

    return (
        <Fragment>
            <h2>Movie: {movie.title} ({movie.year})</h2>

            <div className="float-start"> {movie.mpaa_rating}</div>
            <div className="float-end">
                {
                    genres.length !== 0 ? 
                    genres.map((g, index) => {
                        return (
                            <span className="badge bg-secondary me-1" key={index}>{g}</span>
                        )
                    }) :
                    <span className="badge bg-secondary me-1" >No Genres</span>
                }
            </div>
            <div className="clearfix"></div>
            <hr />
            <table className="table table-compact table-striped">
                <thead></thead>
                <tbody>
                    <tr>
                        <td><strong>Title:</strong></td>
                        <td>{movie.title}</td>
                    </tr>
                    <tr>
                        <td><strong>Run time:</strong></td>
                        <td>{movie.runtime} minutes</td>
                    </tr>
                </tbody>
            </table>
        </Fragment>
    );

}

export default OneMovie;