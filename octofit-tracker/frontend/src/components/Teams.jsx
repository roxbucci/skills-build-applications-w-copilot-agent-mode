import { useEffect, useState } from 'react';
import { fetchCollection } from '../utils/api';

// API endpoint: -8000.app.github.dev/api/teams
function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setTeams(await fetchCollection('teams'));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  if (loading) {
    return <p>Loading teams…</p>;
  }

  if (error) {
    return <p role="alert">Unable to load teams: {error}</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        <ul className="list-group list-group-flush">
          {teams.map((team) => (
            <li key={team._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div>
                  <strong>{team.name}</strong>
                  <div className="text-muted small">Coach: {team.coach}</div>
                </div>
                <span className="badge text-bg-info">{team.members?.length ?? 0} members</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Teams;
