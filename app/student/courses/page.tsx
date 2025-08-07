import { AppSidebar } from "@/components/app-sidebar"
import { UserDropdown } from "@/components/user-dropdown"
import { CourseProgress } from "@/components/course-progress"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomCard } from "@/components/ui/custom-card"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Search, BookOpen, Award, Clock, Filter } from 'lucide-react'
import { mockCourses, mockUserProgress } from '@/lib/courses'

// Mock user data - in real app, get from session
const mockUser = {
  name: "Victor Torres",
  email: "user@email.com",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "student"
}

export default function StudentCoursesPage() {
  // Mock user data - in real app, get from session
  const userId = 2
  const userProgress = mockUserProgress.filter(p => p.userId === userId)
  const purchasedCourses = mockCourses.filter(course => 
    userProgress.some(p => p.courseId === course.id)
  )

  const totalCourses = purchasedCourses.length
  const completedCourses = userProgress.filter(p => p.progress === 100).length
  const totalHours = purchasedCourses.reduce((acc, course) => {
    const hours = parseFloat(course.duration.split('h')[0])
    return acc + hours
  }, 0)

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background"> {/* Mudança aqui - usar bg-background */}
          {/* Fixed Header */}
          <header className="sticky top-0 z-50 bg-white border-b border-[#85E8EA]/20 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Meus Cursos</h1>
                  <p className="text-sm text-muted-foreground">Gerencie seu progresso de aprendizado</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative max-w-md">
                  <Input 
                    placeholder="Buscar nos meus cursos..." 
                    className="pl-10 bg-[#EFFFFF] border-[#85E8EA]/30 focus:border-[#85E8EA] focus:ring-[#85E8EA]/20 rounded-xl h-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#85E8EA]" />
                </div>
                
                <CustomButton variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </CustomButton>
                
                <UserDropdown user={mockUser} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <CustomCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cursos Ativos</p>
                    <p className="text-2xl font-bold text-foreground">{totalCourses}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#85E8EA] to-[#A8F0F2] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gray-900" />
                  </div>
                </div>
              </CustomCard>

              <CustomCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Concluídos</p>
                    <p className="text-2xl font-bold text-foreground">{completedCourses}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CustomCard>

              <CustomCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Horas Estudadas</p>
                    <p className="text-2xl font-bold text-foreground">{totalHours.toFixed(0)}h</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CustomCard>

              <CustomCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Certificados</p>
                    <p className="text-2xl font-bold text-foreground">{completedCourses}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CustomCard>
            </div>

            {/* Course Progress List */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Progresso dos Cursos</h2>
                <CustomButton variant="outline">
                  Ver Certificados
                </CustomButton>
              </div>
              
              <div className="space-y-4">
                {purchasedCourses.map((course) => {
                  const progress = userProgress.find(p => p.courseId === course.id)!
                  return (
                    <div key={course.id} className="group">
                      <CourseProgress course={course} progress={progress} />
                      <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CustomButton size="sm" asChild>
                          <a href={`/student/courses/${course.id}`}>
                            Continuar Assistindo
                          </a>
                        </CustomButton>
                        <CustomButton variant="outline" size="sm">
                          Ver Materiais
                        </CustomButton>
                        {progress.certificateIssued && (
                          <CustomButton variant="outline" size="sm">
                            Baixar Certificado
                          </CustomButton>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <CustomCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomButton variant="outline" className="h-16 flex-col" asChild>
                  <a href="/courses">
                    <BookOpen className="w-6 h-6 mb-2" />
                    Explorar Novos Cursos
                  </a>
                </CustomButton>
                <CustomButton variant="outline" className="h-16 flex-col">
                  <Award className="w-6 h-6 mb-2" />
                  Meus Certificados
                </CustomButton>
                <CustomButton variant="outline" className="h-16 flex-col">
                  <Clock className="w-6 h-6 mb-2" />
                  Configurar Lembretes
                </CustomButton>
              </div>
            </CustomCard>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
