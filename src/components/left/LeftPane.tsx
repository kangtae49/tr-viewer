import '@assets/left/left-pane.css'

import LeftTop from '@components/left/LeftTop'
import LeftContent from '@components/left/LeftContent'
import React from 'react'

function LeftPane(): React.JSX.Element {
  return (
    <div className="left-pane">
      <LeftTop />
      <LeftContent />
    </div>
  )
}

export default LeftPane
