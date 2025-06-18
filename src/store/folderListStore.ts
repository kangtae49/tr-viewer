import { create } from 'zustand'
import type { FolderList } from '@/types'

export interface FolderListStore {
  folderList?: FolderList
  setFolderList: (folderList?: FolderList) => void
}

export const useFolderListStore = create<FolderListStore>((set) => ({
  folderList: undefined,
  setFolderList: (folderList?: FolderList) => set(() => ({ folderList }))
}))
