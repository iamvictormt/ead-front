'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  completedCourses: number;
  studyHours: number;
  certificates: number;
  activeCourses: number;
  totalProgress: number;
}

interface CourseProgress {
  courseId: number;
  courseName: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
}

interface DashboardData {
  stats: DashboardStats;
  courseProgress: CourseProgress[];
  recentActivity: any[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Mova essa função para o escopo do hook
  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard', {
        method: 'GET',
        credentials: 'include',
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar dados');
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = () => {
    fetchDashboardData();
  };

  return { data, loading, error, refetch };
}
