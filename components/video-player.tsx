'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'
import { CustomButton } from '@/components/ui/custom-button'

interface VideoPlayerProps {
  videoUrl: string
  videoType: 'youtube' | 'vimeo' | 'upload'
  title: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

export function VideoPlayer({ videoUrl, videoType, title, onProgress, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const getEmbedUrl = (url: string, type: string) => {
    switch (type) {
      case 'youtube':
        const youtubeId = url.split('v=')[1]?.split('&')[0]
        return `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`
      case 'vimeo':
        const vimeoId = url.split('/').pop()
        return `https://player.vimeo.com/video/${vimeoId}`
      default:
        return url
    }
  }

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl">
      <div className="aspect-video">
        {videoType === 'upload' ? (
          <video
            className="w-full h-full"
            controls
            poster="/placeholder.svg?height=400&width=600&text=Video+Thumbnail"
          >
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        ) : (
          <iframe
            src={getEmbedUrl(videoUrl, videoType)}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        )}
      </div>
      
      {/* Custom Controls Overlay (for uploaded videos) */}
      {videoType === 'upload' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </CustomButton>
              
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </CustomButton>
              
              <span className="text-sm">0:00 / 15:30</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CustomButton
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-5 h-5" />
              </CustomButton>
              
              <CustomButton
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-5 h-5" />
              </CustomButton>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/30 rounded-full h-1 mt-3">
            <div className="bg-[#85E8EA] h-1 rounded-full" style={{ width: '30%' }} />
          </div>
        </div>
      )}
    </div>
  )
}
