import { AdminSidebar } from "@/components/admin-sidebar"
import { UserDropdown } from "@/components/user-dropdown"
import { CustomCard } from "@/components/ui/custom-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Users, BookOpen, DollarSign, TrendingUp, Eye, Play, Award, Clock } from 'lucide-react'

const stats = [
  { label: "Total de Alunos", value: "2,847", icon: Users, change: "+12%", color: "text-blue-600" },
  { label: "Cursos Ativos", value: "24", icon: BookOpen, change: "+3", color: "text-green-600" },
  { label: "Receita Mensal", value: "R$ 45.2k", icon: DollarSign, change: "+18%", color: "text-purple-600" },
  { label: "Taxa de Conclusão", value: "78%", icon: Award, change: "+5%", color: "text-orange-600" },
]

const recentActivity = [
  {
    type: "new_student",
    message: "Novo aluno matriculado em React Avançado",
    user: "Maria Silva",
    time: "2 min atrás",
    avatar: "/placeholder.svg?height=32&width=32"
  },
  {
    type: "course_completed",
    message: "Curso Node.js concluído",
    user: "João Santos",
    time: "15 min atrás",
    avatar: "/placeholder.svg?height=32&width=32"
  },
  {
    type: "new_course",
    message: "Novo curso Python publicado",
    user: "Admin",
    time: "1 hora atrás",
    avatar: "/placeholder.svg?height=32&width=32"
  }
]

const topCourses = [
  {
    title: "React Avançado",
    students: 1234,
    revenue: "R$ 24.680",
    completion: 85,
    thumbnail: "/placeholder.svg?height=60&width=60"
  },
  {
    title: "Node.js Backend",
    students: 987,
    revenue: "R$ 19.740",
    completion: 78,
    thumbnail: "/placeholder.svg?height=60&width=60"
  },
  {
    title: "Design System",
    students: 756,
    revenue: "R$ 15.120",
    completion: 92,
    thumbnail: "/placeholder.svg?height=60&width=60"
  }
]

// Mock admin user data
const mockAdminUser = {
  name: "Admin User",
  email: "admin@email.com",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "admin"
}

export default function AdminDashboard() {
  return (
    <>
      <AdminSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background"> {/* Mudança aqui - usar bg-background */}
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b border-[#85E8EA]/20 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
                  <p className="text-muted-foreground">Visão geral da plataforma</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <UserDropdown user={mockAdminUser} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <CustomCard key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-[#85E8EA] to-[#A8F0F2] flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                </CustomCard>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Activity */}
              <CustomCard className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Atividade Recente</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-[#85E8EA] text-gray-900 text-sm">
                          {activity.user[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CustomCard>

              {/* Top Courses */}
              <CustomCard className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Cursos Mais Populares</h3>
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <img 
                        src={course.thumbnail || "/placeholder.svg"} 
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{course.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {course.revenue}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{course.completion}%</p>
                        <p className="text-xs text-gray-500">conclusão</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CustomCard>
            </div>

            {/* Quick Actions */}
            <CustomCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <a 
                  href="/admin/courses/create"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#85E8EA] rounded-xl hover:bg-[#85E8EA]/5 transition-colors group"
                >
                  <BookOpen className="w-8 h-8 text-[#85E8EA] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">Criar Curso</span>
                </a>
                
                <a 
                  href="/admin/users"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#85E8EA] rounded-xl hover:bg-[#85E8EA]/5 transition-colors group"
                >
                  <Users className="w-8 h-8 text-[#85E8EA] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">Gerenciar Usuários</span>
                </a>
                
                <a 
                  href="/admin/certificates"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#85E8EA] rounded-xl hover:bg-[#85E8EA]/5 transition-colors group"
                >
                  <Award className="w-8 h-8 text-[#85E8EA] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">Certificados</span>
                </a>
                
                <a 
                  href="/admin/stats"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#85E8EA] rounded-xl hover:bg-[#85E8EA]/5 transition-colors group"
                >
                  <TrendingUp className="w-8 h-8 text-[#85E8EA] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">Relatórios</span>
                </a>
              </div>
            </CustomCard>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
