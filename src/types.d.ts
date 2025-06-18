import type {HomeType} from "./bindings.ts";

export type HomePathMap = Record<HomeType, string>
export type FolderTree = TreeItem[]
export type FolderList = TreeItem[]
export type TreeItem = {
  parent?: TreeItem
  nm: string
  full_path: string
  dir?: boolean
  ext?: string
  mt?: string
  sz?: number
  tm?: number
  items?: TreeItem[]
}
export type DirectoryViewType = 'FolderList' | 'GalleryList'

export type FolderListOrder = {
  key: FolderListOrderKey
  val: FolderListOrderVal
}
export type FolderListOrderKey = 'Nm' | 'Ext' | 'Tm' | 'Sz'
export type FolderListOrderVal = 'Asc' | 'Desc'
export type FileViewType =
  | 'Img'
  | 'Embed'
  | 'Html'
  | 'Iframe'
  | 'Text'
  | 'Monaco'
  | 'Video'
  | 'Audio'
  | 'Empty'
  | 'None'
