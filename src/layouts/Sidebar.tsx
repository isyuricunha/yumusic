import { NavLink } from 'react-router';
import { Home, Library, Heart, Radio, Settings, Search, Podcast } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();
  
  const navItems = [
    { label: t('common.home'), icon: Home, to: '/' },
    { label: t('common.search'), icon: Search, to: '/search' },
    { label: t('common.library'), icon: Library, to: '/library' },
    { label: t('common.favorites'), icon: Heart, to: '/favorites' },
    { label: t('common.podcasts'), icon: Podcast, to: '/podcasts' },
    { label: t('common.radio'), icon: Radio, to: '/radio' },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col h-full">
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl leading-none pt-0.5">y</span>
        </div>
        <span className="font-bold text-lg text-sidebar-foreground">Yumusic</span>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1 pb-4">
          <h2 className="px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            {t('sidebar.menu')}
          </h2>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Separator className="my-4" />
        
        <nav className="space-y-1">
          <h2 className="px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            {t('sidebar.playlists')}
          </h2>
          {/* Static list for now, will connect to API later */}
          {['Liked Songs', 'Daily Mix 1', 'Focus'].map(playlist => (
            <div key={playlist} className="px-3 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer transition-colors truncate">
              {playlist}
            </div>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <NavLink 
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )
          }
        >
          <Settings className="h-4 w-4" />
          <span>{t('common.settings')}</span>
        </NavLink>
      </div>
    </div>
  );
}
