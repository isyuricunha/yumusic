import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';

export function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Tauri environment check
  const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;

  useEffect(() => {
    if (!isTauri) return;

    const appWindow = getCurrentWindow();
    
    // Check initial state
    appWindow.isMaximized().then(setIsMaximized);

    // Listen for resize changes
    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [isTauri]);

  if (!isTauri) return null;

  const appWindow = getCurrentWindow();

  return (
    <div className="h-8 select-none flex justify-between items-center fixed top-0 w-full z-50 bg-background border-b border-border/40">
      
      {/* Branding Section (No events to interrupt drag) */}
      <div className="flex items-center pl-4 text-xs font-semibold text-primary/80 tracking-widest pointer-events-none z-10">
        <div className="w-4 h-4 mr-2 text-primary opacity-80 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                 <path d="M9 18V5l12-2v13"></path>
                 <circle cx="6" cy="18" r="3"></circle>
                 <circle cx="18" cy="16" r="3"></circle>
             </svg>
        </div>
        YUMUSIC
      </div>

      {/* Invisible flex-filler that handles the dragging, so it doesn't wrap the buttons */}
      <div data-tauri-drag-region className="flex-1 h-full cursor-default" />

      {/* Window Action Buttons */}
      <div className="flex h-full z-10">
        <button
          className="inline-flex justify-center items-center w-10 h-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => appWindow.minimize()}
          title="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          className="inline-flex justify-center items-center w-10 h-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => appWindow.toggleMaximize()}
          title="Maximize"
        >
          {isMaximized ? (
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[10px] h-[10px]"><path d="M1 9V1H9V9H1Z" stroke="currentColor" strokeWidth="1"/></svg>
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          className="inline-flex justify-center items-center w-10 h-full hover:bg-red-500 hover:text-white text-muted-foreground transition-colors"
          onClick={() => appWindow.close()}
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
