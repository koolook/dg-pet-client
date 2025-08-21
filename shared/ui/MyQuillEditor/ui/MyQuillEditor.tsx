import React, { useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export type EditorProps = {
  value: string
  onChange: (value: string) => void
}

export const MyQuillEditor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={(value, delta) => {
        console.log('Quill: ' + JSON.stringify(value))
        onChange(value)
      }}
    />
  )
}
