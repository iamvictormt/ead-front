'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CustomButton } from '@/components/ui/custom-button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown, Palette } from 'lucide-react';
import { clientLogout } from '@/lib/auth';

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Fazer logout via API
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        // Usar função de logout do cliente
        clientLogout();
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Em caso de erro, fazer logout local mesmo assim
      clientLogout();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Estudante';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <CustomButton variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-[#85E8EA]/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
          </div>
          <Avatar className="w-10 h-10 ring-2 ring-[#85E8EA]/30">
            <AvatarImage src={user.avatar || '/placeholder.svg?height=40&width=40'} />
            <AvatarFallback className="bg-[#85E8EA] text-gray-900 font-semibold text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </CustomButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{getRoleLabel(user.role)}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            <span>Meu Perfil</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>Tema</span>
            </div>
            <ThemeToggle />
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
