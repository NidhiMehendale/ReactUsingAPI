import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-33bf7-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();

      const loadedMovies = [];

      for(const key in data){
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate,
        });
      }

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

   async function addMovieHandler(movie) {
   const response = await fetch('https://react-http-33bf7-default-rtdb.firebaseio.com/movies.json',{
      method: 'POST',
      body:JSON.stringify(movie),
      headers: {
        'Content-Type' :'aplication/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  async function deleteMovieHandler(movieId) {
    try {
      const response = await fetch(`https://react-http-33bf7-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const updatedMovies = await movies.filter((movie) => movie.id !== movieId);
      setMovies(updatedMovies);
    } catch (error) {
      setError(error.message);
    }
  }

  let content = <p>Found no movies.</p>;
  

  if (movies.length > 0) {
    content = <MoviesList movies={movies}  onDeleteMovie={deleteMovieHandler}/>;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
     <section>
       <AddMovie onAddMovie={addMovieHandler}  />
     </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
