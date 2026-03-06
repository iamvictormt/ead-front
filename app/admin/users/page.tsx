'use client';

import { useState, useEffect } from 'react';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { ProtectedRoute } from '@/components/protected-route';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ErrorMessage } from '@/components/error-message';
import clsx from 'clsx';
import { Search, Gift, Users, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-custom-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: number;
  name: string;
  email: string;
  profilePic: string | null;
  role: string;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

interface Course {
  id: number;
  title: string;
  price: number;
}

export default function ManageStudentsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [usersData, setUsersData] = useState<UsersResponse>({
    users: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const { success, error: showError } = useToast();

  const contentMargin = clsx('transition-all duration-300 ease-in-out flex flex-col min-h-screen', {
    'md:ml-20': isCollapsed,
    'md:ml-64': !isCollapsed,
    'pt-14 md:pt-0': true,
  });

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, selectedCourseFilter]);

  useEffect(() => {
    loadAllCourses();
  }, []);

  useEffect(() => {
    if (selectedUser) loadAvailableCourses();
  }, [selectedUser]);

  const loadAllCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const result = await response.json();
      if (result.success) {
        setAllCourses(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar todos os cursos:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const courseParam = selectedCourseFilter !== 'all' ? `&courseId=${selectedCourseFilter}` : '';
      const response = await fetch(`/api/users?page=${currentPage}&limit=20&search=${encodeURIComponent(searchTerm)}${courseParam}`);
      const result = await response.json();

      if (result.success) {
        setUsersData(result.data);
      } else {
        setError(result.error || 'Erro ao carregar alunos');
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setError('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedCourseFilter('all');
    setCurrentPage(1);
  };

  const loadAvailableCourses = async () => {
    if (selectedUser === null) return;
    try {
      // Usando o endpoint de cursos mas filtrando os que o usuário já tem se necessário
      // Por enquanto vamos usar todos os cursos como mock
      const response = await fetch('/api/courses');
      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const handleEnrollUser = async () => {
    if (!selectedUser || !selectedCourse) return;

    try {
      setIsEnrolling(true);
      // Aqui chamaria o endpoint de matrícula
      // const response = await apiService.enrollCourseStudent(selectedUser.id, Number.parseInt(selectedCourse));
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, courseId: Number.parseInt(selectedCourse) })
      });
      const result = await response.json();

      if (result.success) {
        setShowEnrollDialog(false);
        setSelectedUser(null);
        setSelectedCourse('');
        loadUsers();
        success('Curso vinculado ao aluno com sucesso!');
      } else {
        showError(result.error || 'Erro ao vincular usuário ao curso');
      }
    } catch (error) {
      console.error('Erro ao vincular usuário ao curso:', error);
      showError('Erro ao vincular usuário ao curso');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const courseParam = selectedCourseFilter !== 'all' ? `&courseId=${selectedCourseFilter}` : '';
      const response = await fetch(`/api/users?page=1&limit=1000&search=${encodeURIComponent(searchTerm)}${courseParam}`);
      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Lista de Alunos', 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 30);

      const tableRows = result.data.users.map((user: User) => [
        user.name,
        user.email,
        format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: ptBR }),
        user.role
      ]);

      autoTable(doc, {
        head: [['Nome', 'Email', 'Cadastrado em', 'Role']],
        body: tableRows,
        startY: 40,
      });

      doc.save(`lista_alunos_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
      success("Lista de alunos baixada com sucesso!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError("Erro ao gerar PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="destructive">Admin</Badge>;
      case 'STUDENT':
        return <Badge variant="secondary">Aluno</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const hasActiveFilters = searchTerm !== '' || selectedCourseFilter !== 'all';

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CollapsibleSidebar onToggle={setIsCollapsed} />

        <div className={contentMargin}>
          <header className="hidden md:inline md:px-6 top-0 md:top-4 sticky md:relative z-40 mb-6 md:mb-8">
            <div className="bg-white md:dark:bg-gray-800 md:rounded-xl shadow-sm dark:shadow-gray-700/20 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    Gerenciar Alunos
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm border-gray-200 dark:text-white">
                    {usersData.total} alunos
                  </Badge>
                  <Badge variant="secondary" className="text-sm dark:bg-gray-700 dark:text-white">
                    Página {usersData.page} de {usersData.totalPages}
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="px-4 md:px-6 py-4 md:py-6">
              <div className="mx-auto space-y-6">
                {error && <ErrorMessage message={error} />}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700/20 p-4 md:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Pesquisar por nome ou email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <Select value={selectedCourseFilter} onValueChange={setSelectedCourseFilter}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Filtrar por curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os cursos</SelectItem>
                          {allCourses.map(course => (
                            <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSearch} className="bg-[#DE2535] hover:bg-[#DE2535]/90 text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Pesquisar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadPDF}
                      disabled={downloading}
                      className="border-[#85E8EA] text-[#85E8EA] hover:bg-[#85E8EA]/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloading ? "Baixando..." : "Baixar Lista"}
                    </Button>
                  </div>

                  {hasActiveFilters && (
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        <X className="w-4 h-4 mr-2" /> Limpar Filtros
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold dark:text-white">Alunos Cadastrados</h2>
                    <span className="text-sm text-gray-500">Mostrando {usersData.users.length} de {usersData.total} alunos</span>
                  </div>

                  {loading ? (
                    <div className="p-8 flex justify-center"><LoadingSpinner /></div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {usersData.users.map((user) => (
                        <div key={user.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={user.profilePic || undefined} />
                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-sm font-medium dark:text-white">{user.name}</h3>
                                  {getRoleBadge(user.role)}
                                </div>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-400 mt-1">Cadastrado em {formatDate(user.createdAt)}</p>
                              </div>
                            </div>

                            <Dialog open={showEnrollDialog && selectedUser?.id === user.id} onOpenChange={(open) => { setShowEnrollDialog(open); if(!open) setSelectedUser(null); }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                  <Gift className="w-4 h-4 mr-2" /> Vincular Curso
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader><DialogTitle>Vincular Curso a {user.name}</DialogTitle></DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                    <SelectTrigger><SelectValue placeholder="Escolha um curso..." /></SelectTrigger>
                                    <SelectContent>
                                      {allCourses.map(course => (
                                        <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>Cancelar</Button>
                                    <Button onClick={handleEnrollUser} disabled={!selectedCourse || isEnrolling}>
                                      {isEnrolling ? <LoadingSpinner className="w-4 h-4" /> : "Vincular"}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {usersData.totalPages > 1 && (
                  <div className="flex items-center justify-between pb-8">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1 || loading}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                    </Button>
                    <span className="text-sm text-gray-500">Página {currentPage} de {usersData.totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(usersData.totalPages, p+1))} disabled={currentPage === usersData.totalPages || loading}>
                      Próxima <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
