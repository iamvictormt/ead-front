'use client';

import { useToast as useShadcnToast } from "@/hooks/use-toast";

export function useToast() {
  const { toast } = useShadcnToast();

  return {
    success: (message: string) => {
      toast({
        title: "Sucesso",
        description: message,
      });
    },
    error: (message: string) => {
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    },
    toast
  };
}
