import '@assets/main-pane.css'

import LeftPane from '@components/left/LeftPane'
import RightPane from '@components/right/RightPane'
import { SplitPane } from '@rexxars/react-split-pane'
import React, { useState } from 'react'

function MainPane(): React.JSX.Element {
  const [isResizing, setIsResizing] = useState(false)
  return (
    <div className="main-pane">
      <SplitPane
        split="vertical"
        // primary="second"
        minSize={0}
        defaultSize={200}
        onDragStarted={() => setIsResizing(true)}
        onDragFinished={() => setIsResizing(false)}
      >
        <LeftPane />
        <div style={{ position: 'relative', height: '100%' }}>
          {isResizing && <div className="iframe-overlay" />}
          <RightPane />
        </div>
      </SplitPane>
    </div>
  )
}

export default MainPane
