import api from './api';

export const shelterService = {
  // 모든 농막 조회
  getShelters: async (page = 1, limit = 10) => {
    const response = await api.get(`/shelters?page=${page}&limit=${limit}`);
    return response.data;
  },

  // 특정 농막 조회
  getShelter: async (id) => {
    const response = await api.get(`/shelters/${id}`);
    return response.data;
  },

  // 농막 등록
  createShelter: async (shelterData) => {
    const response = await api.post('/shelters', shelterData);
    return response.data;
  },

  // 농막 수정
  updateShelter: async (id, shelterData) => {
    const response = await api.put(`/shelters/${id}`, shelterData);
    return response.data;
  },

  // 농막 삭제
  deleteShelter: async (id) => {
    const response = await api.delete(`/shelters/${id}`);
    return response.data;
  },

  // 농막 검색
  searchShelters: async (searchParams) => {
    const response = await api.post('/shelters/search', searchParams);
    return response.data;
  },

  // 이미지 업로드
  uploadImages: async (id, files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post(`/shelters/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
