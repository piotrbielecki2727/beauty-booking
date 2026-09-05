import { BusinessTeamApiError } from "@/features/businessTeam/api";

type BusinessTeamErrorFallbackKey =
  | "businessTeamInvitation.feedback.acceptFailed"
  | "businessTeamInvitation.feedback.loadFailed"
  | "managementEmployees.feedback.cancelFailed"
  | "managementEmployees.feedback.deactivateFailed"
  | "managementEmployees.feedback.inviteFailed"
  | "managementEmployees.feedback.loadFailed"
  | "managementEmployees.feedback.reactivateFailed"
  | "managementEmployees.feedback.saveFailed";

const businessTeamRequestStatusErrorKeys = {
  400: "api.businessTeam.badRequest",
  401: "api.businessTeam.unauthorized",
  403: "api.businessTeam.forbidden",
  404: "api.businessTeam.notFound",
  409: "api.businessTeam.conflict",
} as const;

const businessTeamRequestErrorCodeKeys = {
  cancelled: "api.businessTeam.cancelled",
  connectionError: "api.businessTeam.connectionError",
  invalidResponse: "api.businessTeam.invalidResponse",
  requestFailed: "api.businessTeam.requestFailed",
  timeout: "api.businessTeam.timeout",
} as const;

const getBusinessTeamErrorMessageKey = (
  error: unknown,
  fallbackKey: BusinessTeamErrorFallbackKey,
) => {
  if (!(error instanceof BusinessTeamApiError)) {
    return fallbackKey;
  }

  if (
    error.status &&
    error.status in businessTeamRequestStatusErrorKeys
  ) {
    return businessTeamRequestStatusErrorKeys[
      error.status as keyof typeof businessTeamRequestStatusErrorKeys
    ];
  }

  return businessTeamRequestErrorCodeKeys[error.code] ?? fallbackKey;
};

export { getBusinessTeamErrorMessageKey };
export type { BusinessTeamErrorFallbackKey };
