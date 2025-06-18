import React from 'react'
import FolderTree from '@components/left/contents/FolderTree'
import {
  getNth,
  getNthOfTreeItems,
  scrollToItem,
  toggleDirectory
} from '@components/left/contents/tree'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { useFolderTreeStore } from '@store/folderTreeStore'
import { useFolderTreeRefStore } from '@store/folderTreeRefStore'

function LeftContent(): React.ReactNode {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const folderTreeRef = useFolderTreeRefStore((state) => state.folderTreeRef)
  const onKeyDownTree = async (e: React.KeyboardEvent): Promise<void> => {
    if (!selectedItem) {
      return
    }
    const [, nth] = getNth(folderTree, selectedItem)
    if (e.key === 'ArrowDown') {
      const [newTreeItem] = getNthOfTreeItems(folderTree, nth + 1)
      if (newTreeItem) {
        setSelectedItem(newTreeItem)
        await scrollToItem({ folderTree, selectedItem: newTreeItem, folderTreeRef })
      }
    } else if (e.key === 'ArrowUp') {
      const [newTreeItem] = getNthOfTreeItems(folderTree, nth - 1)
      if (newTreeItem) {
        setSelectedItem(newTreeItem)
        await scrollToItem({ folderTree, selectedItem: newTreeItem, folderTreeRef })
      }
    } else if (e.key === 'ArrowLeft') {
      if (selectedItem.parent) {
        setSelectedItem(selectedItem.parent)
        await scrollToItem({ folderTree, selectedItem: selectedItem.parent, folderTreeRef })
      }
    } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      if (folderTree && selectedItem.dir) {
        await toggleDirectory({ treeItem: selectedItem })
        setFolderTree([...folderTree])
      }
    }
  }

  return (
    <div className="content" tabIndex={0} onKeyDown={onKeyDownTree}>
      <FolderTree />
    </div>
  )
}

export default LeftContent
