"use client"

import dynamic from 'next/dynamic'

const MathLearningAppComponent = dynamic(
  () => import('./math-learning-app').then((mod) => mod.MathLearningAppComponent),
  { ssr: false }
)

export default function ClientMathLearningApp() {
  return <MathLearningAppComponent />
}
