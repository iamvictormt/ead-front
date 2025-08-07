export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  price: number;
  rating: number;
  students: number;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'upload';
  duration: string;
  order: number;
  materials: Material[];
  completed?: boolean;
}

export interface Material {
  id: number;
  title: string;
  type: 'pdf' | 'link' | 'image';
  url: string;
  size?: string;
}

export interface Comment {
  id: number;
  lessonId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Certificate {
  id: number;
  courseId: number;
  userId: number;
  issuedAt: string;
  certificateUrl: string;
}

export interface UserProgress {
  userId: number;
  courseId: number;
  completedLessons: number[];
  progress: number;
  lastAccessedAt: string;
  certificateIssued?: boolean;
}

// Mock data
export const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Desenvolvimento Frontend Moderno com React',
    description: 'Aprenda React do zero ao avançado com projetos práticos',
    instructor: 'Ana Silva',
    instructorAvatar: '/placeholder.svg?height=32&width=32',
    thumbnail: '/placeholder.svg?height=200&width=300',
    category: 'FRONTEND',
    level: 'Intermediário',
    duration: '4h 20m',
    price: 199.9,
    rating: 4.9,
    students: 2847,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    modules: [
      {
        id: 1,
        title: 'Introdução ao React',
        description: 'Fundamentos e conceitos básicos',
        order: 1,
        lessons: [
          {
            id: 1,
            title: 'O que é React?',
            description: 'Introdução aos conceitos fundamentais do React',
            videoUrl: 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
            videoType: 'youtube',
            duration: '15:30',
            order: 1,
            materials: [
              {
                id: 1,
                title: 'Slides da Aula',
                type: 'pdf',
                url: '/materials/react-intro.pdf',
                size: '2.5 MB',
              },
            ],
          },
          {
            id: 2,
            title: 'Configurando o Ambiente',
            description: 'Setup do ambiente de desenvolvimento',
            videoUrl: 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
            videoType: 'youtube',
            duration: '12:45',
            order: 2,
            materials: [],
          },
        ],
      },
      {
        id: 2,
        title: 'Componentes e Props',
        description: 'Criando e utilizando componentes',
        order: 2,
        lessons: [
          {
            id: 3,
            title: 'Criando Componentes',
            description: 'Como criar e estruturar componentes React',
            videoUrl: 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
            videoType: 'youtube',
            duration: '18:20',
            order: 1,
            materials: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Node.js e APIs RESTful',
    description: 'Desenvolvimento backend completo com Node.js',
    instructor: 'Carlos Santos',
    instructorAvatar: '/placeholder.svg?height=32&width=32',
    thumbnail: '/placeholder.svg?height=200&width=300',
    category: 'BACKEND',
    level: 'Avançado',
    duration: '6h 30m',
    price: 299.9,
    rating: 4.7,
    students: 1523,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    modules: [
      {
        id: 3,
        title: 'Fundamentos do Node.js',
        description: 'Introdução ao desenvolvimento backend',
        order: 1,
        lessons: [
          {
            id: 4,
            title: 'Introdução ao Node.js',
            description: 'O que é Node.js e como funciona',
            videoUrl: 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
            videoType: 'youtube',
            duration: '20:15',
            order: 1,
            materials: [],
          },
        ],
      },
    ],
  },
];

export const mockUserProgress: UserProgress[] = [
  {
    userId: 2,
    courseId: 1,
    completedLessons: [1, 2],
    progress: 67,
    lastAccessedAt: '2024-01-20T10:30:00Z',
  },
  {
    userId: 2,
    courseId: 2,
    completedLessons: [4],
    progress: 25,
    lastAccessedAt: '2024-01-19T15:45:00Z',
  },
];

export const mockComments: Comment[] = [
  {
    id: 1,
    lessonId: 1,
    userId: 2,
    userName: 'Victor Torres',
    userAvatar: '/placeholder.svg?height=32&width=32',
    content: 'Excelente explicação! Muito didático.',
    createdAt: '2024-01-20T14:30:00Z',
  },
];
