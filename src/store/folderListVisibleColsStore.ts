import { create } from 'zustand'
import { FolderListOrderKey } from '@/types'
export interface FolderListVisibleColsStore {
  folderListVisibleCols: FolderListOrderKey[]
  setFolderListVisibleCols: (folderListVisibleCols: FolderListOrderKey[]) => void
}

export const useFolderListVisibleColsStore = create<FolderListVisibleColsStore>((set) => ({
  folderListVisibleCols: ['Ext', 'Tm', 'Sz'],
  setFolderListVisibleCols: (folderListVisibleCols: FolderListOrderKey[]): void =>
    set(() => ({ folderListVisibleCols }))
}))
