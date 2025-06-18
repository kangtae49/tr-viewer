import React from 'react'
import { TreeItem } from '@/types'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faRocket } from '@fortawesome/free-solid-svg-icons'
import { formatFileSize, toDate } from '@components/utils'
import * as api from '@/api'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { useFolderListVisibleColsStore } from '@store/folderListVisibleColsStore'

type FolderListItemProps = {
  style: React.CSSProperties
  treeItem: TreeItem
}

function FolderListItem({ treeItem, style }: FolderListItemProps): React.ReactElement {
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const folderListVisibleCols = useFolderListVisibleColsStore(
    (state) => state.folderListVisibleCols
  )
  const fullPath = treeItem.full_path
  const nm = treeItem.nm
  const sz = formatFileSize(treeItem.sz)
  const ext = treeItem.dir ? '' : treeItem.ext?.slice(-10) || ''
  const tm = toDate(treeItem.tm)
  return (
    <div className="item" style={style}>
      <div className="nm">
        <div className="icon">
          <Icon icon={faRocket} onClick={() => api.shellOpenPath(fullPath)} />
        </div>
        <div className="icon" onClick={() => api.shellShowItemInFolder(fullPath)}>
          <Icon icon={treeItem.dir ? faFolder : faFile} />
        </div>
        <div className="label" title={fullPath} onClick={() => setSelectedItem(treeItem)}>
          {nm}
        </div>
      </div>
      {folderListVisibleCols.includes('Sz') && <div className="sz">{sz}</div>}
      {folderListVisibleCols.includes('Ext') && <div className="ext">{ext}</div>}
      {folderListVisibleCols.includes('Tm') && <div className="tm">{tm}</div>}
    </div>
  )
}

export default FolderListItem
