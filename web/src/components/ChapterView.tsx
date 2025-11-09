"use client"

import { Book, ChapterOutline } from '@/lib/types'
import { Line, Bar, Pie, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { generateLongFormText } from '@/lib/generator'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
)

export function ChapterView({ outline, book, expanded }: { outline: ChapterOutline; book: Book; expanded: boolean }) {
  const longText = expanded
    ? generateLongFormText(book.title, book.audience, book.tone, outline.seed, book.targetWordsPerChapter)
    : ''
  return (
    <article className="card p-6 space-y-4">
      <header className="space-y-1">
        <h3 className="text-xl font-bold">Chapter {outline.index}: {outline.title}</h3>
        <p className="text-slate-300">{outline.summary}</p>
        <div className="text-sm text-slate-400">Key terms: {outline.keyTerms.join(', ')}</div>
      </header>

      <section>
        <h4 className="font-semibold mb-1">Learning Objectives</h4>
        <ul className="list-disc pl-6 text-slate-300">
          {outline.objectives.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {outline.charts.map((c, i) => (
          <div key={i} className="bg-slate-900/60 rounded p-4 border border-slate-700">
            <h5 className="font-semibold mb-2">{c.title}</h5>
            {c.type === 'line' && <Line data={{ labels: c.labels, datasets: c.datasets.map(d => ({ ...d, borderColor: 'rgb(99,102,241)', backgroundColor: 'rgba(99,102,241,0.3)' })) }} options={{ plugins: { legend: { display: true } }, scales: { y: { grid: { color: '#334155' } }, x: { grid: { color: '#334155' } } } }} />}
            {c.type === 'bar' && <Bar data={{ labels: c.labels, datasets: c.datasets.map(d => ({ ...d, backgroundColor: 'rgba(99,102,241,0.6)' })) }} options={{ plugins: { legend: { display: true } }, scales: { y: { grid: { color: '#334155' } }, x: { grid: { color: '#334155' } } } }} />}
            {c.type === 'pie' && <Pie data={{ labels: c.labels, datasets: c.datasets.map(d => ({ ...d, backgroundColor: ['#6366f1','#22d3ee','#10b981','#f59e0b','#ef4444','#14b8a6'] })) }} options={{ plugins: { legend: { position: 'bottom' } } }} />}
            {c.type === 'radar' && <Radar data={{ labels: c.labels, datasets: c.datasets.map(d => ({ ...d, backgroundColor: 'rgba(34,211,238,0.25)', borderColor: '#22d3ee' })) }} options={{ plugins: { legend: { display: true } }, scales: { r: { grid: { color: '#334155' } } } }} />}
          </div>
        ))}
      </section>

      <section>
        <h4 className="font-semibold mb-1">Reference Tables</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {outline.tables.map((t, i) => (
            <div key={i} className="overflow-x-auto">
              <div className="text-sm font-semibold mb-2">{t.title}</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900">
                    {t.headers.map((h, j) => <th key={j} className="text-left px-3 py-2 border-b border-slate-700">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, k) => (
                    <tr key={k} className="odd:bg-slate-900/40">
                      {r.map((cell, m) => <td key={m} className="px-3 py-2 border-b border-slate-800">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="font-semibold mb-1">Examples</h4>
        <div className="space-y-3">
          {outline.examples.map((ex, i) => (
            <div key={i} className="bg-slate-900/60 rounded p-4 border border-slate-700">
              <div className="font-semibold mb-1">{ex.title}</div>
              <p className="text-slate-300 text-sm">{ex.body}</p>
            </div>
          ))}
        </div>
      </section>

      {expanded && (
        <section>
          <h4 className="font-semibold mb-2">Chapter Text (~{book.targetWordsPerChapter.toLocaleString()} words)</h4>
          <div className="prose prose-invert max-w-none">
            {longText.split('\n\n').map((p, i) => <p key={i} className="text-slate-200 leading-7 mb-4">{p}</p>)}
          </div>
        </section>
      )}
    </article>
  )
}
