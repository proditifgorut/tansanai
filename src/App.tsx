import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import BuilderLayout from './components/BuilderLayout'
import Settings from './pages/Settings'
import LandingPage from './pages/LandingPage'
import GithubImport from './pages/GithubImport'

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={<BuilderLayout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/import/github" element={<GithubImport />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
