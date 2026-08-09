import { useReducer, useEffect, useState } from 'react'
import Scene from './engine/Scene'
import CatalogPanel from './ui/CatalogPanel'
import type { BrickData } from './models/Brick'
import { historyReducer, type HistoryState } from './engine/history'
import { loadFromLocalStorage, hasSavedData } from './engine/storage'

const initialBricks: BrickData[] = [
  { id: '1', width: 2, length: 4, height: 3, color: '#c91a09', position: [0, 0, 0], rotation: 0, shape: 'block' },
  { id: '2', width: 2, length: 4, height: 3, color: '#0055bf', position: [0, 9.6, 0], rotation: 0, shape: 'block' },
  { id: '3', width: 1, length: 2, height: 3, color: '#f2cd37', position: [32, 0, 0], rotation: 0, shape: 'block' },
]

const initialHistoryState: HistoryState = { bricks: initialBricks, past: [], future: [] }

function App() {
  const [state, dispatch] = useReducer(historyReducer, initialHistoryState)
  const [viewMode, setViewMode] = useState<'perspective' | 'top'>('perspective')

  useEffect(() => {
    if (hasSavedData()) {
      const loaded = loadFromLocalStorage()
      if (loaded) {
        dispatch({ type: 'load', bricks: loaded })
      }
    }
  }, [])

  function updateBricks(updater: (prev: BrickData[]) => BrickData[]) {
    dispatch({ type: 'set', updater })
  }

  function commitBricks(updater: (prev: BrickData[]) => BrickData[]) {
    dispatch({ type: 'commit', updater })
  }

  function loadBricks(newBricks: BrickData[]) {
    dispatch({ type: 'load', bricks: newBricks })
  }

  function addBrick(width: number, length: number, height: number, color: string, shape: BrickData['shape'] = 'block') {
    commitBricks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        width,
        length,
        height,
        color,
        position: [80, 0, 0],
        rotation: 0,
        shape,
      },
    ])
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <CatalogPanel
        onAddBrick={addBrick}
        bricks={state.bricks}
        onLoadBricks={loadBricks}
        onUndo={() => dispatch({ type: 'undo' })}
        onRedo={() => dispatch({ type: 'redo' })}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
        viewMode={viewMode}
        onToggleView={() => setViewMode((v) => (v === 'perspective' ? 'top' : 'perspective'))}
      />
      <div style={{ flex: 1 }}>
        <Scene
          bricks={state.bricks}
          updateBricks={updateBricks}
          commitBricks={commitBricks}
          viewMode={viewMode}
        />
      </div>
    </div>
  )
}

export default App



