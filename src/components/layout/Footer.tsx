import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Music, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: 'YuMusic',
      links: [
        { label: 'Project GitHub', url: 'https://github.com/isyuricunha/yumusic' },
        { label: t('common.about'), url: '#' },
      ]
    },
    {
      title: 'Communities',
      links: [
        { label: 'Subsonic API', url: 'http://www.subsonic.org/pages/api.jsp' },
        { label: 'Navidrome', url: 'https://www.navidrome.org/' },
      ]
    },
    {
      title: 'Useful links',
      links: [
        { label: 'Support', url: '#' },
        { label: t('settings.appearance'), url: '/settings' },
      ]
    },
  ];

  return (
    <footer className="mt-20 pt-16 pb-32 border-t border-white/5 px-4 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider">{section.title}</h3>
            <ul className="flex flex-col space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.url} 
                    target={link.url.startsWith('http') ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex space-x-4 lg:justify-end lg:col-span-2">
          <a 
            href="https://github.com/isyuricunha/yumusic" 
            target="_blank" 
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
             <ExternalLink className="h-5 w-5" />
          </a>
          <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95">
             <Music className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95">
             <Heart className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[11px] font-medium text-muted-foreground">
        <ul className="flex flex-wrap gap-x-6 gap-y-4 mb-8 md:mb-0">
          <li className="hover:text-foreground cursor-pointer transition-colors">Documentation</li>
          <li className="hover:text-foreground cursor-pointer transition-colors">Privacy</li>
          <li className="hover:text-foreground cursor-pointer transition-colors">Accessibility</li>
        </ul>
        <div className="flex flex-col items-end opacity-60">
           <p>© {new Date().getFullYear()} YuMusic • Built with ❤️ for Music Collectors</p>
        </div>
      </div>
    </footer>
  );
};
