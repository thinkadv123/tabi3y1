import serverless from "serverless-http";
import app from "../../server/app";
import { initDb } from "../../server/db";

let dbReady: Promise<void> | null = null;
const slsHandler = serverless(app);

async function ensureDb() {
  if (!dbReady) {
    dbReady = initDb();
  }
  return dbReady;
}

export const handler = async (event: any, context: any) => {
  try {
    await ensureDb();
    return await slsHandler(event, context);
  } catch (err: any) {
    console.error("Netlify function error:", err);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: err?.message || String(err),
      }),
    };
  }
};