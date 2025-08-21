//
import React from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export const MyQuillReader: React.FC<{ text: string }> = ({ text }) => {
  return <ReactQuill value={text} theme="snow" readOnly modules={{ toolbar: null }} />
}
