import React, { useState, useMemo, ReactNode } from 'react';
import { 
  Folder, 
  Search, 
  Image as ImageIcon, 
  Box, 
  PenTool, 
  Grid, 
  Heart, 
  X, 
  Menu,
  Sparkles,
  Tag
} from 'lucide-react';

// --- Data & Configuration ---

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
};

type Item = {
  id: number;
  title: string;
  category: Category['id'];
  tags: string[];
  date: string;
  description: string;
  likes: number;
  color: string;
};

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Items', icon: Grid, color: 'text-stone-600' },
  { id: 'blockbench', label: 'Blockbench', icon: Box, color: 'text-amber-600' },
  { id: 'generative', label: 'Gen Art', icon: Sparkles, color: 'text-purple-500' },
  { id: 'drawing', label: 'Drawings', icon: PenTool, color: 'text-rose-500' },
  { id: 'vector', label: 'Logos/Vector', icon: ImageIcon, color: 'text-blue-500' },
];

const SAMPLE_DATA: Item[] = [
  {
    id: 1,
    title: "Low Poly Fox",
    category: "blockbench",
    tags: ["animal", "lowpoly", "nature"],
    date: "2023-10-15",
    description: "A cute low-poly fox model rigged for movement.",
    likes: 124,
    color: "bg-amber-100"
  },
  {
    id: 2,
    title: "Neon Cityscape",
    category: "generative",
    tags: ["cyberpunk", "code", "neon"],
    date: "2023-11-02",
    description: "Algorithmic city generation using p5.js.",
    likes: 89,
    color: "bg-purple-100"
  },
  {
    id: 3,
    title: "Cozy Cabin Sketch",
    category: "drawing",
    tags: ["sketch", "cozy", "winter"],
    date: "2023-12-10",
    description: "Digital charcoal sketch of a winter hideaway.",
    likes: 210,
    color: "bg-rose-100"
  },
  {
    id: 4,
    title: "Guild Emblem",
    category: "vector",
    tags: ["logo", "minimal", "gold"],
    date: "2024-01-05",
    description: "Vector emblem designed for a gaming guild.",
    likes: 45,
    color: "bg-blue-100"
  },
  {
    id: 5,
    title: "Voxel Sword",
    category: "blockbench",
    tags: ["weapon", "fantasy", "voxel"],
    date: "2024-01-20",
    description: "A magical sword made of crystal voxels.",
    likes: 156,
    color: "bg-amber-100"
  },
  {
    id: 6,
    title: "Fractal Trees",
    category: "generative",
    tags: ["nature", "math", "green"],
    date: "2024-02-14",
    description: "Recursive fractal tree patterns.",
    likes: 92,
    color: "bg-green-100"
  },
  {
    id: 7,
    title: "Character Sheet",
    category: "drawing",
    tags: ["rpg", "character", "anime"],
    date: "2024-03-01",
    description: "Full body character reference sheet.",
    likes: 304,
    color: "bg-rose-100"
  },
   {
    id: 8,
    title: "Startup Brand",
    category: "vector",
    tags: ["branding", "modern", "tech"],
    date: "2024-03-10",
    description: "Full identity package for a tech startup.",
    likes: 67,
    color: "bg-blue-100"
  },
];

// --- Components ---

type BadgeProps = {
  children: ReactNode;
  colorClass: string;
};

const Badge = ({ children, colorClass }: BadgeProps) => (
  <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${colorClass} bg-white/50 border border-black/5`}>
    {children}
  </span>
);

type ArtCardProps = {
  item: Item;
  onClick: (item: Item) => void;
};

const ArtCard = ({ item, onClick }: ArtCardProps) => {
  const Icon = CATEGORIES.find(c => c.id === item.category)?.icon || Box;

  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-stone-100 hover:border-stone-300 flex flex-col h-full"
    >
      {/* Image Placeholder */}
      <div className={`w-full aspect-square rounded-xl ${item.color} mb-3 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />
        <Icon size={48} className="text-black/10 group-hover:scale-110 transition-transform duration-500" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-stone-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-stone-800 leading-tight group-hover:text-amber-700 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center text-xs text-rose-400 font-bold bg-rose-50 px-2 py-1 rounded-full">
            <Heart size={10} className="mr-1 fill-current" />
            {item.likes}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-[10px] text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

type ModalProps = {
  item: Item | null;
  onClose: () => void;
};

const Modal = ({ item, onClose }: ModalProps) => {
  if (!item) return null;
  const CategoryIcon = CATEGORIES.find(c => c.id === item.category)?.icon || Box;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fcfbf7] w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-white overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Image Section */}
        <div className={`md:w-1/2 ${item.color} flex items-center justify-center p-12 relative`}>
           <CategoryIcon size={96} className="text-black/10" />
           <button 
             onClick={onClose}
             className="absolute top-4 left-4 md:hidden bg-white/80 p-2 rounded-full shadow-sm hover:bg-white"
           >
             <X size={20} />
           </button>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start">
            <Badge colorClass="text-stone-500">
              {CATEGORIES.find(c => c.id === item.category)?.label}
            </Badge>
            <button 
              onClick={onClose}
              className="hidden md:block hover:bg-stone-100 p-2 rounded-full transition-colors text-stone-400 hover:text-stone-600"
            >
              <X size={24} />
            </button>
          </div>

          <h2 className="text-3xl font-black text-stone-800 mt-4 mb-2 font-display">
            {item.title}
          </h2>
          
          <div className="text-stone-400 text-sm mb-6 flex items-center gap-2">
            <span>{item.date}</span>
            <span>•</span>
            <span className="flex items-center text-rose-400 font-bold">
               <Heart size={14} className="mr-1 fill-current" /> {item.likes}
            </span>
          </div>

          <p className="text-stone-600 leading-relaxed mb-6">
            {item.description}
          </p>

          <div className="mt-auto">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: string) => (
                <div key={tag} className="flex items-center px-3 py-1.5 bg-stone-100 rounded-lg text-sm text-stone-600 border border-stone-200">
                  <Tag size={12} className="mr-2 opacity-50" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type SidebarItemProps = {
  category: Category;
  isActive: boolean;
  onClick: (id: Category['id']) => void;
};

const SidebarItem = ({ category, isActive, onClick }: SidebarItemProps) => {
  const Icon = category.icon;
  return (
    <button
      onClick={() => onClick(category.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2 font-bold
        ${isActive 
          ? 'bg-white text-stone-800 shadow-md translate-x-1 border-2 border-stone-100' 
          : 'text-stone-500 hover:bg-stone-200/50 hover:text-stone-700 border-2 border-transparent'
        }`}
    >
      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-stone-100' : 'bg-transparent'}`}>
        <Icon size={20} className={isActive ? category.color : 'currentColor'} />
      </div>
      <span className="text-sm md:text-base">{category.label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
    </button>
  );
};

// --- Main App ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category['id']>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return SAMPLE_DATA.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchLower) || 
        item.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F2F0E9] text-stone-800 font-sans selection:bg-amber-200">
      
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-20 bg-[#F2F0E9]/90 backdrop-blur-md border-b border-stone-200 p-4 flex justify-between items-center">
        <div className="font-black text-xl tracking-tight text-stone-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-white shadow-sm border-b-4 border-amber-600">
            <Box size={20} />
          </div>
          Portfolio
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg shadow-sm border border-stone-200">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen">
        
        {/* Sidebar Navigation */}
        <aside className={`
          fixed md:sticky md:top-0 z-10 w-full md:w-64 h-[calc(100vh-65px)] md:h-screen bg-[#F2F0E9] border-r border-stone-200 md:border-none p-6 flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Desktop Logo */}
          <div className="hidden md:flex items-center gap-3 mb-10 px-2 mt-4">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-sm border-b-4 border-amber-600 transform hover:scale-105 transition-transform">
              <Box size={24} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-stone-700 leading-none">Art Portfolio</h1>
              <p className="text-xs text-stone-400 font-bold mt-1">Creative Showcase</p>
            </div>
          </div>

          <div className="space-y-1 overflow-y-auto flex-1 pb-8">
            <div className="px-4 mb-2 text-xs font-bold text-stone-400 uppercase tracking-widest">Library</div>
            {CATEGORIES.map(cat => (
              <SidebarItem 
                key={cat.id} 
                category={cat} 
                isActive={activeCategory === cat.id} 
                onClick={(id: Category['id']) => {
                  setActiveCategory(id);
                  setIsSidebarOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto px-4 py-6 border-t border-stone-200/50">
             <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
                <p className="text-xs text-stone-500 font-medium mb-2">Need a commission?</p>
                <button className="w-full py-2 bg-stone-800 text-white rounded-lg text-sm font-bold hover:bg-stone-700 transition-colors">
                  Contact Me
                </button>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          
          {/* Header & Search */}
          <div className="mb-8 md:mb-12 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-stone-800 tracking-tight mb-2">
                  {CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h2>
                <p className="text-stone-500 font-medium max-w-md">
                    {{
                    all: "Browse through my collection of creative works.",
                    blockbench: "Explore my Blockbench models and voxel creations.",
                    generative: "Discover my generative art and algorithmic pieces.",
                    drawing: "See my digital drawings and sketches.",
                    vector: "View my logo designs and vector graphics."
                    }[activeCategory] || "Browse through my collection of creative works."}
                </p>
              </div>
              
              <div className="relative w-full md:w-80 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-500 transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search tags or titles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-stone-200 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all shadow-sm"
                />
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(searchQuery || activeCategory !== 'all') && (
              <div className="flex gap-2 flex-wrap animate-in fade-in slide-in-from-bottom-2">
                {activeCategory !== 'all' && (
                  <button 
                    onClick={() => setActiveCategory('all')}
                    className="flex items-center text-xs font-bold bg-stone-800 text-white px-3 py-1.5 rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    Category: {CATEGORIES.find(c => c.id === activeCategory)?.label}
                    <X size={12} className="ml-2" />
                  </button>
                )}
                {searchQuery && (
                   <button 
                   onClick={() => setSearchQuery('')}
                   className="flex items-center text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                 >
                   Search: "{searchQuery}"
                   <X size={12} className="ml-2" />
                 </button>
                )}
              </div>
            )}
          </div>

          {/* Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
              {filteredItems.map(item => (
                <ArtCard 
                  key={item.id} 
                  item={item} 
                  onClick={setSelectedItem} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 border-2 border-dashed border-stone-200 rounded-3xl">
              <Folder size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-lg">No artifacts found.</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setActiveCategory('all'); setSearchQuery('');}}
                className="mt-6 text-amber-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal / Lightbox */}
      {selectedItem && (
        <Modal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}