import api from "./api";

export interface UploadResponse {
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
}

export const uploadService = {
  uploadImage: async (file: File, folder = "eventia/banners"): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<UploadResponse>("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
