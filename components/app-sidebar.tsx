"use client"

import { BookOpen, Home, Inbox, Users, GraduationCap, Play, ShoppingCart } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const overviewItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Meus Cursos", url: "/student/courses", icon: BookOpen },
  { title: "Comprar Cursos", url: "/courses", icon: ShoppingCart },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-[#85E8EA]/20 bg-card">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#85E8EA] group-data-[collapsible=icon]:hidden">
            LOGO
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-[#85E8EA] uppercase tracking-wider mb-4">
            NAVEGAÇÃO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {overviewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={item.title}
                    className="flex items-center gap-4 px-4 py-3 text-foreground hover:bg-[#85E8EA]/10 hover:text-[#85E8EA] rounded-xl transition-all duration-200 group"
                  >
                    <a href={item.url}>
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:sr-only">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
