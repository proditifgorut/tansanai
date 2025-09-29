import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BuilderLayout from './components/BuilderLayout'
import Settings from './pages/Settings'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<BuilderLayout />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App
