export default function MovieModal({ movie, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <article className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{movie.title}</h2>
        <p>
          {movie.release_date?.slice(0, 4)} - * {movie.vote_average.toFixed(1)}
        </p>
        <p>{movie.overview || "No overview available."}</p>
        <button onClick={onClose}>Close</button>
      </article>
    </div>
  );
}
