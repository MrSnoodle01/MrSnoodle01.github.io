import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import Projects from './pages/Projects.tsx'
import Climbing from './pages/Climbing.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App title="Home" />} />
      <Route path="/Projects" element={<Projects title="Projects" />} />
      <Route path="/Climbing" element={<Climbing title="Climbing" />} />
    </Routes>
  </HashRouter>,
)
