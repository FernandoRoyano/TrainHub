"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const supabase = createClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-profile"],
    queryFn: () => authService.getProfile(),
    retry: false,
  });

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
      if (!session) {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, queryClient, router]);

  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    profile,
    isLoading,
    error,
    isAuthenticated: !!profile,
    isAdmin: profile?.role === "admin",
    signOut: signOutMutation.mutate,
    isSigningOut: signOutMutation.isPending,
  };
}
