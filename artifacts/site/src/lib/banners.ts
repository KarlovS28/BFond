import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Banner = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isEnabled: boolean;
  createdAt: string;
};

export type BannerInput = {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isEnabled: boolean;
};

const adminBannerKey = ["admin-banners"];
const publicBannerKey = ["public-banners"];

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function useBanners() {
  return useQuery({
    queryKey: publicBannerKey,
    queryFn: () => request<Banner[]>("/api/banners"),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: adminBannerKey,
    queryFn: () => request<Banner[]>("/api/admin/banners"),
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BannerInput) =>
      request<Banner>("/api/admin/banners", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBannerKey });
      queryClient.invalidateQueries({ queryKey: publicBannerKey });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BannerInput }) =>
      request<Banner>(`/api/admin/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBannerKey });
      queryClient.invalidateQueries({ queryKey: publicBannerKey });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      request<{ ok: boolean }>(`/api/admin/banners/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBannerKey });
      queryClient.invalidateQueries({ queryKey: publicBannerKey });
    },
  });
}
