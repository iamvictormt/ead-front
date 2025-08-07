import { CustomCard } from '@/components/ui/custom-card'
import { Badge } from '@/components/ui/badge'
import { ProgressRing } from '@/components/ui/progress-ring'
import { Play, FileText, Clock, CheckCircle } from 'lucide-react'
import { Course, UserProgress } from '@/lib/courses'

interface CourseProgressProps {
  course: Course
  progress: UserProgress
}

export function CourseProgress({ course, progress }: CourseProgressProps) {
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = progress.completedLessons.length
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

  return (
    <CustomCard className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img 
            src={course.thumbnail || "/placeholder.svg"} 
            alt={course.title}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="absolute -bottom-2 -right-2">
            <ProgressRing progress={progressPercentage} size={40} strokeWidth={4} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-foreground mb-1 line-clamp-2 text-lg group-hover:text-[#85E8EA] transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">por <span className="text-sm font-medium text-foreground">{course.instructor}</span></p>
            </div>
            <Badge className="bg-[#85E8EA] text-gray-900">
              {course.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{completedLessons}/{totalLessons} aulas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            {progress.certificateIssued && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Certificado</span>
              </div>
            )}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="progress-bar h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </CustomCard>
  )
}
