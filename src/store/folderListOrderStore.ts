import { create } from 'zustand'
import { FolderListOrder } from '@/types'

export interface FolderListOrderStore {
  folderListOrder: FolderListOrder
  setFolderListOrder: (folderListOrder: FolderListOrder) => void
}

export const useFolderListOrderStore = create<FolderListOrderStore>((set) => ({
  folderListOrder: { key: 'Nm', val: 'Asc' },
  setFolderListOrder: (folderListOrder: FolderListOrder): void =>
    set(() => ({
      folderListOrder: folderListOrder
    }))
}))
