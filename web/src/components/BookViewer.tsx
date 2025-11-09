"use client"

import { useMemo, useRef, useState } from 'react'
import { Book } from '@/lib/types'
import { ChapterView } from './ChapterView'
import { FileDown } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export function BookViewer({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState<number | null>(1)
  const rootRef = useRef<HTMLDivElement>(null)

  const onExportPdf = async () => {
    if (!rootRef.current) return
    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
    const node = rootRef.current

    const pages = node.querySelectorAll('[data-export-page]')
    let pageIndex = 0
    for (const page of Array.from(pages)) {
      const canvas = await html2canvas(page as HTMLElement, { scale: 2, backgroundColor: '#0f172a' })
      const img = canvas.toDataURL('image/png')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight)
      if (pageIndex < pages.length - 1) doc.addPage()
      pageIndex++
    }
    doc.save(`${book.title.replace(/[^a-z0-9\-]+/gi, '_')}.pdf`)
  }

  return (
    <div className="space-y-6" ref={rootRef}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <p className="text-slate-300">{book.subtitle}</p>
          <p className="text-slate-400 text-sm">Audience: {book.audience} ? Tone: {book.tone}</p>
        </div>
        <button className="btn" onClick={onExportPdf}><FileDown className="w-4 h-4 mr-2"/>Export PDF</button>
      </div>

      <ol className="grid md:grid-cols-3 gap-2 text-sm">
        {book.chapters.map(c => (
          <li key={c.index}>
            <button className={`w-full text-left px-3 py-2 rounded bg-slate-800/70 border border-slate-700 hover:bg-slate-700 ${expanded===c.index?'ring-2 ring-primary-500':''}`} onClick={() => setExpanded(c.index)}>
              <span className="font-semibold mr-2">Ch {c.index}.</span>{c.title}
            </button>
          </li>
        ))}
      </ol>

      {book.chapters.map(c => (
        <div key={c.index} data-export-page>
          <ChapterView outline={c} book={book} expanded={expanded===c.index} />
        </div>
      ))}
    </div>
  )
}
