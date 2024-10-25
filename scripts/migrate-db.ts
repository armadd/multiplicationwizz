const dotenv = require('dotenv');
const path = require('path');
const { sql } = require('@vercel/postgres');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function migrate() {
  console.log('Connection string:', process.env.POSTGRES_URL);
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined in the environment variables');
  }
  
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('Migration completed');
}

migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
