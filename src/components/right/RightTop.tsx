import React from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faFolder, faArrowUp, faRocket } from '@fortawesome/free-solid-svg-icons'
import { renderTreeFromPath, SEP } from '@components/left/contents/tree'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { useFolderTreeStore } from '@store/folderTreeStore'
import { useFolderTreeRefStore } from '@store/folderTreeRefStore'
import * as api from '@/api'

function RightTop(): React.ReactElement {
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const folderTreeRef = useFolderTreeRefStore((state) => state.folderTreeRef)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const clickPath = async (fullPath: string | undefined): Promise<void> => {
    if (fullPath) {
      await renderTreeFromPath({
        fullPath,
        setFolderTree,
        folderTreeRef,
        setSelectedItem,
        selectedItem
      })
    }
  }
  let pathList: string[] = []
  let fullPathList: string[] = []
  if (selectedItem) {
    let fullPath = selectedItem.full_path
    if (fullPath.endsWith(`:${SEP}`)) {
      fullPath = fullPath.split(SEP).join("")
    }
    pathList = fullPath.split(SEP)
    fullPathList = pathList.map((_nm, idx) => {
      return pathList.slice(0, idx + 1).join(SEP)
    })
  }

  return (
    <div className="right-top">
      <div className="title-path">
        <div className="icon">
          <Icon icon={faArrowUp} onClick={() => clickPath(selectedItem?.parent?.full_path)} />
        </div>
        <div className="icon">
          <Icon icon={faRocket} onClick={() => api.shellOpenPath(selectedItem?.full_path)} />
        </div>
        <div
          className="icon"
          onClick={() => api.shellShowItemInFolder(selectedItem?.full_path)}
        >
          <Icon icon={faFolder} />
        </div>

        {fullPathList.map((fullPath, idx) => {
          return (
            <div key={`part-list-${idx}`} className="part-list">
              {idx != 0 ? SEP : null}
              <div className="part" title={fullPath} onClick={() => clickPath(fullPath)}>
                {pathList[idx]}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default RightTop
