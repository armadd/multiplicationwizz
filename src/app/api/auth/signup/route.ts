import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { sql } from '@vercel/postgres'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    // Check if user already exists
    const result = await sql`SELECT * FROM users WHERE email=${email}`
    
    if (result.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Insert the new user
    await sql`INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})`

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
