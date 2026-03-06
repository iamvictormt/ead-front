'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from "@/components/admin-sidebar";
import { UserDropdown } from "@/components/user-dropdown";
import { CustomCard } from "@/components/ui/custom-card";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Download, Users, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Student {
  id: number;
  name: string;
  email: string;
  profilePic?: string;
  createdAt: string;
  enrollments?: { course: { title: string } }[];
}

interface Course {
  id: string;
  title: string;
}

// Mock admin user data
const mockAdminUser = {
  name: "Admin User",
  email: "admin@email.com",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "admin"
};

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [page, search, selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setCourses(result.data);
      } else {
        // Mocking courses if API fails or for initial design
        setCourses([
          { id: '1', title: 'React Avançado' },
          { id: '2', title: 'Node.js Backend' },
          { id: '3', title: 'Design System' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const courseParam = selectedCourse !== 'all' ? `&courseId=${selectedCourse}` : '';
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`/api/users?page=${page}&limit=10${courseParam}${searchParam}`);
      const result = await response.json();

      if (result.success) {
        setStudents(result.data.users);
        setTotalPages(result.data.totalPages);
        setTotalStudents(result.data.total);
      } else {
        // Use some mock data if API is not fully ready
        setMockData();
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockStudents = [
      { id: 1, name: "Adnaisa Afonso", email: "isauraafonso@ocloud.com", createdAt: "2026-01-06T10:00:00Z" },
      { id: 2, name: "João Silva", email: "joao.silva@email.com", createdAt: "2026-01-07T14:30:00Z" },
      { id: 3, name: "Maria Santos", email: "maria.santos@email.com", createdAt: "2026-01-08T09:15:00Z" },
    ];
    setStudents(mockStudents);
    setTotalStudents(74);
    setTotalPages(4);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Fetch ALL students for the current filter for the PDF
      const courseParam = selectedCourse !== 'all' ? `&courseId=${selectedCourse}` : '';
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`/api/users?page=1&limit=1000${courseParam}${searchParam}`);
      const result = await response.json();

      let studentsToExport = students;
      if (result.success) {
        studentsToExport = result.data.users;
      }

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(33, 33, 33);
      doc.text('Lista de Alunos', 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100);
      const reportDate = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      doc.text(`Gerado em: ${reportDate}`, 14, 30);

      if (selectedCourse !== 'all') {
        const courseName = courses.find(c => c.id === selectedCourse)?.title || '';
        doc.text(`Filtro: Curso - ${courseName}`, 14, 36);
      }

      // Table
      const tableRows = studentsToExport.map(student => [
        student.name,
        student.email,
        format(new Date(student.createdAt), 'dd/MM/yyyy', { locale: ptBR }),
        student.enrollments?.map(e => e.course.title).join(', ') || 'N/A'
      ]);

      autoTable(doc, {
        head: [['Nome', 'Email', 'Cadastrado em', 'Cursos']],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillStyle: 'F3F4F6', textColor: [0, 0, 0], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      doc.save(`lista_alunos_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
      toast.success("Lista de alunos baixada com sucesso!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erro ao gerar PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <AdminSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b border-[#85E8EA]/20 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Gerenciar Alunos</h1>
                  <p className="text-muted-foreground">Administre os alunos matriculados na plataforma</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-[#F3F4F6] px-3 py-1.5 rounded-full border border-gray-200">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">{totalStudents} alunos</span>
                </div>
                <div className="text-sm text-muted-foreground bg-white border px-3 py-1.5 rounded-full border-gray-200">
                  Página {page} de {totalPages}
                </div>
                <UserDropdown user={mockAdminUser} />
              </div>
            </div>
          </header>

          <div className="p-6">
            <CustomCard className="p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome ou email..."
                    className="pl-10 h-11"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select
                    value={selectedCourse}
                    onValueChange={(val) => {
                      setSelectedCourse(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-11 border-gray-200">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Filtrar por Curso" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Cursos</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <CustomButton className="h-11 px-6 bg-[#85E8EA] hover:bg-[#6BC5E8] text-gray-900 font-bold">
                    Pesquisar
                  </CustomButton>
                  <CustomButton
                    variant="outline"
                    className="h-11 px-6 border-[#85E8EA] text-[#85E8EA] hover:bg-[#85E8EA]/10 flex items-center gap-2"
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? "Baixando..." : "Baixar Lista"}
                  </CustomButton>
                </div>
              </div>
            </CustomCard>

            <div className="mb-4">
              <span className="text-gray-500 font-medium">{students.length} alunos encontrados</span>
            </div>

            <CustomCard className="overflow-hidden">
              <div className="bg-gray-50/50 border-b px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg text-foreground">Alunos Cadastrados</h3>
                <span className="text-sm text-muted-foreground">
                  Mostrando {students.length} de {totalStudents} alunos
                </span>
              </div>
              <div className="divide-y">
                {loading ? (
                  <div className="p-12 text-center text-muted-foreground">Carregando alunos...</div>
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <div key={student.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-[#85E8EA]/20">
                          <AvatarImage src={student.profilePic || ""} />
                          <AvatarFallback className="bg-[#85E8EA]/10 text-[#85E8EA] font-bold">
                            {student.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-foreground text-lg">{student.name}</h4>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-bold rounded uppercase tracking-wider">Aluno</span>
                          </div>
                          <p className="text-muted-foreground mb-1">{student.email}</p>
                          <p className="text-sm text-gray-400 font-medium">Cadastrado em {format(new Date(student.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</p>
                        </div>
                      </div>
                      <CustomButton variant="outline" className="rounded-xl border-gray-200 font-semibold hover:bg-[#85E8EA]/10 hover:border-[#85E8EA] hover:text-[#85E8EA] flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Vincular Curso
                      </CustomButton>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground">Nenhum aluno encontrado para os filtros selecionados.</div>
                )}
              </div>
            </CustomCard>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full w-10 h-10 p-0 border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </CustomButton>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-full font-bold transition-all ${
                        page === p
                        ? 'bg-[#85E8EA] text-gray-900 shadow-lg'
                        : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-full w-10 h-10 p-0 border-gray-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
