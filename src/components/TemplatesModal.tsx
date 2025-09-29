import React from 'react';
import { Button } from './ui/button';
import { X, FileCode, ShoppingCart, BarChart } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string) => void;
}

const templates = [
  {
    name: 'Portfolio Website',
    prompt: 'Create a modern, responsive personal portfolio website. It should have a hero section with my name and title, an "About Me" section, a "Projects" section with cards for 3 projects, and a "Contact Me" form.',
    icon: <FileCode size={24} />,
  },
  {
    name: 'E-commerce Product Page',
    prompt: 'Build a detailed product page for an e-commerce site. It needs a large product image gallery with thumbnails, product title, price, color/size variants, an "Add to Cart" button, and a section for product description and specifications.',
    icon: <ShoppingCart size={24} />,
  },
  {
    name: 'Analytics Dashboard',
    prompt: 'Design the main layout for an analytics dashboard. It should include a sidebar for navigation, a header with a date range picker, and a main content area with several data visualization cards for key metrics like "Users," "Revenue," and "Conversion Rate."',
    icon: <BarChart size={24} />,
  },
];

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Select a Template</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(template => (
            <div 
              key={template.name}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer flex flex-col items-center text-center gap-3"
              onClick={() => onSelectTemplate(template.prompt)}
            >
              <div className="text-blue-400">{template.icon}</div>
              <h3 className="font-semibold">{template.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
