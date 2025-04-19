import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EditorRoom from './pages/EditorRoom' // Added import for EditorRoom

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<EditorRoom />} /> {/* Added EditorRoom route */}
    </Routes>
  )
}
