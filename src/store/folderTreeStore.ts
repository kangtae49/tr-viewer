import { create } from 'zustand'
import type { FolderTree } from '@/types'

export interface FolderTreeStore {
  folderTree?: FolderTree
  setFolderTree: (folderTree?: FolderTree) => void
}

export const useFolderTreeStore = create<FolderTreeStore>((set) => ({
  folderTree: undefined,
  setFolderTree: (folderTree?: FolderTree) => set(() => ({ folderTree }))
}))
