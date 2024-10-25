"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Math Mania
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <>
                <span className="text-gray-700 mr-4">{session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
