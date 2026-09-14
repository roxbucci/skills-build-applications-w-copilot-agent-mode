import express, { type Request, type Response } from 'express';
import { pathToFileURL } from 'node:url';
import { connectToDatabase } from './config/database.js';
import {
  Activity,
  LeaderboardEntry,
  Team,
  User,
  Workout,
} from './models/index.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);

const getBaseUrl = () => {
  const codespaceName = process.env.CODESPACE_NAME;
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
};

app.use(express.json());

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({ status: 'ok', baseUrl: getBaseUrl() });
});

app.get(['/api/users', '/api/users/'], async (_request: Request, response: Response) => {
  try {
    const users = await User.find({}).lean();
    response.json(users);
  } catch (error) {
    response.status(500).json({ message: 'Unable to fetch users', error });
  }
});

app.post(['/api/users', '/api/users/'], async (request: Request, response: Response) => {
  try {
    const user = await User.create(request.body);
    response.status(201).json(user);
  } catch (error) {
    response.status(400).json({ message: 'Unable to create user', error });
  }
});

app.get(['/api/teams', '/api/teams/'], async (_request: Request, response: Response) => {
  try {
    const teams = await Team.find({}).populate('members').lean();
    response.json(teams);
  } catch (error) {
    response.status(500).json({ message: 'Unable to fetch teams', error });
  }
});

app.post(['/api/teams', '/api/teams/'], async (request: Request, response: Response) => {
  try {
    const team = await Team.create(request.body);
    response.status(201).json(team);
  } catch (error) {
    response.status(400).json({ message: 'Unable to create team', error });
  }
});

app.get(['/api/activities', '/api/activities/'], async (_request: Request, response: Response) => {
  try {
    const activities = await Activity.find({}).lean();
    response.json(activities);
  } catch (error) {
    response.status(500).json({ message: 'Unable to fetch activities', error });
  }
});

app.post(['/api/activities', '/api/activities/'], async (request: Request, response: Response) => {
  try {
    const activity = await Activity.create(request.body);
    response.status(201).json(activity);
  } catch (error) {
    response.status(400).json({ message: 'Unable to create activity', error });
  }
});

app.get(['/api/leaderboard', '/api/leaderboard/'], async (_request: Request, response: Response) => {
  try {
    const leaderboard = await LeaderboardEntry.find({}).populate('userId').lean();
    response.json(leaderboard);
  } catch (error) {
    response.status(500).json({ message: 'Unable to fetch leaderboard', error });
  }
});

app.post(['/api/leaderboard', '/api/leaderboard/'], async (request: Request, response: Response) => {
  try {
    const entry = await LeaderboardEntry.create(request.body);
    response.status(201).json(entry);
  } catch (error) {
    response.status(400).json({ message: 'Unable to create leaderboard entry', error });
  }
});

app.get(['/api/workouts', '/api/workouts/'], async (_request: Request, response: Response) => {
  try {
    const workouts = await Workout.find({}).lean();
    response.json(workouts);
  } catch (error) {
    response.status(500).json({ message: 'Unable to fetch workouts', error });
  }
});

app.post(['/api/workouts', '/api/workouts/'], async (request: Request, response: Response) => {
  try {
    const workout = await Workout.create(request.body);
    response.status(201).json(workout);
  } catch (error) {
    response.status(400).json({ message: 'Unable to create workout', error });
  }
});

export const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
    console.log(`Base URL: ${getBaseUrl()}`);
  });
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}

export default app;
