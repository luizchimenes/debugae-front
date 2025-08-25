import User from '@/app/models/User'
import { atom } from 'jotai'

export const userAtom = atom<User | null>();