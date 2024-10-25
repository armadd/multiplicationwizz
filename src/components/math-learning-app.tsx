"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, History, Play, HelpCircle } from "lucide-react"
import toast from "react-hot-toast"

// Helper function to generate a random multiplication question
const generateQuestion = () => {
  const a = Math.floor(Math.random() * 12) + 1
  const b = Math.floor(Math.random() * 12) + 1
  return { question: `${a} × ${b}`, answer: a * b, factors: [a, b] }
}

export function MathLearningAppComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion())
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [history, setHistory] = useState<Array<any>>([])
  const [memorized, setMemorized] = useState<Record<string, number>>({})
  const [showHelp, setShowHelp] = useState(false)
  const [stuckQuestion, setStuckQuestion] = useState<any>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    fetchUserStats()
  }, [])

  useEffect(() => {
    const debouncedUpdateStats = debounce(updateUserStats, 5000)
    debouncedUpdateStats()
    return () => debouncedUpdateStats.cancel()
  }, [score, totalQuestions, history, memorized])

  const fetchUserStats = async () => {
    try {
      console.log("Fetching user stats...")
      const response = await fetch('/api/user-stats')
      console.log("Fetch response:", response)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch user stats: ${response.status} ${response.statusText} - ${errorText}`)
      }
      const data = await response.json()
      console.log("Fetched user stats:", data)
      setScore(data.progress || 0)
      setTotalQuestions(data.progress || 0)
      setMemorized(data.memorized || {})
      setHistory(data.history || [])
    } catch (error) {
      console.error('Error fetching user stats:', error)
      toast.error(`Failed to load your progress: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const updateUserStats = async () => {
    try {
      console.log("Updating user stats...")
      const response = await fetch('/api/user-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: score,
          memorized,
          history: history.slice(0, 50), // Limit history to last 50 items
        }),
      })
      console.log("Update response:", response)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update user stats: ${response.status} ${response.statusText} - ${errorText}`)
      }
      console.log("User stats updated successfully")
    } catch (error) {
      console.error('Error updating user stats:', error)
      toast.error(`Failed to save your progress: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleSubmit = (stuck = false) => {
    const isCorrect = !stuck && parseInt(userAnswer) === currentQuestion.answer
    setScore(score + (isCorrect ? 1 : 0))
    setTotalQuestions(totalQuestions + 1)
    setHistory([
      { ...currentQuestion, userAnswer: stuck ? "Skipped" : parseInt(userAnswer), isCorrect },
      ...history,
    ])
    setUserAnswer("")
    if (!stuck) {
      setCurrentQuestion(generateQuestion())
      setShowHelp(false)
      setStuckQuestion(null)
      setIsStuck(false)
    }

    if (isCorrect) {
      setMemorized({
        ...memorized,
        [currentQuestion.question]: (memorized[currentQuestion.question] || 0) + 1,
      })
    }
  }

  const handleStuck = () => {
    setShowHelp(true)
    setStuckQuestion(currentQuestion)
    setIsStuck(true)
    handleSubmit(true)
  }

  const handleNextQuestion = () => {
    setCurrentQuestion(generateQuestion())
    setShowHelp(false)
    setStuckQuestion(null)
    setIsStuck(false)
  }

  const progressPercentage = Object.keys(memorized).length / 144 * 100

  const generateHelpSteps = () => {
    const question = stuckQuestion || currentQuestion
    const [a, b] = question.factors
    return (
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h4 className="font-bold mb-2">Solution for: {question.question}</h4>
        <ol className="list-decimal list-inside">
          <li>Start with {a} groups of {b}.</li>
          {a > 1 && <li>Count by {b}s, {a} times: {Array.from({length: a}, (_, i) => b * (i + 1)).join(', ')}.</li>}
          <li>The answer is: {a * b}.</li>
          {a > 5 && b > 5 && (
            <li>
              Tip: For larger numbers, you can break it down:
              <br />
              {a} × {b} = ({a} × 10) - ({a} × {10 - b})
              <br />
              = {a * 10} - {a * (10 - b)} = {a * b}
            </li>
          )}
        </ol>
        <Button onClick={handleNextQuestion} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
          Next Question
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-blue-200 p-8">
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-6">
          <CardTitle className="text-4xl font-bold text-center">Multiplication Mania!</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="quiz" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl bg-purple-100 p-2">
              <TabsTrigger value="quiz" className="rounded-lg data-[state=active]:bg-white">
                <Play className="mr-2 h-4 w-4" />
                Quiz Mode
              </TabsTrigger>
              <TabsTrigger value="memorize" className="rounded-lg data-[state=active]:bg-white">
                <Brain className="mr-2 h-4 w-4" />
                Memorize
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white">
                <History className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quiz" className="mt-6">
              <Card className="bg-yellow-100 rounded-2xl shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-center mb-4">{currentQuestion.question} = ?</h3>
                  <div className="flex justify-center items-center space-x-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className={`w-20 h-12 text-2xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${isStuck ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                      disabled={isStuck}
                    />
                    <Button 
                      onClick={() => handleSubmit()} 
                      className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg ${isStuck ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isStuck}
                    >
                      Check
                    </Button>
                    <Button 
                      onClick={handleStuck} 
                      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg ${isStuck ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isStuck}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      I'm stuck
                    </Button>
                  </div>
                  {showHelp && generateHelpSteps()}
                </CardContent>
              </Card>
              <p className="mt-4 text-center text-lg font-semibold">
                Score: {score} / {totalQuestions}
              </p>
            </TabsContent>
            <TabsContent value="memorize" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 144 }, (_, i) => {
                  const a = Math.floor(i / 12) + 1
                  const b = (i % 12) + 1
                  const question = `${a} × ${b}`
                  const memorizedCount = memorized[question] || 0
                  return (
                    <Card key={question} className={`bg-white rounded-xl shadow-md overflow-hidden ${memorizedCount > 0 ? 'border-2 border-green-400' : ''}`}>
                      <CardContent className="p-4">
                        <p className="text-lg font-bold text-center">{question} = {a * b}</p>
                        <p className="text-sm text-center text-gray-500">Memorized: {memorizedCount} times</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <ScrollArea className="h-[300px] rounded-md border p-4">
                {history.map((item, index) => (
                  <div key={index} className={`mb-2 p-2 rounded-lg ${item.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p>{item.question} = {item.answer}</p>
                    <p>Your answer: {item.userAnswer}</p>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Times Table Progress</h4>
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-gray-500 mt-1">{Math.round(progressPercentage)}% memorized</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Debounce function to limit API calls
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  const debouncedFunc: any = (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
  debouncedFunc.cancel = function() {
    clearTimeout(timeout)
  }
  return debouncedFunc
}

export default MathLearningAppComponent
