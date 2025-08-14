import React, { ReactNode } from 'react'

export type ContentProps = {
  children: ReactNode
}

export const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div className="content-container bg-light m-auto col-12 col-md-8 flex-fill">{children}</div>
  )
}
