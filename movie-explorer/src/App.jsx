import { useEffect, useState } from "react";
import { isCancel } from "axios";
import { getPopularMovies, searchMovies } from "./api/tmdb";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); // what's typed in the box
  const [search, setSearch] = useState(""); // what was actually submitted
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const request = search
      ? searchMovies(search, page, controller.signal)
      : getPopularMovies(page, controller.signal);

    request
      .then((data) => {
        setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setTotalPages(data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancel(err)) return; // ignore our own aborted requests
        setError("Couldn't load movies. Try again later.");
        setLoading(false);
      });

    return () => controller.abort(); // cleanup
  }, [search, page]); // re-runs whenever a new search is submitted

  return (
    <main className="app">
      <h1>Movie Explorer</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(query.trim());
          setPage(1);
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      {!loading && !error && search && movies.length === 0 && (
        <p className="empty">No results for "{search}"</p>
      )}
      {!error && (
        <div className="grid">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} onSelect={setSelected} />
          ))}
        </div>
      )}
      {loading && <p>Loading...</p>}
      {!loading && page < totalPages && (
        <button className="load-more" onClick={() => setPage((p) => p + 1)}>
          Load more
        </button>
      )}
      {/* Panel */}
      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
