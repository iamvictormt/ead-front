'use client';

import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Home,
  Users,
  GraduationCap,
  Play,
  FileText,
  Award,
  Upload,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { clientLogout } from '@/lib/auth';

const dashboardItems = [
  { title: 'Dashboard', url: '/admin', icon: Home },
  { title: 'Estatísticas', url: '/admin/stats', icon: BarChart3 },
];

const courseItems = [
  { title: 'Gerenciar Cursos', url: '/admin/courses', icon: BookOpen },
  { title: 'Criar Curso', url: '/admin/courses/create', icon: PlusCircle },
  { title: 'Upload de Vídeos', url: '/admin/videos', icon: Upload },
  { title: 'Materiais PDF', url: '/admin/materials', icon: FileText },
];

const userItems = [
  { title: 'Usuários', url: '/admin/users', icon: Users },
  { title: 'Certificados', url: '/admin/certificates', icon: Award },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(url);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        clientLogout();
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      clientLogout();
    }
  };

  const renderMenuItems = (items: typeof dashboardItems) => {
    return items.map((item) => {
      const active = isActive(item.url);
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={active}
            tooltip={item.title}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              active
                ? 'bg-[#85E8EA]/15 text-[#85E8EA] border-r-2 border-[#85E8EA] font-semibold shadow-sm'
                : 'text-foreground hover:bg-[#85E8EA]/10 hover:text-[#85E8EA]'
            }`}
          >
            <a href={item.url}>
              <item.icon
                className={`w-5 h-5 transition-transform flex-shrink-0 ${
                  active ? 'scale-110 text-[#85E8EA]' : 'group-hover:scale-110'
                }`}
              />
              <span className={`font-medium group-data-[collapsible=icon]:sr-only ${active ? 'text-[#85E8EA]' : ''}`}>
                {item.title}
              </span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-[#85E8EA]/20 bg-card">
      <SidebarHeader className="p-6 border-b border-[#85E8EA]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-gray-900" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#85E8EA] to-[#6BC5E8] bg-clip-text text-transparent">
              COURSUE
            </span>
            <p className="text-xs text-muted-foreground font-medium">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-[#85E8EA] uppercase tracking-wider mb-4">
            DASHBOARD
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">{renderMenuItems(dashboardItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-6 bg-[#85E8EA]/20" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-[#85E8EA] uppercase tracking-wider mb-4">
            CURSOS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">{renderMenuItems(courseItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-6 bg-[#85E8EA]/20" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-[#85E8EA] uppercase tracking-wider mb-4">
            USUÁRIOS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">{renderMenuItems(userItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-[#85E8EA]/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Sair"
              className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl w-full transition-all duration-200 group"
            >
              <button onClick={handleLogout}>
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-medium group-data-[collapsible=icon]:sr-only">Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
