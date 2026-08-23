'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Smartphone, Code, Zap } from 'lucide-react';

export default function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const workspaces = [
    { name: 'Tester', href: '/tester/dashboard', icon: Smartphone, currentPath: '/tester' },
    { name: 'Developer', href: '/customer/dashboard', icon: Code, currentPath: '/customer' },
    { name: 'Partner', href: '/earner/dashboard', icon: Zap, currentPath: '/earner' },
  ];

  const currentWorkspace = workspaces.find(w => pathname.startsWith(w.currentPath)) || workspaces[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors border border-zinc-200"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white border border-zinc-200 flex items-center justify-center">
            <currentWorkspace.icon className="w-3.5 h-3.5 text-zinc-700" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-zinc-900 leading-tight">{currentWorkspace.name} Mode</p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-1.5">
            <p className="px-2 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Switch Workspace</p>
            {workspaces.map(ws => (
              <Link 
                key={ws.name}
                href={ws.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentWorkspace.name === ws.name 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <ws.icon className={`w-4 h-4 ${currentWorkspace.name === ws.name ? 'text-blue-600' : 'text-zinc-500'}`} />
                {ws.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
