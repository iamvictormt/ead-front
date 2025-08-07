'use client';

import { useState, useEffect } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail?: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  price: number;
  rating: number;
  students: number;
  createdAt: string;
  updatedAt: string;
}

interface MyCourse extends Course {
  progress?: number;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: number;
  totalLessons: number;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/courses', {
          method: 'GET',
          credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao carregar cursos');
        }

        setCourses(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar cursos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return { courses, loading, error };
}

export function useMyCourses() {
  const [myCourses, setMyCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyCourses() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/courses/my-courses');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao carregar meus cursos');
        }

        setMyCourses(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar meus cursos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyCourses();
  }, []);

  return { myCourses, loading, error };
}
