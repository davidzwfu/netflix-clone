import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const lockScrollingAtom = atom<boolean>(false)
export const scrollPositionAtom = atom<number>(0)

export const myListAtom = atomWithStorage<any[]>('myList', [])
