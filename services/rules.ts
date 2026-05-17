import api from "./api";

export interface RuleItem {
  id: string;
  name: string;
  description: string;
  points: number;
  rulesGroupId?: string;
}

export interface RuleInput {
  name: string;
  description: string;
  points: number;
}

export const normalizeRule = (rule: any): RuleItem => ({
  id: String(
    rule?.id ??
      rule?._id ??
      `${rule?.name ?? "rule"}-${rule?.description ?? "item"}`,
  ),
  name: rule?.name ?? "Règle sans nom",
  description: rule?.description ?? "Pas de description",
  points: Number(rule?.points ?? rule?.nbPoints ?? 0),
  rulesGroupId: rule?.rulesGroupId ?? rule?.rules_group_id,
});

export const normalizeRules = (rules: any[]) => rules.map(normalizeRule);

const createRuleRequest = async ({
  name,
  description,
  points,
  rulesGroupId,
}: RuleInput & { rulesGroupId: string }) => {
  const response = await api.post("/rules", {
    name: name || "Règle sans nom",
    description: description || "Pas de description",
    points: Number(points) || 10,
    rules_group_id: rulesGroupId,
  });

  return response.data.rule ?? response.data;
};

export const rulesService = {
  createRulesGroup: async (groupName: string, rules: RuleInput[]) => {
    const groupRes = await api.post("/rules-groups", { name: groupName });
    const groupId = groupRes.data.rulesGroup.id;

    for (const rule of rules) {
      await createRuleRequest({
        name: rule.name,
        description: rule.description,
        points: Number(rule.points),
        rulesGroupId: groupId,
      });
    }

    return groupId;
  },

  getRulesByGroup: async (groupId: string): Promise<RuleItem[]> => {
    const response = await api.get(`/rules/group/${groupId}`);
    const rawRules = response.data.rules ?? response.data;

    if (!Array.isArray(rawRules)) {
      return [];
    }

    return normalizeRules(rawRules);
  },

  createRule: async (
    payload: RuleInput & { rulesGroupId: string },
  ): Promise<RuleItem> => {
    const createdRule = await createRuleRequest(payload);
    return normalizeRule(createdRule);
  },
};
