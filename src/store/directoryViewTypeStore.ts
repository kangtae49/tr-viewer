import { create } from 'zustand'
import { DirectoryViewType } from '@/types'

export interface DirectoryViewTypeStore {
  directoryViewType: DirectoryViewType
  setDirectoryViewType: (directoryViewType: DirectoryViewType) => void
}

export const useDirectoryViewTypeStore = create<DirectoryViewTypeStore>((set) => ({
  directoryViewType: 'FolderList',
  setDirectoryViewType: (directoryViewType: DirectoryViewType) => set(() => ({ directoryViewType }))
}))
