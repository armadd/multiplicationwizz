"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToaster } from "react-hot-toast"
import { LogIn, UserPlus } from "lucide-react"
import toast from "react-hot-toast"  // Add this import at the top of the file

export function AuthPageComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const router = useRouter()
  // Remove this line: const toast = useToaster()

  async function onSubmit(event: React.SyntheticEvent, mode: "login" | "signup") {
    event.preventDefault()
    setIsLoading(true)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (mode === "signup") {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        toast.success('Account created successfully! Please log in.')
        setActiveTab("login")
      } else {
        const data = await response.json()
        if (response.status === 400 && data.error === "User already exists") {
          toast.error('An account with this email already exists. Please log in.')
          setActiveTab("login")
        } else {
          toast.error('There was a problem creating your account.')
        }
      }
      setIsLoading(false)
      return
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      toast.error(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error)
    } else {
      toast.success("Logged in successfully!")
      router.push("/")
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">Welcome to Math Mania!</CardTitle>
          <CardDescription className="text-center text-white/80">Sign up or log in to start learning</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-purple-100 p-2">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={(e) => onSubmit(e, "login")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required className="rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={(e) => onSubmit(e, "signup")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required className="rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-purple-100 p-4 flex justify-center">
          <p className="text-sm text-purple-700">Learn multiplication tables the fun way!</p>
        </CardFooter>
      </Card>
    </div>
  )
}
