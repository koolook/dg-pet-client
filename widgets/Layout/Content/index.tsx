import React, { ReactNode } from 'react'

export type ContentProps = {
  children: ReactNode
}

export const Content: React.FC<ContentProps> = ({ children }) => {
  return <div className="content-container">{children}</div>
}
