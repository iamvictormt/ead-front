'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { UserDropdown } from '@/components/user-dropdown';
import { CourseCard } from '@/components/course-card';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomCard } from '@/components/ui/custom-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Search, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useCourses, useMyCourses } from '@/hooks/use-courses';

interface DashboardClientProps {
  user: {
    id?: number;
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData();
  const { courses, loading: coursesLoading } = useCourses();
  const { myCourses, loading: myCoursesLoading } = useMyCourses();

  // Loading state
  if (dashboardLoading || coursesLoading || myCoursesLoading) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 bg-card border-b border-[#85E8EA]/20 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <UserDropdown user={user} />
                </div>
              </div>
            </header>

            <div className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-[#85E8EA] border-t-transparent rounded-full animate-spin" />
                  <span className="text-lg text-muted-foreground">Carregando dados...</span>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 bg-card border-b border-[#85E8EA]/20 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Erro ao carregar</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <UserDropdown user={user} />
                </div>
              </div>
            </header>

            <div className="p-6">
              <CustomCard className="p-8 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar dados</h3>
                <p className="text-muted-foreground mb-4">{dashboardError}</p>
                <CustomButton onClick={() => window.location.reload()}>Tentar Novamente</CustomButton>
              </CustomCard>
            </div>
          </div>
        </SidebarInset>
      </>
    );
  }

  // Dados das estatísticas (com fallback para valores padrão)
  const stats = dashboardData?.stats || {
    completedCourses: 0,
    studyHours: 0,
    certificates: 0,
  };

  const statsCards = [
    { label: 'Cursos Concluídos', value: stats.completedCourses.toString(), icon: Award, color: 'text-green-600' },
    { label: 'Horas Estudadas', value: `${stats.studyHours}h`, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Certificados', value: stats.certificates.toString(), icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Fixed Header */}
          <header className="sticky top-0 z-50 bg-card border-b border-[#85E8EA]/20 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <SidebarTrigger />
              </div>

              <div className="flex items-center gap-4">
                <UserDropdown user={user} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl mb-8">
              {/* Background with improved gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#85E8EA] via-[#6BC5E8] to-[#4FB3D9]"></div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>

              {/* Content */}
              <div className="relative z-10 p-8 lg:p-12">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    CURSO ONLINE
                  </div>

                  <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                    Olá, {user.name.split(' ')[0]}!<br />
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Continue Aprendendo
                    </span>
                  </h1>

                  <p className="text-white/90 mb-8 text-lg lg:text-xl leading-relaxed max-w-xl">
                    Continue sua jornada de aprendizado e conquiste novos conhecimentos com nossos cursos premium
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <CustomButton
                      size="lg"
                      className="bg-white text-[#85E8EA] hover:bg-gray-50 hover:text-[#6BC5E8] font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
                    >
                      Continuar Estudando
                      <ChevronRight className="w-6 h-6 ml-2" />
                    </CustomButton>

                    <CustomButton
                      variant="outline"
                      size="lg"
                      className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-lg px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
                    >
                      Explorar Cursos
                    </CustomButton>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{myCourses.length}+</div>
                      <div className="text-white/80 text-sm">Cursos Ativos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{stats.studyHours}h+</div>
                      <div className="text-white/80 text-sm">Horas Estudadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{stats.certificates}</div>
                      <div className="text-white/80 text-sm">Certificados</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <CustomCard key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-[#85E8EA] to-[#A8F0F2] flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                </CustomCard>
              ))}
            </div>

            {/* Progress Cards - Meus Cursos */}
            {myCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {myCourses.slice(0, 3).map((course, index) => (
                  <CustomCard key={course.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.completedLessons}/{course.totalLessons} aulas
                        </p>
                      </div>
                      <ProgressRing progress={course.progress || 0} size={60} />
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="progress-bar h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </CustomCard>
                ))}
              </div>
            )}

            {/* Continue Watching */}
            {myCourses.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Continue Assistindo</h2>
                  <div className="flex gap-3">
                    <CustomButton variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </CustomButton>
                    <CustomButton variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </CustomButton>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.slice(0, 6).map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      instructor={course.instructor}
                      instructorAvatar={course.instructorAvatar || '/placeholder.svg?height=32&width=32'}
                      thumbnail={course.thumbnail || '/placeholder.svg?height=200&width=300'}
                      category={course.category}
                      progress={course.completedLessons}
                      duration={course.duration}
                      students={course.students}
                      rating={course.rating}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Courses Section */}
            {courses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Explore Novos Cursos</h2>
                  <CustomButton variant="outline">Ver Todos</CustomButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {courses.slice(0, 4).map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      instructor={course.instructor}
                      instructorAvatar={course.instructorAvatar || '/placeholder.svg?height=32&width=32'}
                      thumbnail={course.thumbnail || '/placeholder.svg?height=200&width=300'}
                      category={course.category}
                      duration={course.duration}
                      students={course.students}
                      rating={course.rating}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {myCourses.length === 0 && courses.length === 0 && (
              <CustomCard className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-[#85E8EA] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Nenhum curso encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Comece sua jornada de aprendizado explorando nossos cursos disponíveis
                </p>
                <CustomButton>Explorar Cursos</CustomButton>
              </CustomCard>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
