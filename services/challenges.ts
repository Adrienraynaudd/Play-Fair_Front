import api from "./api";

export interface PlayerChallengeSummary {
  score: number;
  ruleCounts: Record<string, number>;
}

export interface RuleValidationResult {
  score: number;
  ruleCount: number;
}

const toSafeNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const resolveScoreValue = (
  source: { score?: unknown } | null | undefined,
  fallback = 0,
): number => {
  if (!source) {
    return fallback;
  }

  return toSafeNumber(source.score, fallback);
};

export const challengeService = {
  getPlayerChallengeSummary: async (
    roomId: string,
    memberId: string,
  ): Promise<PlayerChallengeSummary> => {
    const response = await api.get(
      `/rooms/${roomId}/members/${memberId}/challenge-summary`,
    );

    return {
      score: resolveScoreValue(response.data, 0),
      ruleCounts: response.data.ruleCounts ?? {},
    };
  },

  validateRuleForPlayer: async (
    roomId: string,
    memberId: string,
    ruleId: string,
  ): Promise<RuleValidationResult> => {
    const response = await api.post(
      `/rooms/${roomId}/members/${memberId}/rule-validations`,
      { ruleId },
    );

    return {
      score: resolveScoreValue(response.data, 0),
      ruleCount: toSafeNumber(response.data.ruleCount, 0),
    };
  },
};
