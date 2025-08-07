'use client'

import { useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { VideoPlayer } from "@/components/video-player"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomCard } from "@/components/ui/custom-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Play, CheckCircle, FileText, Download, MessageSquare, ThumbsUp, Clock, Users, Star, ChevronDown, ChevronRight } from 'lucide-react'
import { mockCourses, mockComments, Lesson } from '@/lib/courses'

export default function CourseViewPage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id)
  const course = mockCourses.find(c => c.id === courseId)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(course?.modules[0]?.lessons[0] || null)
  const [expandedModules, setExpandedModules] = useState<number[]>([1])
  const [newComment, setNewComment] = useState('')
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2])

  if (!course) {
    return <div>Curso não encontrado</div>
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const markLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId])
    }
  }

  const lessonComments = mockComments.filter(c => c.lessonId === selectedLesson?.id)

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b border-[#85E8EA]/20 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{course.title}</h1>
                  <p className="text-sm text-gray-600">por {course.instructor}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-[#85E8EA] text-gray-900">
                  {course.category}
                </Badge>
                <CustomButton variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Certificado
                </CustomButton>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Course Content */}
            <div className="flex-1 p-6">
              {/* Video Player */}
              {selectedLesson && (
                <div className="mb-6">
                  <VideoPlayer
                    videoUrl={selectedLesson.videoUrl}
                    videoType={selectedLesson.videoType}
                    title={selectedLesson.title}
                    onComplete={() => markLessonComplete(selectedLesson.id)}
                  />
                </div>
              )}

              {/* Lesson Info */}
              {selectedLesson && (
                <CustomCard className="p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{selectedLesson.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students.toLocaleString()} alunos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CustomButton
                      onClick={() => markLessonComplete(selectedLesson.id)}
                      className={completedLessons.includes(selectedLesson.id) ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {completedLessons.includes(selectedLesson.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Concluída
                        </>
                      ) : (
                        'Marcar como Concluída'
                      )}
                    </CustomButton>
                  </div>

                  {/* Materials */}
                  {selectedLesson.materials.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Materiais Complementares
                      </h3>
                      <div className="space-y-2">
                        {selectedLesson.materials.map((material) => (
                          <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-red-500" />
                              <div>
                                <p className="font-medium text-gray-900">{material.title}</p>
                                {material.size && (
                                  <p className="text-sm text-gray-500">{material.size}</p>
                                )}
                              </div>
                            </div>
                            <CustomButton variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Baixar
                            </CustomButton>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CustomCard>
              )}

              {/* Comments Section */}
              <CustomCard className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Dúvidas e Comentários ({lessonComments.length})
                </h3>
                
                {/* Add Comment */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-[#85E8EA] text-gray-900 text-sm">PK</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Faça uma pergunta ou deixe um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-3"
                      />
                      <CustomButton size="sm">
                        Comentar
                      </CustomButton>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {lessonComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-[#85E8EA] text-gray-900 text-sm">
                          {comment.userName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.userName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[#85E8EA]">
                            <ThumbsUp className="w-4 h-4" />
                            Útil
                          </button>
                          <button className="text-gray-500 hover:text-[#85E8EA]">
                            Responder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CustomCard>
            </div>

            {/* Course Sidebar */}
            <div className="w-80 bg-white border-l border-[#85E8EA]/20 p-6">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Progresso do Curso</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="progress-bar h-2 rounded-full" style={{ width: '67%' }} />
                </div>
                <p className="text-sm text-gray-600">6 de 9 aulas concluídas (67%)</p>
              </div>

              {/* Course Modules */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">Conteúdo do Curso</h3>
                {course.modules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.lessons.length} aulas</p>
                      </div>
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="border-t border-gray-200">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                              selectedLesson?.id === lesson.id ? 'bg-[#85E8EA]/10' : ''
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {completedLessons.includes(lesson.id) ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Play className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                              <p className="text-sm text-gray-600">{lesson.duration}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
