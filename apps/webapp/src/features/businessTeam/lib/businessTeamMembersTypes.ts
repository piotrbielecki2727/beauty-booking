import type {
  BusinessTeamMember,
  BusinessTeamMemberListStatus,
  BusinessTeamOwner,
  BusinessTeamMemberRole,
} from "@beauty-booking/shared";

type BusinessTeamOwnerDetails = Pick<
  BusinessTeamOwner,
  "birthdayDay" | "birthdayMonth" | "phoneNumber" | "providesServices"
>;

type BusinessTeamMemberFormMode = "create" | "editMember" | "editOwner";
type BusinessTeamMemberFormInitialFocusField = "email";

type BusinessTeamMemberFormState =
  | {
      mode: "create";
    }
  | {
      initialFocusField?: BusinessTeamMemberFormInitialFocusField;
      member: BusinessTeamMember;
      mode: "editMember";
    }
  | {
      ownerDetails: BusinessTeamOwnerDetails;
      mode: "editOwner";
    };

type BusinessTeamMemberFormRole = BusinessTeamMemberRole;

type BusinessTeamMemberPendingIds = {
  deactivate: string | null;
  invite: string | null;
  reactivate: string | null;
};

export type {
  BusinessTeamMemberPendingIds,
  BusinessTeamMemberFormMode,
  BusinessTeamMemberFormInitialFocusField,
  BusinessTeamMemberFormRole,
  BusinessTeamMemberFormState,
  BusinessTeamMemberListStatus,
  BusinessTeamOwnerDetails,
};
