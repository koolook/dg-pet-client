import React, { useRef } from 'react'
import { Button } from 'react-bootstrap'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import useContentData from '@shared/lib/hooks/useContentData'
import { QuoteItem } from '@shared/models/QuoteItem'
import { MyQuillReader } from '@shared/ui/MyQuillReader'

export type EditorProps = {
  value: string
  onChange: (value: string) => void
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }, { header: 3 }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ color: [] }, { background: [] }],
]

export const MyQuillEditor: React.FC<EditorProps> = ({ value, onChange }) => {
  const contentData = useContentData()
  const ref = useRef<ReactQuill>(null)

  const handleInsert = (q: QuoteItem) => {
    if (!ref.current) return

    const editor = ref.current.getEditor()
    const newTxt = `<blockquote cite="/#${q.articleId}">${q.quoteHtml}</blockquote>`

    const selection = editor.getSelection()

    editor.clipboard.dangerouslyPasteHTML(selection?.index || 0, newTxt)
  }

  return (
    <>
      <ReactQuill
        ref={ref}
        theme="snow"
        value={value}
        modules={{ toolbar: toolbarOptions }}
        onChange={(value, delta) => {
          console.log('Quill: ' + JSON.stringify(value))
          onChange(value)
        }}
      />
      {contentData.quotes.length > 0 && (
        <div className="d-flex flex-column gap-3 mt-3" id="quoteOptions">
          {contentData.quotes.map((q, i) => (
            <div className="d-flex flex-column gap-2 p-3 border rounded" key={i}>
              <MyQuillReader text={q.quoteHtml} />
              <Button
                onClick={() => handleInsert(q)}
                className="col-2"
                size="sm"
                variant="outline-primary"
              >
                Insert quote
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
