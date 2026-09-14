import { useEffect, useState } from 'react';
import { fetchCollection } from '../utils/api';

// API endpoint: -8000.app.github.dev/api/workouts
function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setWorkouts(await fetchCollection('workouts'));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  if (loading) {
    return <p>Loading workouts…</p>;
  }

  if (error) {
    return <p role="alert">Unable to load workouts: {error}</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>
        <ul className="list-group list-group-flush">
          {workouts.map((workout) => (
            <li key={workout._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <strong>{workout.title}</strong>
                  <div className="text-muted small">{workout.focus}</div>
                </div>
                <span className="badge text-bg-secondary">{workout.durationMinutes} min</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Workouts;
