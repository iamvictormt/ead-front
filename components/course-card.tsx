import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CustomCard } from "@/components/ui/custom-card"
import { CustomButton } from "@/components/ui/custom-button"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Play, Clock, Users, Star } from 'lucide-react'

interface CourseCardProps {
  title: string
  instructor: string
  instructorAvatar: string
  thumbnail: string
  category: string
  progress?: number
  duration?: string
  students?: number
  rating?: number
}

export function CourseCard({ 
  title, 
  instructor, 
  instructorAvatar, 
  thumbnail, 
  category,
  progress,
  duration = "2h 30m",
  students = 1234,
  rating = 4.8
}: CourseCardProps) {
  return (
    <CustomCard className="overflow-hidden group">
      <div className="relative">
        <img 
          src={thumbnail || "/placeholder.svg?height=200&width=300"} 
          alt={title}
          className="w-full h-[40vh] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CustomButton size="sm" className="shadow-2xl">
            <Play className="w-4 h-4 mr-2" />
            Assistir
          </CustomButton>
        </div>
        
        {progress && (
          <div className="absolute top-4 left-4">
            <ProgressRing progress={(progress / 8) * 100} size={50} />
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <Badge className="bg-[#85E8EA] text-gray-900 font-semibold">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-foreground mb-3 line-clamp-2 text-lg group-hover:text-[#85E8EA] transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 ring-2 ring-[#85E8EA]/30">
              <AvatarImage src={instructorAvatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#85E8EA] text-gray-900">{instructor[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">{instructor}</span>
          </div>
          
          {progress && (
            <Badge variant="outline" className="text-[#85E8EA] border-[#85E8EA]">
              {progress}/8 aulas
            </Badge>
          )}
        </div>
      </div>
    </CustomCard>
  )
}
