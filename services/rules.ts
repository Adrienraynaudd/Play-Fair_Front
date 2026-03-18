import api from "./api";

export const rulesService = {
  createRulesGroup: async (groupName: string, rules: any[]) => {
    const groupRes = await api.post("/rules-groups", { name: groupName });
    const groupId = groupRes.data.rulesGroup.id;

    for (const rule of rules) {
      await api.post("/rules", {
        name: rule.name || "Règle sans nom",
        description: rule.description || "Pas de description",
        points: parseInt(rule.points) || 10,
        rules_group_id: groupId
      });
    }

    return groupId;
  }
};