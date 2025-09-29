import React from 'react'
import Editor from '@monaco-editor/react'
import toast from 'react-hot-toast'
import { useBuilder } from '../context/BuilderContext'
import { Button } from './ui/button'
import { Copy } from 'lucide-react'

const CodeEditorPanel: React.FC = () => {
  const { code, setCode, language, setLanguage } = useBuilder();

  const handleCopy = () => {
    if (navigator.clipboard && code) {
      navigator.clipboard.writeText(code)
        .then(() => toast.success('Code copied to clipboard!'))
        .catch(() => toast.error('Failed to copy code.'));
    }
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 p-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300 px-2">Code Editor</h3>
        <div className="flex items-center gap-2">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-gray-400 hover:bg-gray-700 hover:text-white">
            <Copy size={16} />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          value={code}
          onChange={(value) => setCode(value || '')}
          language={language}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditorPanel
