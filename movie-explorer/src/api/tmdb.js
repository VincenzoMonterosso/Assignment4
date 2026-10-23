import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
});

export const getPopularMovies = (signal) =>
  tmdb.get("/movie/popular", { signal }).then((res) => res.data.results);

export const searchMovies = (query, signal) =>
  tmdb
    .get("/search/movie", { params: { query }, signal })
    .then((res) => res.data.results);
