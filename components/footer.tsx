'use client';

import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

export function Footer() {
  const { isCollapsed, hasSidebar } = useSidebar();

  const footerClasses = cn(
    'transition-all duration-300 ease-in-out border-t bg-background py-6 px-4',
    'flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground',
    {
      'md:ml-42': hasSidebar && isCollapsed,
      'md:ml-80': hasSidebar && !isCollapsed,
      'pt-14 md:pt-0': true,
      'mx-auto w-full max-w-7xl': !hasSidebar,
    }
  );

  return (
    <footer className={footerClasses}>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
        <span>2026 todos os direitos reservados imdb</span>
        <span className="hidden md:inline text-muted-foreground/30">|</span>
        <a href="#" className="hover:text-primary transition-colors">
          Política de privacidade
        </a>
        <span className="hidden md:inline text-muted-foreground/30">|</span>
        <a href="#" className="hover:text-primary transition-colors">
          Termos e condições
        </a>
      </div>

      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-primary transition-colors" aria-label="Linkedin">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
          <Facebook className="w-5 h-5" />
        </a>
        <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="#" className="hover:text-primary transition-colors" aria-label="TikTok">
          <TikTokIcon className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.9-.39-2.82-.12-.66.18-1.28.54-1.75 1.02-.74.81-1.05 1.91-.92 3 .15 1.24.94 2.39 2.08 2.88.95.4 2.03.4 2.99.01 1.2-.45 2.04-1.58 2.33-2.85.22-.88.19-1.8.2-2.72.01-5.69 0-11.39.01-17.08z" />
    </svg>
  );
}
