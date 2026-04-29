import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type GalleryItem = {
  id: number;
  title: string;
  description: string;
  photoUrl: string;
  childId: number | null;
  childName: string | null;
  createdAt: string;
};

export type GalleryItemInput = {
  title: string;
  description: string;
  photoUrl: string;
  childId: number | null;
};

const adminGalleryKey = ["admin-gallery-items"];
const publicGalleryKey = ["public-gallery-items"];

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

export function useGalleryItems() {
  return useQuery({
    queryKey: publicGalleryKey,
    queryFn: () => request<GalleryItem[]>("/api/gallery-items"),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminGalleryItems() {
  return useQuery({
    queryKey: adminGalleryKey,
    queryFn: () => request<GalleryItem[]>("/api/admin/gallery-items"),
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GalleryItemInput) =>
      request<GalleryItem>("/api/admin/gallery-items", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGalleryKey });
      queryClient.invalidateQueries({ queryKey: publicGalleryKey });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GalleryItemInput }) =>
      request<GalleryItem>(`/api/admin/gallery-items/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGalleryKey });
      queryClient.invalidateQueries({ queryKey: publicGalleryKey });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      request<{ ok: boolean }>(`/api/admin/gallery-items/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGalleryKey });
      queryClient.invalidateQueries({ queryKey: publicGalleryKey });
    },
  });
}
