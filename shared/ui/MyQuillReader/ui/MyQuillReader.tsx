//
import React, { useEffect, useMemo, useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export interface ReaderProps {
  text: string
  quoteTrigger?: number
  onQuote?: (quoteHtml: string) => void
}

export const MyQuillReader: React.FC<ReaderProps> = ({ text, quoteTrigger, onQuote }) => {
  const readerRef = useRef<ReactQuill>(null)

  useEffect(() => {
    if (readerRef.current && quoteTrigger && quoteTrigger > 0 && onQuote) {
      console.log(`quote trigger ${quoteTrigger}`)

      const reader = readerRef.current.getEditor()
      const selection = reader.getSelection()
      const index = selection && selection.length > 0 ? selection.index : 0
      const length = selection && selection.length > 0 ? selection.length : reader.getLength()
      onQuote(reader.getSemanticHTML(index, length))
    }
  }, [quoteTrigger])

  return useMemo(
    () => (
      <ReactQuill ref={readerRef} value={text} theme="snow" readOnly modules={{ toolbar: null }} />
    ),
    [text]
  )
}
