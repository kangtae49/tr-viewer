import FolderTreeItem from '@components/left/contents/FolderTreeItem'
import React, { useEffect, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import * as api from '@/api'
import { useFolderTreeStore } from '@store/folderTreeStore'
import { useFolderTreeRefStore } from '@store/folderTreeRefStore'
import type { FolderTree } from '@/types'
import {
  fetchFolderTree,
  scrollToItem,
  TREE_ITEM_SIZE
} from '@components/left/contents/tree'
import {
  fetchDisks,
  getNthOfTreeItems,
  getCountOfTreeItems
} from '@components/left/contents/tree'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'

function FolderTree(): React.ReactElement {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const setFolderTreeRef = useFolderTreeRefStore((state) => state.setFolderTreeRef)
  const folderTreeRef = useFolderTreeRefStore((state) => state.folderTreeRef)

  const listRef = useRef<List>(null)
  const [absPath, setAbsPath] = useState<string | null>(null)

  useEffect(() => {
    setFolderTreeRef(listRef)
  }, [setFolderTreeRef])

  useEffect(() => {
    api.getArgPath().then((p) => {
      if (p) {
        setAbsPath(p)
      }
    })
  }, [setAbsPath])

  useEffect(() => {
    if (absPath) {
      fetchFolderTree({ fullPath: absPath }).then(([tree, item]) => {
        if (tree && item) {
          setFolderTree([...tree])
          setSelectedItem(item)
        }
      })
    } else {
      fetchDisks().then((folderTree: FolderTree | undefined) => {
        console.log('else folderTree:', folderTree)
        if (folderTree) {
          setFolderTree([...folderTree])
        } else {
          setFolderTree(undefined)
        }
      })
    }
  }, [absPath, folderTreeRef, setFolderTree, setSelectedItem])

  useEffect(() => {
    if (selectedItem) {
      scrollToItem({ selectedItem, folderTree, folderTreeRef })
    }
  }, [selectedItem]);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-tree"
          height={height}
          itemCount={getCountOfTreeItems(folderTree) || 0}
          itemSize={TREE_ITEM_SIZE}
          width={width}
          ref={listRef}
        >
          {({ index, style }) => {
            const treeItem = getNthOfTreeItems(folderTree, index)[0]
            return treeItem ? (
              <FolderTreeItem key={`folder-tree-item-${index}`} style={style} treeItem={treeItem} />
            ) : null
          }}
        </List>
      )}
    </AutoSizer>
  )
}

export default FolderTree
