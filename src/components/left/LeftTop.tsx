import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {
  faInbox,
  faHouseUser,
  faDownload,
  faFileWord,
  faVideo,
  faMusic,
  faImage,
  faDesktop
} from '@fortawesome/free-solid-svg-icons'
import type { HomePathMap } from '@/types'
import { useFolderTreeStore } from '@store/folderTreeStore'
import { useFolderTreeRefStore } from '@store/folderTreeRefStore'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { renderTreeFromPath } from '@components/left/contents/tree'
import * as api from '@/api'

function LeftTop(): React.ReactElement {
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const folderTreeRef = useFolderTreeRefStore((state) => state.folderTreeRef)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)

  const [homeDir, setHomeDir] = useState<HomePathMap>({
    HomeDir: '',
    DesktopDir: '',
    PictureDir: '',
    AudioDir: '',
    VideoDir: '',
    DocumentDir: '',
    DownloadDir: '',
    CacheDir: '',
    ConfigDir: '',
    DataDir: '',
    DataLocalDir: '',
    ExecutableDir: '',
    FontDir: '',
    PublicDir: '',
    RootDir: '',
    RuntimeDir: '',
    TemplateDir: ''
  })
  const clickHomeDir = async (fullPath: string): Promise<void> => {
    await renderTreeFromPath({
      fullPath,
      setFolderTree,
      folderTreeRef,
      setSelectedItem,
      selectedItem
    })
  }

  useEffect(() => {
    const fetchHomes = async (): Promise<HomePathMap> => {
      return await api.getHomeDir()
    }

    fetchHomes().then((h) => {
      setHomeDir(h)
    })
  }, [])
  return (
    <div className="left-top">
      <div className="link root" title="/" onClick={() => clickHomeDir('/')}>
        <Icon icon={faInbox} />
      </div>
      <div className="link home" title="Home" onClick={() => clickHomeDir(homeDir.HomeDir)}>
        <Icon icon={faHouseUser} />
      </div>
      <div
        className="link down"
        title="Downloads"
        onClick={() => clickHomeDir(homeDir.DownloadDir)}
      >
        <Icon icon={faDownload} />
      </div>
      <div
        className="link docs"
        title="Documents"
        onClick={() => clickHomeDir(homeDir.DocumentDir)}
      >
        <Icon icon={faFileWord} />
      </div>
      <div className="link video" title="Movie" onClick={() => clickHomeDir(homeDir.VideoDir)}>
        <Icon icon={faVideo} />
      </div>
      <div className="link music" title="Music" onClick={() => clickHomeDir(homeDir.AudioDir)}>
        <Icon icon={faMusic} />
      </div>
      <div className="link image" title="Image" onClick={() => clickHomeDir(homeDir.PictureDir)}>
        <Icon icon={faImage} />
      </div>
      <div
        className="link desktop"
        title="Desktop"
        onClick={() => clickHomeDir(homeDir.DesktopDir)}
      >
        <Icon icon={faDesktop} />
      </div>
    </div>
  )
}

export default LeftTop
