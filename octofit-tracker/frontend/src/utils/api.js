const codespaceApiEndpoints = {
  users: '-8000.app.github.dev/api/users',
  teams: '-8000.app.github.dev/api/teams',
  activities: '-8000.app.github.dev/api/activities',
  leaderboard: '-8000.app.github.dev/api/leaderboard',
  workouts: '-8000.app.github.dev/api/workouts',
};

export const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
};

export const getApiUrl = (endpoint) => {
  const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, '');

  if (import.meta.env.VITE_CODESPACE_NAME?.trim()) {
    const codespaceEndpoint = codespaceApiEndpoints[normalizedEndpoint]
      ?? `-8000.app.github.dev/api/${normalizedEndpoint}`;
    return `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}${codespaceEndpoint}/`;
  }

  return `${getApiBaseUrl()}/api/${normalizedEndpoint}/`;
};

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }

  if (payload && Array.isArray(payload.items)) {
    return payload.items;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.data) {
    return normalizeCollection(payload.data);
  }

  return [];
};

export const fetchCollection = async (endpoint) => {
  const response = await fetch(getApiUrl(endpoint));

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return normalizeCollection(await response.json());
};
