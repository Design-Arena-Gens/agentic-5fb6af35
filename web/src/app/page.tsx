"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, FileDown, Layers, Settings2 } from 'lucide-react'
import { generateBook } from '@/lib/generator'
import { BookViewer } from '@/components/BookViewer'

export default function Home() {
  const [topic, setTopic] = useState('Introduction to Data Science for India')
  const [audience, setAudience] = useState('Undergraduate students in India')
  const [tone, setTone] = useState('Human, neutral-academic, culturally contextualized for India')
  const [chapters, setChapters] = useState(15)
  const [wordsPerChapter, setWordsPerChapter] = useState(4800)
  const [generating, setGenerating] = useState(false)
  const [book, setBook] = useState<ReturnType<typeof generateBook> | null>(null)

  const canGenerate = useMemo(() => topic.trim().length >= 3, [topic])

  const onGenerate = async () => {
    setGenerating(true)
    try {
      const result = generateBook({
        topic,
        audience,
        tone,
        numChapters: chapters,
        minWordsPerChapter: Math.max(4500, Math.min(wordsPerChapter, 5200)),
      })
      setBook(result)
      setTimeout(() => window.scrollTo({ top: 500, behavior: 'smooth' }), 50)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main className="container py-10 space-y-8">
      <section className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary-400" /> Agentic Book Generator
        </h1>
        <Link href="https://vercel.com" className="text-slate-400 hover:text-slate-200 text-sm">Deployed on Vercel</Link>
      </section>

      <section className="card p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-slate-300">Topic</label>
            <input className="input mt-1" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Thermal Engineering" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Audience</label>
            <input className="input mt-1" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., B.Tech (India)" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Tone & Constraints</label>
            <input className="input mt-1" value={tone} onChange={e => setTone(e.target.value)} placeholder="e.g., Humanized, plagiarism-free, exam-oriented" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300">Chapters</label>
              <input type="number" className="input mt-1" value={chapters} min={15} max={15} onChange={e => setChapters(parseInt(e.target.value) || 15)} />
            </div>
            <div>
              <label className="text-sm text-slate-300">Words / Chapter</label>
              <input type="number" className="input mt-1" value={wordsPerChapter} min={4500} max={5200} onChange={e => setWordsPerChapter(parseInt(e.target.value) || 4800)} />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn" disabled={!canGenerate || generating} onClick={onGenerate}>
            <Layers className="w-4 h-4 mr-2" /> {generating ? 'Generating?' : 'Generate Book'}
          </button>
        </div>
      </section>

      {book && (
        <section className="space-y-4">
          <div className="card p-6">
            <BookViewer book={book} />
          </div>
        </section>
      )}

      <footer className="text-center text-xs text-slate-500 py-6">
        Built for students in India. Charts, tables, graphs and examples included.
      </footer>
    </main>
  )
}
