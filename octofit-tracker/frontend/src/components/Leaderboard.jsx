import { useEffect, useState } from 'react';
import { fetchCollection } from '../utils/api';

// API endpoint: -8000.app.github.dev/api/leaderboard
function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setEntries(await fetchCollection('leaderboard'));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading leaderboard…</p>;
  }

  if (error) {
    return <p role="alert">Unable to load leaderboard: {error}</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        <ul className="list-group list-group-flush">
          {entries.map((entry) => (
            <li key={entry._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div>
                  <strong>#{entry.rank}</strong>
                  <div className="text-muted small">{entry.userId?.name ?? 'Unknown user'}</div>
                </div>
                <span className="badge text-bg-warning">{entry.score} pts</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
