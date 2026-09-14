import { useEffect, useState } from 'react';
import { fetchCollection } from '../utils/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsers(await fetchCollection('users'));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <p>Loading users…</p>;
  }

  if (error) {
    return <p role="alert">Unable to load users: {error}</p>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <ul className="list-group list-group-flush">
          {users.map((user) => (
            <li key={user._id ?? user.email} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div>
                  <strong>{user.name}</strong>
                  <div className="text-muted small">{user.email}</div>
                </div>
                <span className="badge text-bg-primary">{user.fitnessLevel}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Users;
