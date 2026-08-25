import { z } from "zod";

import { emailSchema } from "../account";
import { businessTeamMemberRoles } from "../businessSetup";

export const businessTeamAccessStatuses = [
  "NO_ACCESS",
  "INVITED",
  "ACTIVE",
] as const;

export const businessTeamAccessStatusSchema = z.enum(
  businessTeamAccessStatuses,
);

export const businessTeamMemberAccessSchema = z.object({
  acceptedAt: z.string().datetime().nullable(),
  email: z.string(),
  expiresAt: z.string().datetime().nullable(),
  invitationId: z.string().uuid().nullable(),
  status: businessTeamAccessStatusSchema,
});

export const businessTeamMemberSchema = z.object({
  access: businessTeamMemberAccessSchema,
  email: z.string(),
  fullName: z.string(),
  id: z.string().uuid(),
  providesServices: z.boolean(),
  role: z.enum(businessTeamMemberRoles),
});

export const businessTeamResponseSchema = z.object({
  teamMembers: z.array(businessTeamMemberSchema),
});

export const createBusinessTeamInvitationRequestSchema = z.object({
  email: emailSchema.optional(),
});

export const businessTeamInvitationSchema = z.object({
  email: emailSchema,
  expiresAt: z.string().datetime(),
  id: z.string().uuid(),
  inviteUrl: z.string(),
  teamMemberId: z.string().uuid(),
  token: z.string(),
});

export const createBusinessTeamInvitationResponseSchema = z.object({
  invitation: businessTeamInvitationSchema,
  teamMembers: z.array(businessTeamMemberSchema),
});

export const cancelBusinessTeamInvitationResponseSchema =
  businessTeamResponseSchema;

export const businessTeamInvitationPreviewSchema = z.object({
  businessName: z.string(),
  email: emailSchema,
  expiresAt: z.string().datetime(),
  fullName: z.string(),
  role: z.enum(businessTeamMemberRoles),
  status: z.enum(["PENDING", "ACCEPTED", "CANCELLED", "EXPIRED"]),
});

export const acceptBusinessTeamInvitationResponseSchema = z.object({
  teamMember: businessTeamMemberSchema,
});

export type BusinessTeamAccessStatus = z.infer<
  typeof businessTeamAccessStatusSchema
>;
export type BusinessTeamMember = z.infer<typeof businessTeamMemberSchema>;
export type BusinessTeamResponse = z.infer<typeof businessTeamResponseSchema>;
export type CreateBusinessTeamInvitationRequest = z.infer<
  typeof createBusinessTeamInvitationRequestSchema
>;
export type CreateBusinessTeamInvitationResponse = z.infer<
  typeof createBusinessTeamInvitationResponseSchema
>;
export type BusinessTeamInvitationPreview = z.infer<
  typeof businessTeamInvitationPreviewSchema
>;
export type AcceptBusinessTeamInvitationResponse = z.infer<
  typeof acceptBusinessTeamInvitationResponseSchema
>;
