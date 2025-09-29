import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Folder, FolderOpen, Settings } from 'lucide-react'
import { useBuilder } from '../context/BuilderContext'

const fileContents: Record<string, { content: string, language: string }> = {
  'src/App.tsx': {
    language: 'typescript',
    content: `import React from 'react'
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

export default App`
  },
  'package.json': {
    language: 'json',
    content: `{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^6.3.5"
  }
}`
  },
   'src/main.tsx': {
    language: 'typescript',
    content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`
  }
};


const FileTree: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set(['src']))
  const { setCode, setLanguage } = useBuilder();

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleFileClick = (path: string) => {
    if (fileContents[path]) {
      const { content, language } = fileContents[path];
      setCode(content);
      setLanguage(language);
    }
  };

  const files = [
    { name: 'src', type: 'folder', path: 'src', children: [
      { name: 'components', type: 'folder', path: 'src/components', children: [] },
      { name: 'pages', type: 'folder', path: 'src/pages', children: [] },
      { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
      { name: 'main.tsx', type: 'file', path: 'src/main.tsx' },
    ]},
    { name: 'package.json', type: 'file', path: 'package.json' },
    { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json' },
  ]

  const renderItem = (item: any, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.path)
    const Icon = item.type === 'folder' ? (isExpanded ? FolderOpen : Folder) : FileText

    return (
      <div key={item.path}>
        <div 
          className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-700 ${level > 0 ? 'ml-4' : ''}`}
          onClick={() => item.type === 'folder' ? toggleFolder(item.path) : handleFileClick(item.path)}
        >
          <Icon size={16} className="text-gray-400" />
          <span className="text-sm text-gray-300">{item.name}</span>
        </div>
        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map((child: any) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Files</h3>
        <Link to="/settings" className="text-gray-400 hover:text-white">
          <Settings size={18} />
        </Link>
      </div>
      <div className="space-y-1 flex-1 overflow-y-auto">
        {files.map(item => renderItem(item))}
      </div>
    </div>
  )
}

export default FileTree
