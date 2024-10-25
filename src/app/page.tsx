import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/options"
import ClientMathLearningApp from '@/components/ClientMathLearningApp'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 to-blue-200">
        <h1 className="text-4xl font-bold mb-4">Welcome to Math Mania!</h1>
        <p className="mb-8">Please log in or sign up to start learning.</p>
        <Link href="/auth" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Log In / Sign Up
        </Link>
      </main>
    )
  }

  return (
    <main>
      <ClientMathLearningApp />
    </main>
  )
}
