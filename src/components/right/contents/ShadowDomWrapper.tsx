import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

type ShadowDomWrapperProps = {
  mode?: ShadowRootMode
  children: React.ReactNode
  styleSheets?: CSSStyleSheet[]
}

export const ShadowDomWrapper: React.FC<ShadowDomWrapperProps> = ({
  children,
  mode = 'open',
  styleSheets
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)

  useEffect(() => {
    if (!containerRef?.current?.shadowRoot) {
      const root = containerRef?.current?.attachShadow({ mode })

      if (root) {
        if (styleSheets && root.adoptedStyleSheets !== undefined) {
          root.adoptedStyleSheets = styleSheets
        }
        setShadowRoot(root)
      }
    }
  }, [shadowRoot, mode, styleSheets])

  return (
    <div className="shadow-dom" ref={containerRef}>
      {shadowRoot && ReactDOM.createPortal(children, shadowRoot)}
    </div>
  )
}
