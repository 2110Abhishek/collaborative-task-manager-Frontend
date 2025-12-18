import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth.api";

export const useAuth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMe();
      return res.data;
    },
    retry: false,
  });

  return {
    user: data ?? null,
    isLoading,
  };
};
