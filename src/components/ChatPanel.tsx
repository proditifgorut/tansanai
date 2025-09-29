import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Send, ChevronDown, Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useSettings } from '../hooks/useSettings'
import { getSupabaseClient } from '../lib/supabase'
import { useBuilder } from '../context/BuilderContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'llama-3', name: 'Llama 3' },
]

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { settings, settingsComplete } = useSettings();
  const { setCode, setLanguage } = useBuilder();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    if (initialPrompt) {
      handleInitialPrompt(initialPrompt);
      // Clean up the URL
      searchParams.delete('prompt');
      setSearchParams(searchParams);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const extractCode = (markdown: string) => {
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/;
    const match = markdown.match(codeBlockRegex);
    if (match) {
      const lang = match[1] || 'typescript'; // Default to typescript if no language is specified
      const code = match[2].trim();
      return { lang, code };
    }
    return null;
  };

  const handleInitialPrompt = (initialPrompt: string) => {
    if (!settingsComplete) {
      setMessages([{ role: 'assistant', content: `Please configure your API keys in settings to process the request: "${initialPrompt}"` }]);
      return;
    }
    handleSubmit(null, initialPrompt);
  };

  const handleSubmit = async (e: React.FormEvent | null, initialPrompt?: string) => {
    e?.preventDefault();
    const currentInput = initialPrompt || input;
    if (!currentInput.trim() || isLoading) return;

    if (!settingsComplete) {
      alert("Please configure your Supabase connection in the settings page first.");
      return;
    }

    const userMessage: Message = { role: 'user', content: currentInput }
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!initialPrompt) setInput('');
    setIsLoading(true);

    const supabase = getSupabaseClient(settings.supabaseUrl, settings.supabaseAnonKey);
    if (!supabase) {
      alert("Supabase client could not be initialized. Check your settings.");
      setIsLoading(false);
      return;
    }

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const response = await supabase.functions.invoke('openrouter-stream', {
        body: {
          model: selectedModel.id,
          messages: newMessages,
        },
      });

      if (!response.body) throw new Error("The response body is null.");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponse = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg) lastMsg.content = fullResponse;
          return newMsgs;
        });
      }
      
      const codeBlock = extractCode(fullResponse);
      if (codeBlock) {
        setCode(codeBlock.code);
        setLanguage(codeBlock.lang);
      }

    } catch (error) {
      console.error('Error invoking Supabase function:', error)
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg) lastMsg.content = 'Sorry, there was an error processing your request. Please check the console and ensure your Supabase Edge Function is set up correctly.';
        return newMsgs;
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-100">Tansan AI</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-2">Start a conversation with the AI assistant</p>
            {!settingsComplete && (
              <p className="text-sm text-yellow-400">
                Please <Link to="/settings" className="underline hover:text-yellow-300">configure your API keys</Link> to begin.
              </p>
            )}
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-100'
            }`}>
              {message.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
                {selectedModel.name}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-gray-800 border-gray-600">
              {models.map((model) => (
                <DropdownMenuItem 
                  key={model.id} 
                  onClick={() => setSelectedModel(model)}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {model.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={settingsComplete ? "Type your message..." : "Please configure settings first"}
              className="flex-1 bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400 resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={!settingsComplete || isLoading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading || !settingsComplete}
              className="self-end bg-blue-600 hover:bg-blue-700"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatPanel
