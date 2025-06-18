import React, { useEffect } from 'react'
import FolderListHead from '@components/right/contents/FolderListHead'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import {
  fetchTreeItems,
  LIST_HEAD_SIZE,
  SLIDER_SIZE,
  SLIDER_STEP
} from '@components/left/contents/tree'
import GalleryListItem from '@components/right/contents/GalleryListItem'
import { useSelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { useFolderListOrderStore } from '@store/folderListOrderStore'
import { useFolderListStore } from '@store/folderListStore'
import { useFolderListSliderStore } from '@store/folderListSliderStore'

function GalleryList(): React.ReactElement {
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const folderListOrder = useFolderListOrderStore((state) => state.folderListOrder)
  const folderList = useFolderListStore((state) => state.folderList)
  const setFolderList = useFolderListStore((state) => state.setFolderList)
  const sliderPos = useFolderListSliderStore((state) => state.sliderPos)
  const setSliderPos = useFolderListSliderStore((state) => state.setSliderPos)
  const onChangeSliderX = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const maxX = Number((document.querySelector('.slider-w input') as HTMLInputElement).max)
    const maxY = Number((document.querySelector('.slider-h input') as HTMLInputElement).max)
    const x = Number(event.target.value)
    const newPos = { ...sliderPos, x, maxX, maxY }
    if (newPos.checked) {
      newPos.y = Number(event.target.value)
    }
    if (newPos.x > newPos.maxX) {
      newPos.x = newPos.maxX
    }
    if (newPos.y > newPos.maxY) {
      newPos.y = newPos.maxY
    }
    if (newPos != sliderPos) {
      setSliderPos(newPos)
    }
  }
  const onChangeSliderY = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const maxX = Number((document.querySelector('.slider-w input') as HTMLInputElement).max)
    const maxY = Number((document.querySelector('.slider-h input') as HTMLInputElement).max)
    const y = Number(event.target.value)
    const newPos = { ...sliderPos, y, maxX, maxY }
    if (newPos.checked) {
      newPos.x = Number(event.target.value)
    }
    if (newPos.x > newPos.maxX) {
      newPos.x = newPos.maxX
    }
    if (newPos.y > newPos.maxY) {
      newPos.y = newPos.maxY
    }
    if (newPos != sliderPos) {
      setSliderPos(newPos)
    }
  }
  const onChangeSliderChecked = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked
    const newPos = { ...sliderPos, checked }
    if (newPos != sliderPos) {
      setSliderPos(newPos)
    }
  }

  useEffect(() => {
    fetchTreeItems({ treeItem: selectedItem, appendChildItems: false, folderListOrder }).then(
      (fetchItems) => setFolderList(fetchItems)
    )
  }, [folderListOrder, selectedItem, setFolderList])
  return (
    <>
      <FolderListHead />
      <AutoSizer>
        {({ height, width }) => {
          const countPerRow = Math.floor(width / sliderPos.x)
          const countY = Math.ceil((folderList?.length || 0) / countPerRow)
          // console.log(
          //   'length',
          //   folderList?.length,
          //   'width',
          //   width,
          //   'sliderPos',
          //   sliderPos,
          //   'countY',
          //   countY,
          //   'countPerRow',
          //   countPerRow
          // )
          return (
            <>
              <div className="slider-top">
                <div className="slider-chk">
                  <input
                    type="checkbox"
                    checked={sliderPos.checked}
                    onChange={onChangeSliderChecked}
                  />
                </div>
                <div className="slider-w">
                  <input
                    type="range"
                    name="slider"
                    step={SLIDER_STEP}
                    min={0}
                    max={width - SLIDER_SIZE}
                    style={{ width: width - SLIDER_SIZE }}
                    value={sliderPos.x}
                    onChange={onChangeSliderX}
                  />
                </div>
              </div>
              <div
                className="slider-left"
                style={{
                  width: width,
                  height: height - LIST_HEAD_SIZE - SLIDER_SIZE
                }}
              >
                <div
                  className="slider-h"
                  style={{
                    width: SLIDER_SIZE,
                    height: height - LIST_HEAD_SIZE - SLIDER_SIZE
                  }}
                >
                  <input
                    type="range"
                    name="slider"
                    step={SLIDER_STEP}
                    min={0}
                    max={height - LIST_HEAD_SIZE - SLIDER_SIZE}
                    style={{
                      height: height - LIST_HEAD_SIZE - SLIDER_SIZE
                    }}
                    value={sliderPos.y}
                    onChange={onChangeSliderY}
                  />
                </div>
                <List
                  className="folder-gallery"
                  height={height - LIST_HEAD_SIZE - SLIDER_SIZE}
                  itemCount={countY}
                  itemSize={sliderPos.y}
                  width={width}
                >
                  {({ index, style }) => {
                    const rowTreeItems = (folderList || []).slice(
                      index * countPerRow,
                      index * countPerRow + countPerRow
                    )
                    if (rowTreeItems.length < countPerRow) {
                      rowTreeItems.push(...Array(countPerRow - rowTreeItems.length).fill(undefined))
                    }
                    return rowTreeItems ? (
                      <GalleryListItem
                        key={`gallery-list-item-${index}`}
                        style={style}
                        sliderPos={sliderPos}
                        rowTreeItems={rowTreeItems}
                      />
                    ) : null
                  }}
                </List>
              </div>
            </>
          )
        }}
      </AutoSizer>
    </>
  )
}

export default GalleryList
