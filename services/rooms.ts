import api from "./api";
import type { RuleItem } from "./rules";

export interface RoomActor {
  id?: string;
  username?: string;
  isCurrentUser?: boolean;
  role?: string;
}

export interface RoomSummary {
  id: string;
  name: string;
  date: string;
  membersCount?: number;
  roomCode?: string;
  rulesGroupId?: string;
  rules_group_id?: string;
  currentUserScore?: number;
  owner?: RoomActor | string | null;
  createdBy?: RoomActor | string | null;
  host?: RoomActor | string | null;
}

export interface RoomDetails extends RoomSummary {
  rules?: RuleItem[];
  rulesGroupId?: string;
  rules_group_id?: string;
  rulesGroup?: {
    id?: string;
    rules?: RuleItem[];
  };
  isCreator?: boolean;
  canManageRules?: boolean;
  isHost?: boolean;
  role?: string;
  owner?: RoomActor | string | null;
  createdBy?: RoomActor | string | null;
  host?: RoomActor | string | null;
}

export interface RoomMember {
  id: string;
  username: string;
  score?: number;
}

export interface RoomMembersResponse {
  members: RoomMember[];
}

export interface JoinRoomResponse {
  room?: RoomSummary;
  joinedRoom?: RoomSummary;
  [key: string]: unknown;
}

export const resolveCurrentUserRoomScore = (room: RoomSummary) => {
  const parsedScore = Number(room.currentUserScore ?? 0);
  return Number.isFinite(parsedScore) ? parsedScore : 0;
};

export const roomService = {
  getRooms: async (): Promise<RoomSummary[]> => {
    const response = await api.get("/rooms");
    return response.data.rooms ?? [];
  },
  createRoom: async (name: string, date: string, rulesGroupId: string) => {
    const response = await api.post("/rooms", {
      name: name,
      date: date,
      rules_group_id: rulesGroupId,
    });
    return response.data;
  },
  joinRoom: async (code: string): Promise<JoinRoomResponse> => {
    const response = await api.post("/rooms/join/code", { code });
    return response.data;
  },
  getRoom: async (id: string): Promise<RoomDetails> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data.room ?? response.data;
  },
  getRoomMembers: async (id: string): Promise<RoomMembersResponse> => {
    const response = await api.get(`/rooms/${id}/members`);
    return response.data;
  },
};
