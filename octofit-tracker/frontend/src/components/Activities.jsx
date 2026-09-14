import { useEffect, useState } from 'react';
import { fetchCollection } from '../utils/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setActivities(await fetchCollection('activities'));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  if (loading) {
    return <p>Loading activities…</p>;
  }

  if (error) {
    return <p role="alert">Unable to load activities: {error}</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <ul className="list-group list-group-flush">
          {activities.map((activity) => (
            <li key={activity._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <strong>{activity.type}</strong>
                  <div className="text-muted small">{activity.notes || 'No notes provided'}</div>
                </div>
                <span className="badge text-bg-success">{activity.durationMinutes} min</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Activities;
