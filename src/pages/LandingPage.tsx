import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Tooltip } from '../components/ui/tooltip';
import { TemplatesModal } from '../components/TemplatesModal';
import { useSettings } from '../hooks/useSettings';
import { Infinity, Settings, LogOut, Github, Zap, ArrowRight, ChevronDown, Code, Wind, Bot, Ghost, LayoutGrid, BookText, Workflow, LayoutTemplate, Code2, Image, GitBranch, FileText, X } from 'lucide-react';

const frameworks = [
  { id: 'react-tailwind', name: 'React + Tailwind', icon: <Wind size={16} className="text-cyan-400" /> },
  { id: 'react-chakra', name: 'React + Chakra', icon: <Bot size={16} className="text-teal-400" /> },
  { id: 'react-shadcn', name: 'React + Shadcn', icon: <Bot size={16} className="text-slate-400" /> },
  { id: 'angular-css', name: 'Angular + CSS', icon: <Code size={16} className="text-red-500" /> },
  { id: 'html-css', name: 'HTML + CSS', icon: <Code size={16} className="text-orange-500" /> },
  { id: 'html-tailwind', name: 'HTML + Tailwind', icon: <Code size={16} className="text-cyan-500" /> },
];

const languages = [
  { id: 'ts', name: 'TypeScript', icon: <span className="text-xs font-bold bg-blue-600 text-white rounded-sm px-1 py-0.5">TS</span> },
  { id: 'js', name: 'JavaScript', icon: <span className="text-xs font-bold bg-yellow-500 text-black rounded-sm px-1 py-0.5">JS</span> },
];

const examplePrompts = [
    { text: 'Pac Man Game', icon: <Ghost size={16} /> },
    { text: 'Project Mgmt App', icon: <LayoutGrid size={16} /> },
    { text: 'Notion Alternative', icon: <BookText size={16} /> },
    { text: 'Flow-chart Generator', icon: <Workflow size={16} /> },
    { text: 'Landing Page', icon: <LayoutTemplate size={16} /> },
    { text: 'Mobile Application', icon: <Code2 size={16} /> },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { clearSettings } = useSettings();
  const [prompt, setPrompt] = useState('');
  const [selectedFramework, setSelectedFramework] = useState(frameworks[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isTemplatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt before generating.");
      return;
    }
    const fullPrompt = `Generate a ${selectedFramework.name} component in ${selectedLanguage.name}. ${prompt}`;
    const query = new URLSearchParams({
      prompt: fullPrompt,
    }).toString();
    navigate(`/builder?${query}`);
  };

  const handleLogout = () => {
    clearSettings();
    toast.success("You have been logged out.");
  };

  const handleSupport = () => {
    window.location.href = "mailto:support@tansan.ai";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        toast.success("Image added to context.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileContent = reader.result as string;
        setPrompt(prev => `${prev}\n\n---\n\nAttached file: \`${file.name}\`\n\`\`\`\n${fileContent}\n\`\`\``);
        toast.success(`File "${file.name}" added to prompt.`);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <TemplatesModal 
        isOpen={isTemplatesModalOpen} 
        onClose={() => setTemplatesModalOpen(false)}
        onSelectTemplate={(templatePrompt) => {
          setPrompt(templatePrompt);
          setTemplatesModalOpen(false);
        }}
      />
      <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=2072&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />

        <div className="relative h-full w-full flex flex-col z-20">
          <header className="px-6 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                <Infinity size={32} />
              </div>
              <div className="flex items-center gap-2">
                <Tooltip content="Coming Soon!">
                  <Button variant="ghost">Upgrade to Pro</Button>
                </Tooltip>
                <Button variant="ghost" onClick={handleSupport}>Support</Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} aria-label="Settings">
                  <Settings size={20} />
                </Button>
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2"/>
                  Logout
                </Button>
              </div>
            </nav>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-7xl md:text-8xl font-black tracking-wider mb-4 uppercase">Tansan AI</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12">Build at the speed of thought.</p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 block mb-2 text-left">Framework</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-56 justify-between bg-black/50 border-gray-700 hover:bg-black/70 hover:border-gray-500">
                      <span className="flex items-center gap-2">
                        {selectedFramework.icon}
                        {selectedFramework.name}
                      </span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700">
                    {frameworks.map((fw) => (
                      <DropdownMenuItem key={fw.id} onClick={() => setSelectedFramework(fw)} className="text-gray-300 focus:bg-gray-800">
                        <span className="flex items-center gap-2">
                          {fw.icon}
                          {fw.name}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2 text-left">Language</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-48 justify-between bg-black/50 border-gray-700 hover:bg-black/70 hover:border-gray-500">
                      <span className="flex items-center gap-2">
                        {selectedLanguage.icon}
                        {selectedLanguage.name}
                      </span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-gray-900 border-gray-700">
                    {languages.map((lang) => (
                      <DropdownMenuItem key={lang.id} onClick={() => setSelectedLanguage(lang)} className="text-gray-300 focus:bg-gray-800">
                        <span className="flex items-center gap-2">
                          {lang.icon}
                          {lang.name}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="relative w-full max-w-2xl">
              <TextareaAutosize
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Start typing or choose an example..."
                className="w-full bg-black/50 border-gray-700 rounded-lg p-4 pr-12 pb-12 text-base resize-none focus:border-blue-500"
                minRows={3}
                maxRows={10}
              />
              {imagePreview && (
                <div className="absolute top-3 left-3">
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md"/>
                    <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-0.5">
                      <X size={12}/>
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.js,.ts,.html,.css,.md" className="hidden" />
                  
                  <Tooltip content="Upload Image">
                      <Button onClick={() => imageInputRef.current?.click()} variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" aria-label="Upload Image">
                        <Image size={20} />
                      </Button>
                  </Tooltip>
                  <Tooltip content="Use Template">
                      <Button onClick={() => setTemplatesModalOpen(true)} variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" aria-label="Use Template">
                        <LayoutTemplate size={20} />
                      </Button>
                  </Tooltip>
                  <Tooltip content="Add Code/Document">
                      <Button onClick={() => fileInputRef.current?.click()} variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" aria-label="Add Code">
                        <FileText size={20} />
                      </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                   <Tooltip content="Quick Prompt (Coming Soon)">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" aria-label="Quick Prompt">
                        <Zap size={20} />
                      </Button>
                  </Tooltip>
                  <Button size="icon" className="bg-blue-600 hover:bg-blue-700" onClick={handleGenerate} aria-label="Generate">
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </main>

          <footer className="px-6 py-4 flex flex-col items-center gap-4">
            <div className="text-gray-500 text-sm">OR</div>
            <Button variant="outline" className="bg-black/30 border-gray-700 hover:bg-black/50 hover:border-gray-500 text-gray-300" onClick={() => navigate('/import/github')}>
              <Github size={16} className="mr-2" />
              Import from Github
            </Button>

            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
              {examplePrompts.map((p) => (
                <Button
                  key={p.text}
                  variant="outline"
                  className="w-full bg-black/30 border-gray-700 hover:bg-black/50 hover:border-gray-500 justify-start rounded-full text-gray-300"
                  onClick={() => setPrompt(p.text)}
                >
                  <span className="flex items-center gap-2">
                    {p.icon}
                    {p.text}
                  </span>
                </Button>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
