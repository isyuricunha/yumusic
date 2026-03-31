import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Hash, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: 'Company',
      links: ['About', 'Jobs', 'For the Record']
    },
    {
      title: 'Communities',
      links: ['For Artists', 'Developers', 'Advertising', 'Investors', 'Vendors']
    },
    {
      title: 'Useful links',
      links: ['Support', 'Free Mobile App', 'Popular by Country', 'Import your music']
    },
    {
      title: 'Spotify Plans',
      links: ['Premium Individual', 'Premium Duo', 'Premium Family', 'Premium Student', 'Spotify Free']
    }
  ];

  return (
    <footer className="mt-20 pt-16 pb-32 border-t border-white/5 px-4 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col space-y-4">
            <h3 className="font-bold text-base">{section.title}</h3>
            <ul className="flex flex-col space-y-3">
              {section.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-foreground hover:underline text-sm transition-colors cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex space-x-4 lg:justify-end lg:col-span-1">
          <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer">
             <Hash className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer">
             <Share2 className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer">
             <Globe className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-muted-foreground">
        <ul className="flex flex-wrap gap-x-6 gap-y-4 mb-8 md:mb-0">
          <li className="hover:text-foreground cursor-pointer">Legal</li>
          <li className="hover:text-foreground cursor-pointer">Safety & Privacy Center</li>
          <li className="hover:text-foreground cursor-pointer">Privacy Policy</li>
          <li className="hover:text-foreground cursor-pointer">Cookies</li>
          <li className="hover:text-foreground cursor-pointer">About Ads</li>
          <li className="hover:text-foreground cursor-pointer">Accessibility</li>
        </ul>
        <div className="flex flex-col items-end">
           <p className="hover:text-foreground cursor-pointer">© {new Date().getFullYear()} YuMusic AB · {t('common.welcome')}</p>
        </div>
      </div>
    </footer>
  );
};
