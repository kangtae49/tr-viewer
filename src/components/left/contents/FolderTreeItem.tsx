import React from 'react'
import { TreeItem } from '@/types'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faFile } from '@fortawesome/free-solid-svg-icons'
import {
  getNthParent,
  SEP,
  TREE_DEPT_SIZE,
  toggleDirectory
} from '@components/left/contents/tree'
import { useFolderTreeStore } from '@store/folderTreeStore'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'

type Prop = {
  style: React.CSSProperties
  treeItem: TreeItem
}
function FolderTreeItem({ treeItem, style }: Prop): React.ReactElement {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)

  const clickIcon = async (treeItem?: TreeItem): Promise<void> => {
    console.log('click', treeItem)
    if (folderTree) {
      if (treeItem?.dir) {
        await toggleDirectory({ treeItem })
        // if (!treeItem.items) {
        //   const treeItems = await fetchTreeItems({ treeItem })
        //   if (!treeItems) {
        //     delete treeItem.items
        //   }
        // } else {
        //   delete treeItem.items
        // }
        setFolderTree([...folderTree])
      } else {
        clickLabel(treeItem)
      }
    }
  }

  const clickLabel = (newTreeItem?: TreeItem): void => {
    console.log('clickLabel', newTreeItem)
    setSelectedItem(newTreeItem)
  }

  let fullPath = treeItem.full_path
  if (fullPath.endsWith(`:${SEP}`)) {
    fullPath = fullPath.split(SEP).join("")
  }
  const arr = fullPath.split(SEP)
  const pathList = arr.slice(0, -1).map((_nm, idx) => {
    return arr.slice(0, idx + 1).join(SEP)
  })
  const iconWidth = 18
  const nm_minus = TREE_DEPT_SIZE * pathList.length + iconWidth
  const classNameSelected = treeItem == selectedItem ? 'selected' : ''
  const icon_style = { flex: `0 0 ${iconWidth}px` }
  const nm_style = {
    width: `calc(100% - ${nm_minus}px)`
  }
  return (
    <div className={`item ${classNameSelected}`} style={style}>
      {pathList.map((path, idx) => {
        const color = idx % 2 === 0 ? '#c8ada4' : '#6a99b8'
        const parentTreeItem = getNthParent(treeItem, pathList.length - idx)
        return (
          <div
            className="depth"
            key={`tree-item-depth-${idx}`}
            title={path}
            onClick={() => clickIcon(parentTreeItem)}
          >
            <svg width="100%" height="100%">
              <line x1="5" y1="0" x2="5" y2="100%" stroke={color} strokeWidth="2" />
            </svg>
          </div>
        )
      })}
      <div className="nm" style={nm_style}>
        <div className="icon" style={icon_style} onClick={() => clickIcon(treeItem)}>
          <Icon icon={treeItem.dir ? faFolderPlus : faFile} />
        </div>
        <div
          className="label"
          title={treeItem.full_path}
          // style={nm_label_style}
          onClick={() => clickLabel(treeItem)}
        >
          {treeItem.nm}
        </div>
      </div>
    </div>
  )
}

export default FolderTreeItem
