import api from "./api";

export const roomService = {
  getRooms: async () => {
    const response = await api.get("/rooms");
    return response.data.rooms;
  },

  createRoom: async (name: string, date: string, rulesGroupId: string) => {
    const response = await api.post("/rooms", {
      name: name,
      date: date,
      rules_group_id: rulesGroupId,
    });
    return response.data;
  },

  joinRoom: async (code: string) => {
    const response = await api.post("/rooms/join/code", { code });
    return response.data;
  },
};
