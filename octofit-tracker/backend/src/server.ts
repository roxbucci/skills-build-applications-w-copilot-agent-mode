import { pathToFileURL } from 'node:url';
import app, { startServer } from './index.js';

export { app, startServer };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
