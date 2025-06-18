import React from 'react'
import FolderList from '@components/right/contents/FolderList'
import GalleryList from '@components/right/contents/GalleryList'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { useDirectoryViewTypeStore } from '@store/directoryViewTypeStore'
import FileView from '@components/right/contents/FileView'
import { DirectoryViewType } from '@/types'

type ContentType = 'FileText' | DirectoryViewType

function RightContent(): React.ReactNode {
  let contentType: ContentType = 'FileText'
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const directoryViewTypeStore = useDirectoryViewTypeStore((state) => state.directoryViewType)
  if (!selectedItem?.dir) {
    contentType = 'FileText'
  } else if (selectedItem?.dir) {
    contentType = directoryViewTypeStore
  }
  return (
    <div className="content">
      {(() => {
        switch (contentType) {
          case 'FileText':
            return <FileView selectedItem={selectedItem} />
          case 'FolderList':
            return <FolderList />
          case 'GalleryList':
            return <GalleryList />
          default:
            return null
        }
      })()}
    </div>
  )
}

export default RightContent
