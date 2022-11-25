import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback -> to prevent infinite loop bacause we put the fetchMovieHandler into the dependencies of useEffect(fetchMovieHandler is function, so reference type, so whenever reevaluating the function execute and bring infinite loop.)
  const fetchMovieHandler = useCallback(async ()=> {
    try {
      setIsLoading(true); // Loading start when the button clicked
      setError(null); //  succeed in fatching data, so null
      const response = await fetch("https://swapi.dev/api/films");

      if(!response.ok) {
        throw new Error("Something went wrong!")
        // if throw error, the execution stops at this point
      }

      const data = await response.json();
      const transformedMovies = data.results.map(movieData => {
        return {
          id:movieData.episode_id,
          title:movieData.title,
          openingText:movieData.opening_crawl,
          releaseDate:movieData.release_date
        }
      })
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false); // No matter if succussfull or error, set the "false"

    // fetch("https://swapi.dev/api/films")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     const transformedMovies = data.results.map(movieData => {
    //       return {
    //         id:movieData.episode_id,
    //         title:movieData.title,
    //         openingText:movieData.opening_crawl,
    //         releaseDate:movieData.release_date
    //       }
    //     })
    //     setMovies(transformedMovies);
    //   });
  }, [])

  useEffect(()=> {
    fetchMovieHandler();
  }, [fetchMovieHandler])

  let content = <p>Found no Movies.</p>
  if(movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  if(error) {
    content = <p>{error}</p>
  }

  if(isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>} */}
      </section>
    </React.Fragment>
  );
}

export default App;
