import { useEffect, useState } from "react";
import { isCancel } from "axios";
import { getPopularMovies, searchMovies } from "./api/tmdb";
import MovieCard from "./components/MovieCard";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); // what's typed in the box
  const [search, setSearch] = useState(""); // what was actually submitted

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const request = search
      ? searchMovies(search, controller.signal)
      : getPopularMovies(controller.signal);

    request
      .then((data) => { setMovies(data); setLoading(false); })
      .catch((err) => {
        if (isCancel(err)) return; // ignore our own aborted requests
        setError("Couldn't load movies. Try again later.");
        setLoading(false);
      });

    return () => controller.abort(); // cleanup
  }, [search]); // re-runs whenever a new search is submitted

  return (
    <main className="app">
      <h1>Movie Explorer</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(query.trim());
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="grid">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </main>
  );
}
