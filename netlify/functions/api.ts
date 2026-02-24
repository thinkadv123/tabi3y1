import serverless from 'serverless-http';
import app from '../../server/app';
import { initDb } from '../../server/db';

export const handler = async (event: any, context: any) => {
  await initDb();
  return serverless(app)(event, context);
};
