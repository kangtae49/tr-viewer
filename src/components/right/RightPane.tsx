import '@assets/right/right-pane.css'
import RightTop from '@components/right/RightTop'
import RightContent from '@components/right/RightContent'

function RightPane(): React.JSX.Element {
  return (
    <div className="right-pane">
      <RightTop />
      <RightContent />
    </div>
  )
}

export default RightPane
