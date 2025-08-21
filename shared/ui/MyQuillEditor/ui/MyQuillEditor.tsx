import React, { useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

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
  return (
    <ReactQuill
      theme="snow"
      value={value}
      modules={{ toolbar: toolbarOptions }}
      onChange={(value, delta) => {
        console.log('Quill: ' + JSON.stringify(value))
        onChange(value)
      }}
    />
  )
}
