import type { BrickData } from '../models/Brick'

export interface HistoryState {
  bricks: BrickData[]
  past: BrickData[][]
  future: BrickData[][]
}

export type HistoryAction =
  | { type: 'set'; updater: (prev: BrickData[]) => BrickData[] } // pas d'historique (ex: drag en cours)
  | { type: 'commit'; updater: (prev: BrickData[]) => BrickData[] } // avec historique
  | { type: 'load'; bricks: BrickData[] } // remplace tout, avec historique
  | { type: 'undo' }
  | { type: 'redo' }

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'set':
      return { ...state, bricks: action.updater(state.bricks) }

    case 'commit':
      return {
        bricks: action.updater(state.bricks),
        past: [...state.past, state.bricks],
        future: [],
      }

    case 'load':
      return {
        bricks: action.bricks,
        past: [...state.past, state.bricks],
        future: [],
      }

    case 'undo': {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        bricks: previous,
        past: state.past.slice(0, -1),
        future: [state.bricks, ...state.future],
      }
    }

    case 'redo': {
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        bricks: next,
        past: [...state.past, state.bricks],
        future: state.future.slice(1),
      }
    }

    default:
      return state
  }
}
