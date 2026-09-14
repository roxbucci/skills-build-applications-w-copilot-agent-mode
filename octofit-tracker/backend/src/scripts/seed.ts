import mongoose from 'mongoose';
import { pathToFileURL } from 'node:url';
import {
  Activity,
  LeaderboardEntry,
  Team,
  User,
  Workout,
} from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    console.log('Seed the octofit_db database with test data');
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const teams = await Team.insertMany([
      { name: 'Rising Striders', coach: 'Maya Chen', members: [] },
      { name: 'Core Circuit Crew', coach: 'Jordan Patel', members: [] },
    ]);

    const users = await User.insertMany([
      {
        name: 'Ava Martinez',
        email: 'ava.martinez@example.com',
        fitnessLevel: 'advanced',
        teamId: teams[0]._id,
      },
      {
        name: 'Leo Brooks',
        email: 'leo.brooks@example.com',
        fitnessLevel: 'intermediate',
        teamId: teams[0]._id,
      },
      {
        name: 'Nina Patel',
        email: 'nina.patel@example.com',
        fitnessLevel: 'beginner',
        teamId: teams[1]._id,
      },
      {
        name: 'Omar Hassan',
        email: 'omar.hassan@example.com',
        fitnessLevel: 'advanced',
        teamId: teams[1]._id,
      },
    ]);

    await Team.updateOne({ _id: teams[0]._id }, { $set: { members: [users[0]._id, users[1]._id] } });
    await Team.updateOne({ _id: teams[1]._id }, { $set: { members: [users[2]._id, users[3]._id] } });

    const activityEntries = await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'run',
        durationMinutes: 42,
        distanceMiles: 5.6,
        calories: 410,
        notes: 'Tempo run through the park loop.',
      },
      {
        userId: users[1]._id,
        type: 'strength',
        durationMinutes: 35,
        distanceMiles: 0,
        calories: 280,
        notes: 'Upper body and core circuit.',
      },
      {
        userId: users[2]._id,
        type: 'cycling',
        durationMinutes: 50,
        distanceMiles: 12.5,
        calories: 530,
        notes: 'Steady ride with interval sprints.',
      },
      {
        userId: users[3]._id,
        type: 'walk',
        durationMinutes: 30,
        distanceMiles: 2.2,
        calories: 150,
        notes: 'Recovery walk with mobility work.',
      },
    ]);

    await LeaderboardEntry.insertMany([
      { userId: users[0]._id, score: 980, streak: 12, rank: 1 },
      { userId: users[3]._id, score: 930, streak: 9, rank: 2 },
      { userId: users[1]._id, score: 890, streak: 6, rank: 3 },
      { userId: users[2]._id, score: 845, streak: 4, rank: 4 },
    ]);

    await Workout.insertMany([
      {
        title: 'Hill Sprint Intervals',
        focus: 'Cardio',
        difficulty: 'advanced',
        durationMinutes: 30,
        description: 'Alternate between fast hill repeats and recovery jogs.',
      },
      {
        title: 'Total Body Circuit',
        focus: 'Strength',
        difficulty: 'intermediate',
        durationMinutes: 40,
        description: 'Build full-body strength with kettlebell and bodyweight work.',
      },
      {
        title: 'Mobility Reset',
        focus: 'Recovery',
        difficulty: 'beginner',
        durationMinutes: 20,
        description: 'Gentle mobility flow to reduce stiffness and improve range of motion.',
      },
    ]);

    console.log('Database seeding complete');
    console.log(`Inserted ${users.length} users, ${teams.length} teams, ${activityEntries.length} activities, ${5} leaderboard entries, and ${3} workouts.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedDatabase();
}

export { seedDatabase };
