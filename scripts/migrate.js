require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function runMigration() {
  const dropTableSQL = `
    DROP TABLE IF EXISTS user_stats;
  `;

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS user_stats (
      user_id INTEGER PRIMARY KEY,
      progress INTEGER NOT NULL DEFAULT 0,
      memorized JSONB NOT NULL DEFAULT '{}',
      history JSONB NOT NULL DEFAULT '[]'
    );
  `;
  
  const addForeignKeySQL = `
    ALTER TABLE user_stats
    ADD CONSTRAINT user_stats_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id);
  `;
  
  try {
    console.log('Starting migration...');
    console.log('Drop Table SQL:', dropTableSQL);
    console.log('Create Table SQL:', createTableSQL);
    console.log('Add Foreign Key SQL:', addForeignKeySQL);
    console.log('POSTGRES_URL:', process.env.POSTGRES_URL);
    
    await sql.query(dropTableSQL);
    console.log('Existing table dropped (if it existed)');

    await sql.query(createTableSQL);
    console.log('Table created successfully');
    
    await sql.query(addForeignKeySQL);
    console.log('Foreign key added successfully');
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration().catch(error => {
  console.error('Unhandled error in migration:', error);
  process.exit(1);
});
