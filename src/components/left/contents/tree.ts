import { FolderTree, TreeItem } from '@/types'
import { DiskInfo, Item, OptParams } from '@/bindings'
import { FolderTreeStore } from '@store/folderTreeStore'
import { FolderTreeRefStore } from '@store/folderTreeRefStore'
import { SelectedTreeItemStore } from '@store/selectedTreeItemStore'
import { FolderListOrderStore } from '@store/folderListOrderStore'
import * as api from '@/api'

export const SEP = '\\'
export const TREE_ITEM_SIZE = 18
export const TREE_DEPT_SIZE = 13
export const LIST_ITEM_SIZE = 18
export const LIST_HEAD_SIZE = 25
export const SLIDER_SIZE = 20
export const SLIDER_STEP = 20

const treeParams: OptParams = {
  cache_nm: 'folder-tree',
  meta_types: ['Ext', 'Mt', 'Sz', 'Tm'],
  ordering: [
    { nm: 'Dir', asc: 'Asc' },
    { nm: 'Nm', asc: 'Asc' }
  ]
}

const fromDisk = (disk: DiskInfo): TreeItem => {
  return {
    nm: disk.path.split(SEP).join(""),
    full_path: disk.path,
    dir: true
  }
}

const fromItem = ({ item, parentTreeItem }: { item: Item; parentTreeItem: TreeItem }): TreeItem => {
  const basePath = parentTreeItem.full_path
  const fullPath = basePath.endsWith(`:${SEP}`)
    ? [basePath.split(SEP).join(""), item.nm].join(SEP)
    : [basePath, item.nm].join(SEP)
  const treeItem: TreeItem = {
    nm: item.nm.split(SEP).join(""),
    full_path: fullPath,
    parent: parentTreeItem.parent
  }
  if (item.dir != undefined) treeItem.dir = item.dir
  if (item.ext != undefined) treeItem.ext = item.ext
  if (item.mt != undefined) treeItem.mt = item.mt
  if (item.sz != undefined) treeItem.sz = Number(item.sz)
  if (item.tm != undefined) treeItem.tm = Number(item.tm)

  if (parentTreeItem) {
    treeItem.parent = parentTreeItem
  }
  return treeItem
}

export function getNthParent(item: TreeItem | undefined, n: number): TreeItem | undefined {
  let current = item
  let count = 0

  while (current && count < n) {
    current = current?.parent
    count++
  }

  return current
}

export function getNthOfTreeItems(
  treeItems: TreeItem[] | undefined,
  nth: number,
  curIdx = -1
): [TreeItem | undefined, number] {
  let findTreeItem: TreeItem | undefined = undefined
  if (!treeItems) {
    return [findTreeItem, curIdx]
  }
  for (let idxItem = 0; idxItem < treeItems.length; idxItem++) {
    curIdx++
    if (curIdx == nth) {
      findTreeItem = treeItems[idxItem]
      break
    }
    const [findItem, nextIdx] = getNthOfTreeItems(treeItems[idxItem]?.items, nth, curIdx)
    findTreeItem = findItem
    curIdx = nextIdx
    if (findTreeItem) {
      break
    }
  }
  return [findTreeItem, curIdx]
}

export function getNth(
  treeItems: TreeItem[] | undefined,
  item: TreeItem,
  curIdx = -1
): [TreeItem | undefined, number] {
  let findTreeItem: TreeItem | undefined = undefined
  if (!treeItems) {
    return [findTreeItem, curIdx]
  }
  for (let idxItem = 0; idxItem < treeItems.length; idxItem++) {
    curIdx++
    if (treeItems[idxItem] == item) {
      findTreeItem = treeItems[idxItem]
      break
    }
    const [findItem, nextIdx] = getNth(treeItems[idxItem]?.items, item, curIdx)
    findTreeItem = findItem
    curIdx = nextIdx
    if (findTreeItem) {
      break
    }
  }
  return [findTreeItem, curIdx]
}

export function getCountOfTreeItems(treeItems: TreeItem[] | undefined): number {
  if (!treeItems) {
    return 0
  }
  let count = treeItems.length
  for (let idxItem = 0; idxItem < treeItems.length; idxItem++) {
    const treeItem = treeItems[idxItem]
    if (!treeItem.items) {
      continue
    }
    count += getCountOfTreeItems(treeItem.items)
  }
  return count
}

export const fetchDisks = async (): Promise<FolderTree> => {
  const disks: DiskInfo[] = await api.getDisks()
  return disks.map(fromDisk)
}

export const fetchTreeItems = async ({
  treeItem,
  appendChildItems = true,
  folderListOrder
}: {
  treeItem?: TreeItem
  appendChildItems?: boolean
  folderListOrder?: FolderListOrderStore['folderListOrder']
}): Promise<TreeItem[] | undefined> => {
  if (!treeItem) {
    return undefined
  }
  let params: OptParams = {
    ...treeParams,
    path_str: treeItem.full_path
  }
  if (folderListOrder) {
    if (folderListOrder.key == 'Nm') {
      params = {
        ...params,
        ordering: [
          { nm: 'Dir', asc: folderListOrder.val },
          { nm: 'Nm', asc: folderListOrder.val }
        ]
      }
    } else if (folderListOrder.key == 'Ext') {
      params = {
        ...params,
        ordering: [
          { nm: 'Dir', asc: folderListOrder.val },
          { nm: 'Ext', asc: folderListOrder.val },
          { nm: 'Nm', asc: folderListOrder.val }
        ]
      }
    } else if (folderListOrder.key == 'Sz') {
      params = {
        ...params,
        ordering: [
          { nm: 'Dir', asc: folderListOrder.val },
          { nm: 'Sz', asc: folderListOrder.val },
          { nm: 'Nm', asc: folderListOrder.val }
        ]
      }
    } else if (folderListOrder.key == 'Tm') {
      params = {
        ...params,
        ordering: [
          { nm: 'Dir', asc: folderListOrder.val },
          { nm: 'Tm', asc: folderListOrder.val },
          { nm: 'Nm', asc: folderListOrder.val }
        ]
      }
    }
  }
  const folder = await api.readFolder(params)
  const folderItems = folder?.item?.items
  if (folderItems) {
    const treeItems = folderItems.map((folderItem) => {
      return fromItem({ item: folderItem, parentTreeItem: treeItem })
    })
    if (appendChildItems) {
      if (treeItem.items && treeItem.tm != folder?.item?.tm) {
        treeItem.items = treeItems
      } else {
        treeItem.items = treeItems
      }
    }
    return treeItems
  }
  return undefined
}

export const fetchFolderTree = async ({
  fullPath
}: {
  fullPath: string
}): Promise<[TreeItem[], TreeItem | undefined, number]> => {
  const paths = fullPath.split(SEP).filter((path) => path != '')
  const folderTree = await fetchDisks()
  let parentTree = folderTree
  let selectedItem: TreeItem | undefined
  let curIdx = 0
  for (let i = 0; i < paths.length; i++) {
    // const path = paths.slice(0, i + 1).join(SEP)
    const findItem = parentTree.find((treeItem) => treeItem.nm === paths[i])
    if (!findItem) {
      break
    }
    selectedItem = findItem
    curIdx += parentTree.indexOf(findItem)
    if (i == paths.length - 1) {
      break
    }
    const fetchItems = await fetchTreeItems({ treeItem: selectedItem })
    if (fetchItems) {
      parentTree = fetchItems
    } else {
      break
    }
    curIdx++
  }
  return [folderTree, selectedItem, curIdx]
}

export const renderTreeFromPath = async ({
  fullPath,
  setFolderTree,
  folderTreeRef,
  setSelectedItem
}: {
  fullPath: string
  setFolderTree: FolderTreeStore['setFolderTree']
  folderTreeRef: FolderTreeRefStore['folderTreeRef']
  setSelectedItem: SelectedTreeItemStore['setSelectedItem']
  selectedItem: SelectedTreeItemStore['selectedItem']
}): Promise<void> => {
  if (fullPath == '/') {
    fetchDisks().then((disks) => {
      setFolderTree(disks)
    })
  } else {
    fetchFolderTree({ fullPath }).then(([newFolderTree, newSelectedItem]) => {
      if (newFolderTree && newSelectedItem) {
        setFolderTree([...newFolderTree])
        setSelectedItem(newSelectedItem)
        scrollToItem({ selectedItem: newSelectedItem, folderTree: newFolderTree, folderTreeRef })
      }
      // const totalCount = getCountOfTreeItems(newFolderTree)
      // if (document.querySelector('.folder-tree')?.scrollHeight == totalCount * TREE_ITEM_SIZE) {
      //   folderTreeRef?.current?.scrollToItem(newSelectedIndex, 'center')
      // } else {
      //   setTimeout(() => {
      //     folderTreeRef?.current?.scrollToItem(newSelectedIndex, 'center')
      //   }, 100)
      // }
    })
  }
}

export const toggleDirectory = async ({ treeItem }: { treeItem?: TreeItem }): Promise<void> => {
  if (treeItem?.dir) {
    if (!treeItem.items) {
      const treeItems = await fetchTreeItems({ treeItem })
      if (!treeItems) {
        delete treeItem.items
      }
    } else {
      delete treeItem.items
    }
  }
}

export const scrollToItem = async ({
  folderTree,
  selectedItem,
  folderTreeRef
}: {
  selectedItem: TreeItem
  folderTree: FolderTreeStore['folderTree']
  folderTreeRef: FolderTreeRefStore['folderTreeRef']
}): Promise<void> => {
  const [, nth] = getNth(folderTree, selectedItem)
  const totalCount = getCountOfTreeItems(folderTree)
  let scrollHeight = document.querySelector('.folder-tree')?.scrollHeight || 0
  scrollHeight = Math.floor(scrollHeight / TREE_ITEM_SIZE) * TREE_ITEM_SIZE
  console.log('scroll:', scrollHeight, totalCount, totalCount * TREE_ITEM_SIZE, nth)
  // setTimeout(() => {
  //   console.log('setTimeout scroll:', nth, folderTreeRef?.current)
  //   folderTreeRef?.current?.scrollToItem(nth, 'auto')
  // }, 500)

  if (scrollHeight == totalCount * TREE_ITEM_SIZE) {
    requestAnimationFrame(() => {
      folderTreeRef?.current?.scrollToItem(nth, 'auto')
    })
  } else {
    setTimeout(() => {
      console.log('setTimeout scroll:', nth, folderTreeRef?.current)
      folderTreeRef?.current?.scrollToItem(nth, 'auto')
    }, 100)
  }
}
