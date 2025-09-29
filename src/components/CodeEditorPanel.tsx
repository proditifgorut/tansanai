import React from 'react'
import Editor from '@monaco-editor/react'
import { useBuilder } from '../context/BuilderContext'

const CodeEditorPanel: React.FC = () => {
  const { code, setCode, language, setLanguage } = useBuilder();

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Code Editor</h3>
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
