import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options"

// Add this type declaration
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export async function GET(req: Request) {
  console.log("GET /api/user-stats called")
  try {
    // Test database connection
    const testResult = await sql`SELECT NOW()`
    console.log("Database connection test:", testResult)

    const session = await getServerSession(authOptions)
    console.log("Session:", session)
    if (!session || !session.user) {
      console.log("Unauthorized: No session or user")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_stats'
      )
    `
    console.log("user_stats table exists:", tableCheck.rows[0].exists)

    const result = await sql`
      SELECT progress, memorized, history
      FROM user_stats
      WHERE user_id = ${parseInt(session.user.id)}
    `
    console.log("SQL result:", result)

    if (result.rows.length === 0) {
      console.log("No user stats found, returning default values")
      return NextResponse.json({ progress: 0, memorized: {}, history: [] })
    }

    console.log("Returning user stats:", result.rows[0])
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  console.log("POST /api/user-stats called")
  try {
    const session = await getServerSession(authOptions)
    console.log("Session:", session)
    if (!session || !session.user) {
      console.log("Unauthorized: No session or user")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log("Request body:", body)
    const { progress, memorized, history } = body

    const result = await sql`
      INSERT INTO user_stats (user_id, progress, memorized, history)
      VALUES (${parseInt(session.user.id)}, ${progress}, ${JSON.stringify(memorized)}, ${JSON.stringify(history)})
      ON CONFLICT (user_id)
      DO UPDATE SET
        progress = EXCLUDED.progress,
        memorized = EXCLUDED.memorized,
        history = EXCLUDED.history
    `
    console.log("SQL result:", result)

    return NextResponse.json({ message: 'User stats updated successfully' })
  } catch (error) {
    console.error('Error updating user stats:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
