import React, { useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import FolderListHead from '@components/right/contents/FolderListHead'
import FolderListItem from '@components/right/contents/FolderListItem'
import {
  LIST_ITEM_SIZE,
  LIST_HEAD_SIZE,
  fetchTreeItems
} from '@components/left/contents/tree'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { useFolderListOrderStore } from '@store/folderListOrderStore'
import { useFolderListStore } from '@store/folderListStore'


function FolderList(): React.ReactElement {
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const folderListOrder = useFolderListOrderStore((state) => state.folderListOrder)
  const folderList = useFolderListStore((state) => state.folderList)
  const setFolderList = useFolderListStore((state) => state.setFolderList)

  useEffect(() => {
    fetchTreeItems({ treeItem: selectedItem, appendChildItems: false, folderListOrder }).then(
      (fetchItems) => setFolderList(fetchItems)
    )
  }, [folderListOrder, selectedItem, setFolderList])
  return (
    <>
      {folderList && (
        <>
          <FolderListHead />

          <AutoSizer>
            {({ height, width }) => (
              <List
                className="folder-list"
                height={height - LIST_HEAD_SIZE}
                itemCount={folderList?.length || 0}
                itemSize={LIST_ITEM_SIZE}
                width={width}
              >
                {({ index, style }) => {
                  const listItem = folderList[index]
                  return listItem ? (
                    <FolderListItem
                      key={`folder-list-item-${index}`}
                      style={style}
                      treeItem={listItem}
                    />
                  ) : null
                }}
              </List>
            )}
          </AutoSizer>
        </>
      )}
    </>
  )
}

export default FolderList
