import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tooltip } from '../components/ui/tooltip';
import { ArrowLeft, Github } from 'lucide-react';

const GithubImport: React.FC = () => {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="text-center">
          <Github size={48} className="mx-auto mb-4 text-gray-500" />
          <h1 className="text-3xl font-bold mb-2">Import from GitHub</h1>
          <p className="text-gray-400 mb-8">Enter a public repository URL to get started.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Repository URL</label>
            <Input
              type="text"
              name="repoUrl"
              placeholder="https://github.com/user/repository"
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <Tooltip content="Full repository import is coming soon!">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Import Repository
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default GithubImport;
