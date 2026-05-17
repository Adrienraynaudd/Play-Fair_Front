const ROOM_CODE_KEYS = ["code", "roomCode", "room_code"];

export const buildRoomJoinPayload = (code: string) => {
  const normalizedCode = code.trim();

  return `playfairfront://join-party?code=${encodeURIComponent(normalizedCode)}`;
};

export const extractRoomJoinCode = (rawValue: string) => {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(value);

    if (parsedValue && typeof parsedValue === "object") {
      for (const key of ROOM_CODE_KEYS) {
        const codeValue = parsedValue[key as keyof typeof parsedValue];

        if (typeof codeValue === "string" && codeValue.trim()) {
          return codeValue.trim();
        }
      }
    }
  } catch {
  }

  try {
    const url = new URL(value);
    const code = url.searchParams.get("code");

    if (code?.trim()) {
      return code.trim();
    }
  } catch {
  }

  return value;
};
