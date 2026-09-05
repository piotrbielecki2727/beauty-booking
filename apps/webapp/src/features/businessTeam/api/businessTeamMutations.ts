const businessTeamMutationScope = {
  id: "business-team",
};

const businessTeamMutationKeys = {
  all: ["businessTeam", "mutation"] as const,
  acceptInvitation: () =>
    [...businessTeamMutationKeys.all, "acceptInvitation"] as const,
  cancelInvitation: () =>
    [...businessTeamMutationKeys.all, "cancelInvitation"] as const,
  createInvitation: () =>
    [...businessTeamMutationKeys.all, "createInvitation"] as const,
  createMember: () => [...businessTeamMutationKeys.all, "createMember"] as const,
  deactivateMember: () =>
    [...businessTeamMutationKeys.all, "deactivateMember"] as const,
  reactivateMember: () =>
    [...businessTeamMutationKeys.all, "reactivateMember"] as const,
  updateMember: () => [...businessTeamMutationKeys.all, "updateMember"] as const,
  updateOwner: () => [...businessTeamMutationKeys.all, "updateOwner"] as const,
};

export { businessTeamMutationKeys, businessTeamMutationScope };
