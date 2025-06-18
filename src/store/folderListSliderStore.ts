import { create } from 'zustand'
import { SLIDER_STEP } from '@components/left/contents/tree'

type SliderPos = {
  x: number
  y: number
  maxX: number
  maxY: number
  checked: boolean
}
export interface FolderListSliderStore {
  sliderPos: SliderPos
  setSliderPos: (sliderPos: SliderPos) => void
}

export const useFolderListSliderStore = create<FolderListSliderStore>((set) => ({
  sliderPos: {
    x: SLIDER_STEP * 7,
    y: SLIDER_STEP * 3,
    checked: false,
    maxX: SLIDER_STEP * 7,
    maxY: SLIDER_STEP * 3
  },
  setSliderPos: (sliderPos: SliderPos) => set(() => ({ sliderPos }))
}))
