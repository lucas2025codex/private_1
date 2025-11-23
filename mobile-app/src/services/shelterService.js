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

  // 농막 검색 및 필터링
  searchShelters: async (searchParams) => {
    const response = await api.post('/shelters/search', searchParams);
    return response.data;
  },
};
