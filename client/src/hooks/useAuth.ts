import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/user'],
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isAuthenticated: !!user && !error,
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
  };
}