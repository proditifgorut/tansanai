import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import FileTree from './FileTree'
import ChatPanel from './ChatPanel'
import CodeEditorPanel from './CodeEditorPanel'
import { BuilderProvider } from '../context/BuilderContext'

const BuilderLayout: React.FC = () => {
  return (
    <BuilderProvider>
      <div className="h-screen bg-gray-900">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - File Tree */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <FileTree />
          </Panel>
          
          <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
          
          {/* Center Panel - Chat */}
          <Panel defaultSize={50} minSize={30}>
            <ChatPanel />
          </Panel>
          
          <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
          
          {/* Right Panel - Code Editor */}
          <Panel defaultSize={30} minSize={25}>
            <CodeEditorPanel />
          </Panel>
        </PanelGroup>
      </div>
    </BuilderProvider>
  )
}

export default BuilderLayout
