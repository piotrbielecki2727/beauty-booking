"use client";

import { useState } from "react";

import type { BusinessTeamMember } from "@beauty-booking/shared";
import type {
  BusinessTeamMemberFormInitialFocusField,
  BusinessTeamMemberFormMode,
  BusinessTeamMemberFormState,
  BusinessTeamOwnerDetails,
} from "@/features/businessTeam/lib/businessTeamMembersTypes";

type UseBusinessTeamMemberFormDialogParameters = {
  ownerDetails: BusinessTeamOwnerDetails;
};

type BusinessTeamMemberFormDialogState = {
  formState: BusinessTeamMemberFormState;
  isOpen: boolean;
  resetKey: number;
} | null;

type UseBusinessTeamMemberFormDialogResult = {
  close: () => void;
  formKey: string;
  handleOpenChange: (isOpen: boolean) => void;
  initialFocusField: BusinessTeamMemberFormInitialFocusField | null;
  isOpen: boolean;
  member: BusinessTeamMember | null;
  mode: BusinessTeamMemberFormMode;
  openCreate: () => void;
  openEditMember: (
    member: BusinessTeamMember,
    initialFocusField?: BusinessTeamMemberFormInitialFocusField,
  ) => void;
  openEditOwner: () => void;
  ownerDetails: BusinessTeamOwnerDetails;
  requestClose: () => void;
};

const defaultFormState: BusinessTeamMemberFormState = {
  mode: "create",
};

const getFormDialogResetKey = (formState: BusinessTeamMemberFormState) => {
  if (formState.mode === "editMember") {
    return `editMember:${formState.member.id}:${formState.initialFocusField ?? ""}`;
  }

  return formState.mode;
};

export const useBusinessTeamMemberFormDialog = ({
  ownerDetails,
}: UseBusinessTeamMemberFormDialogParameters): UseBusinessTeamMemberFormDialogResult => {
  const [dialogState, setDialogState] =
    useState<BusinessTeamMemberFormDialogState>(null);
  const currentFormState = dialogState?.formState ?? defaultFormState;
  const open = (formState: BusinessTeamMemberFormState) => {
    setDialogState((currentState) => ({
      formState,
      isOpen: true,
      resetKey: (currentState?.resetKey ?? 0) + 1,
    }));
  };

  const close = () => {
    setDialogState((currentState) =>
      currentState
        ? {
            ...currentState,
            isOpen: false,
          }
        : null,
    );
  };

  const requestClose = () => {
    close();
  };

  const openCreate = () => {
    open({
      mode: "create",
    });
  };

  const openEditMember = (
    member: BusinessTeamMember,
    initialFocusField?: BusinessTeamMemberFormInitialFocusField,
  ) => {
    open({
      initialFocusField,
      member,
      mode: "editMember",
    });
  };

  const openEditOwner = () => {
    open({
      mode: "editOwner",
      ownerDetails,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      requestClose();
    }
  };

  return {
    close,
    formKey: `${getFormDialogResetKey(currentFormState)}:${dialogState?.resetKey ?? 0}`,
    handleOpenChange,
    initialFocusField:
      currentFormState.mode === "editMember"
        ? currentFormState.initialFocusField ?? null
        : null,
    isOpen: dialogState?.isOpen ?? false,
    member:
      currentFormState.mode === "editMember" ? currentFormState.member : null,
    mode: currentFormState.mode,
    openCreate,
    openEditMember,
    openEditOwner,
    ownerDetails:
      currentFormState.mode === "editOwner"
        ? currentFormState.ownerDetails
        : ownerDetails,
    requestClose,
  };
};

export type {
  UseBusinessTeamMemberFormDialogParameters,
  UseBusinessTeamMemberFormDialogResult,
};
