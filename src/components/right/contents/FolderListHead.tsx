import React, { useEffect } from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {
  faCircleChevronDown,
  faCircleChevronUp,
  faCircleHalfStroke,
  faCircleMinus,
  faList,
  faTableCells
} from '@fortawesome/free-solid-svg-icons'
import { DirectoryViewType, FolderListOrderKey, FolderListOrderVal } from '@/types'
import { fetchTreeItems } from '@components/left/contents/tree'
import { useFolderListVisibleColsStore } from '@store/folderListVisibleColsStore'
import { useFolderListOrderStore } from '@store/folderListOrderStore'
import { useFolderListStore } from '@store/folderListStore'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { useDirectoryViewTypeStore } from '@store/directoryViewTypeStore'
import { formatFileSize } from '@components/utils'

function FolderListHead(): React.ReactElement {
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const folderList = useFolderListStore((state) => state.folderList)
  const setFolderList = useFolderListStore((state) => state.setFolderList)
  const folderListOrder = useFolderListOrderStore((state) => state.folderListOrder)
  const setFolderListOrder = useFolderListOrderStore((state) => state.setFolderListOrder)
  const directoryViewType = useDirectoryViewTypeStore((state) => state.directoryViewType)
  const setDirectoryViewType = useDirectoryViewTypeStore((state) => state.setDirectoryViewType)
  const folderListVisibleCols = useFolderListVisibleColsStore(
    (state) => state.folderListVisibleCols
  )
  const setFolderListVisibleCols = useFolderListVisibleColsStore(
    (state) => state.setFolderListVisibleCols
  )
  const clickDirectoryViewType = (viewType: DirectoryViewType): void => {
    setDirectoryViewType(viewType)
  }
  const clickOrder = (key: FolderListOrderKey): void => {
    let val: FolderListOrderVal = 'Asc'
    if (folderListOrder.key == key) {
      val = folderListOrder.val == 'Asc' ? 'Desc' : 'Asc'
    }
    setFolderListOrder({
      key,
      val
    })
    if (folderList) {
      setFolderList([...folderList])
    } else {
      setFolderList([])
    }
  }
  const clickVisible = (key: FolderListOrderKey): void => {
    if (folderListVisibleCols.includes(key)) {
      setFolderListVisibleCols(folderListVisibleCols.filter((k) => k !== key))
    } else {
      setFolderListVisibleCols([...folderListVisibleCols, key])
    }
  }
  let iconNm = faCircleMinus
  let iconSz = faCircleMinus
  let iconExt = faCircleMinus
  let iconTm = faCircleMinus

  if (folderListOrder.key == 'Nm') {
    iconNm = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  } else if (folderListOrder.key == 'Sz') {
    iconSz = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  } else if (folderListOrder.key == 'Ext') {
    iconExt = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  } else if (folderListOrder.key == 'Tm') {
    iconTm = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  }
  useEffect(() => {
    fetchTreeItems({ treeItem: selectedItem, appendChildItems: false, folderListOrder }).then(
      (fetchItems) => setFolderList(fetchItems)
    )
  }, [folderListOrder, selectedItem, setFolderList])
  const total = folderList?.length || 0
  const size = folderList?.map((item) => item?.sz || 0).reduce((acc, val) => acc + val, 0) || 0
  return (
    <div className="folder-head">
      {selectedItem?.dir && (
        <div className="dir-types">
          <Icon
            className={directoryViewType == 'FolderList' ? 'selected' : ''}
            icon={faList}
            onClick={() => clickDirectoryViewType('FolderList')}
          />
          <Icon
            className={directoryViewType == 'GalleryList' ? 'selected' : ''}
            icon={faTableCells}
            onClick={() => clickDirectoryViewType('GalleryList')}
          />
        </div>
      )}
      <div className="info">
        {total.toLocaleString()} files {formatFileSize(size)}
      </div>
      <div className="nm">
        <Icon icon={iconNm} onClick={() => clickOrder('Nm')} />
        name
      </div>
      <div className={['sz', folderListVisibleCols.includes('Sz') ? 'visible' : ''].join(' ')}>
        <Icon icon={iconSz} onClick={() => clickOrder('Sz')} />
        size
        <Icon
          icon={faCircleHalfStroke}
          className={folderListVisibleCols.includes('Sz') ? 'visible' : ''}
          onClick={() => clickVisible('Sz')}
        />
      </div>
      <div className={['ext', folderListVisibleCols.includes('Ext') ? 'visible' : ''].join(' ')}>
        <Icon icon={iconExt} onClick={() => clickOrder('Ext')} />
        ext
        <Icon
          icon={faCircleHalfStroke}
          className={folderListVisibleCols.includes('Ext') ? 'visible' : ''}
          onClick={() => clickVisible('Ext')}
        />
      </div>
      <div className={['tm', folderListVisibleCols.includes('Tm') ? 'visible' : ''].join(' ')}>
        <Icon icon={iconTm} onClick={() => clickOrder('Tm')} />
        date
        <Icon
          icon={faCircleHalfStroke}
          className={folderListVisibleCols.includes('Tm') ? 'visible' : ''}
          onClick={() => clickVisible('Tm')}
        />
      </div>
    </div>
  )
}

export default FolderListHead
