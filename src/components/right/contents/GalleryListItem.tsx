import React, { useEffect, useRef } from 'react'
import { TreeItem } from '@/types'
import { formatFileSize, toDate } from '@components/utils'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { convertFileSrc } from '@tauri-apps/api/core'
import { faFile, faFolder, faRocket } from '@fortawesome/free-solid-svg-icons'
import { useFolderListVisibleColsStore } from '@store/folderListVisibleColsStore'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import * as api from '@/api'

type GalleryListItemProp = {
  style: React.CSSProperties
  rowTreeItems: TreeItem[]
  sliderPos: { x: number; y: number }
}
function GalleryListItem({
  rowTreeItems,
  style,
  sliderPos
}: GalleryListItemProp): React.ReactElement {
  // console.log(rowTreeItems)
  return (
    <div className="item" style={style}>
      {rowTreeItems.map((item, idx) => {
        const sz = item?.sz || 0
        if (!item) {
          return <ViewNone key={idx} sliderPos={sliderPos} />
        } else if (item.mt?.startsWith('image/')) {
          return <ViewImg key={idx} sliderPos={sliderPos} item={item} />
        } else if (item.mt?.startsWith('video/') && sz > 1024 * 500) {
          return <ViewVideo key={idx} sliderPos={sliderPos} item={item} />
        } else if (item.mt?.startsWith('audio/') && sz > 1024 * 500) {
          return <ViewAudio key={idx} sliderPos={sliderPos} item={item} />
        } else {
          return <ViewNm key={idx} sliderPos={sliderPos} item={item} />
        }
      })}
    </div>
  )
}

interface FileViewProps {
  item?: TreeItem
  sliderPos: { x: number; y: number }
}

function ViewNm({ item, sliderPos }: FileViewProps): React.ReactElement {
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const folderListVisibleCols = useFolderListVisibleColsStore(
    (state) => state.folderListVisibleCols
  )
  const fullPath = item?.full_path
  const nm = item?.nm
  const sz = formatFileSize(item?.sz)
  const ext = item?.dir ? '' : item?.ext?.slice(-10) || ''
  const tm = toDate(item?.tm)
  return (
    <div
      className="col view-nm"
      style={{ width: sliderPos.x, height: sliderPos.y }}
      title={item?.nm}
    >
      <div className="nm">
        <div className="icon">
          <Icon icon={faRocket} onClick={() => api.shellOpenPath(fullPath)} />
        </div>
        <div className="icon" onClick={() => api.shellShowItemInFolder(fullPath)}>
          <Icon icon={item?.dir ? faFolder : faFile} />
        </div>
        <div className="label" title={fullPath} onClick={() => setSelectedItem(item)}>
          {nm}
        </div>
      </div>
      {folderListVisibleCols.includes('Sz') && <div className="sz">{sz}</div>}
      {folderListVisibleCols.includes('Ext') && <div className="ext">{ext}</div>}
      {folderListVisibleCols.includes('Tm') && <div className="tm">{tm}</div>}
    </div>
  )
}

function ViewNone({ sliderPos }: FileViewProps): React.ReactElement {
  return <div className="col view-none" style={{ width: sliderPos.x, height: sliderPos.y }}></div>
}

function ViewImg({ item, sliderPos }: FileViewProps): React.ReactElement {
  if (!item) {
    return  <div className="col view-img"></div>
  }
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  return (
    <div
      className="col view-img"
      style={{ width: sliderPos.x, height: sliderPos.y }}
      title={item?.nm}
    >
      <img
        src={convertFileSrc(item?.full_path)}
        loading="lazy"
        alt={item?.full_path}
        onClick={() => setSelectedItem(item)}
      />
    </div>
  )
}

function ViewAudio({ item, sliderPos }: FileViewProps): React.ReactElement {
  if (!item) {
    return  <div className="col view-audio"></div>
  }
  const mediaRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.3
      mediaRef.current?.load()
    }
  })
  return (
    <div
      className="col view-audio"
      style={{ width: sliderPos.x, height: sliderPos.y }}
      title={item?.nm}
    >
      <audio ref={mediaRef} controls={true} autoPlay={false}>
        <source src={convertFileSrc(item?.full_path)} type={item?.mt} />
      </audio>
    </div>
  )
}

function ViewVideo({ item, sliderPos }: FileViewProps): React.ReactElement {
  if (!item) {
    return  <div className="col view-video"></div>
  }
  const mediaRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.3
      mediaRef.current?.load()
    }
  })
  return (
    <div
      className="col view-video"
      style={{ width: sliderPos.x, height: sliderPos.y }}
      title={item?.nm}
    >
      <video ref={mediaRef} controls={true} autoPlay={false}>
        <source src={convertFileSrc(item?.full_path)} type={item?.mt} />
      </video>
    </div>
  )
}

export default GalleryListItem
