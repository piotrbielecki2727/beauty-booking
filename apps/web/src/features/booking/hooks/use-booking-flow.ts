"use client"

import { useCallback, useEffect, useState } from "react"

import { bookingSteps } from "@/features/booking/config/booking-steps"
import { mockBookingBusiness } from "@/features/booking/mocks/business"
import { mockBeautyServices } from "@/features/booking/mocks/services"
import { mockStaffMembers } from "@/features/booking/mocks/staff"
import { mockTimeSlots } from "@/features/booking/mocks/time-slots"
import { customerDetailsSchema, emptyCustomerDetails } from "@/features/booking/schemas/customer-details-schema"
import { emptyBookingConsents } from "@/features/booking/types/consents"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import { bookingStepIds } from "@/features/booking/types/flow"
import type { BookingScreen, BookingStep, BookingTransitionState } from "@/features/booking/types/flow"
import type { AccountInviteVariant, StoredBookingReservation } from "@/features/booking/types/reservation"
import { clearBookingDraft, readBookingDraft, saveBookingDraft } from "@/features/booking/utils/booking-draft-storage"
import { createStoredReservation } from "@/features/booking/utils/reservation-storage"

const initialSmsVerificationCode = "111111"
const resentSmsVerificationCode = "222222"
const bookingDraftRestoreDelay = 800
const bookingTransitionDelay = 900

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const isBookingStep = (screen: BookingScreen): screen is BookingStep =>
  bookingStepIds.includes(screen as BookingStep)

const useBookingFlow = () => {
  const isSoloBusiness = mockBookingBusiness.isSoloBusiness
  const isAuthenticated = false
  const [accountInviteVariant, setAccountInviteVariant] = useState<AccountInviteVariant>()
  const [completedReservation, setCompletedReservation] = useState<StoredBookingReservation>()
  const [currentScreen, setCurrentScreen] = useState<BookingScreen>("service")
  const [isBookingDraftHydrated, setIsBookingDraftHydrated] = useState(false)
  const [bookingDraftRestoreKey, setBookingDraftRestoreKey] = useState(0)
  const [smsVerificationCode, setSmsVerificationCode] = useState(initialSmsVerificationCode)
  const [transitionState, setTransitionState] = useState<BookingTransitionState>()
  const [selectedServiceId, setSelectedServiceId] = useState<string>()
  const [selectedStaffMemberId, setSelectedStaffMemberId] = useState<string>()
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string>()
  const [bookingConsents, setBookingConsents] = useState<BookingConsents>(emptyBookingConsents)
  const [customerDetails, setCustomerDetails] = useState<BookingCustomerDetails>(emptyCustomerDetails)

  const selectedService = mockBeautyServices.find((service) => service.id === selectedServiceId)
  const availableStaffMembers = selectedService
    ? mockStaffMembers.filter((staffMember) => staffMember.serviceIds.includes(selectedService.id))
    : []
  const selectedStaffMember = availableStaffMembers.find((staffMember) => staffMember.id === selectedStaffMemberId)
  const availableTimeSlots = selectedService
    ? mockTimeSlots.filter((slot) => {
        const matchesService = slot.serviceId === selectedService.id
        const matchesStaff =
          isSoloBusiness || Boolean(selectedStaffMemberId && slot.staffMemberIds.includes(selectedStaffMemberId))

        return matchesService && matchesStaff
      })
    : []
  const selectedTimeSlot = availableTimeSlots.find((slot) => slot.id === selectedTimeSlotId)
  const visibleSteps = isSoloBusiness ? bookingSteps.filter((step) => step.id !== "staff") : bookingSteps
  const isCustomerDetailsComplete = customerDetailsSchema.safeParse(customerDetails).success
  const isReservationDetailsComplete =
    Boolean(selectedService) &&
    (isSoloBusiness || Boolean(selectedStaffMember)) &&
    Boolean(selectedTimeSlot) &&
    isCustomerDetailsComplete
  const isBookingReady = isReservationDetailsComplete && bookingConsents.termsAccepted

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const draft = readBookingDraft()

      if (draft) {
        setSelectedServiceId(draft.selectedServiceId)
        setSelectedStaffMemberId(draft.selectedStaffMemberId)
        setSelectedTimeSlotId(draft.selectedTimeSlotId)
        setCustomerDetails(draft.customerDetails)
        setBookingConsents({
          ...draft.bookingConsents,
          emailNotifications: draft.customerDetails.email ? draft.bookingConsents.emailNotifications : false,
        })
        setCurrentScreen(draft.currentStep)
        setBookingDraftRestoreKey((currentValue) => currentValue + 1)
      }

      setIsBookingDraftHydrated(true)
    }, bookingDraftRestoreDelay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!isBookingDraftHydrated || !isBookingStep(currentScreen)) {
      return
    }

    const hasDraftContent = Boolean(
      selectedServiceId ||
        selectedStaffMemberId ||
        selectedTimeSlotId ||
        bookingConsents.emailNotifications ||
        bookingConsents.phoneNotifications ||
        bookingConsents.termsAccepted ||
        customerDetails.email ||
        customerDetails.firstName ||
        customerDetails.lastName ||
        customerDetails.note ||
        customerDetails.phone
    )

    if (!hasDraftContent) {
      clearBookingDraft()
      return
    }

    saveBookingDraft({
      bookingConsents,
      currentStep: currentScreen,
      customerDetails,
      selectedServiceId,
      selectedStaffMemberId,
      selectedTimeSlotId,
    })
  }, [
    bookingConsents,
    currentScreen,
    customerDetails,
    isBookingDraftHydrated,
    selectedServiceId,
    selectedStaffMemberId,
    selectedTimeSlotId,
  ])

  const resetAfterServiceChange = useCallback(() => {
    setSelectedStaffMemberId(undefined)
    setSelectedTimeSlotId(undefined)
    setBookingConsents(emptyBookingConsents)
    setCustomerDetails(emptyCustomerDetails)
    setCompletedReservation(undefined)
    setAccountInviteVariant(undefined)
  }, [])

  const selectService = useCallback((serviceId: string) => {
    setSelectedServiceId(serviceId)
    resetAfterServiceChange()
  }, [resetAfterServiceChange])

  const selectStaffMember = useCallback((staffMemberId: string) => {
    setSelectedStaffMemberId(staffMemberId)
    setSelectedTimeSlotId(undefined)
    setBookingConsents(emptyBookingConsents)
    setCustomerDetails(emptyCustomerDetails)
    setCompletedReservation(undefined)
    setAccountInviteVariant(undefined)
  }, [])

  const selectTimeSlot = useCallback((timeSlotId: string) => {
    setSelectedTimeSlotId(timeSlotId)
    setCompletedReservation(undefined)
    setAccountInviteVariant(undefined)
  }, [])

  const updateCustomerDetails = useCallback((details: BookingCustomerDetails) => {
    setCustomerDetails(details)
    setBookingConsents((currentConsents) => ({
      ...currentConsents,
      emailNotifications: details.email ? currentConsents.emailNotifications : false,
    }))
    setCompletedReservation(undefined)
    setAccountInviteVariant(undefined)
  }, [])

  const updateBookingConsents = useCallback((consents: BookingConsents) => {
    setBookingConsents({
      ...consents,
      emailNotifications: customerDetails.email ? consents.emailNotifications : false,
    })
    setCompletedReservation(undefined)
    setAccountInviteVariant(undefined)
  }, [customerDetails.email])

  const goToNextStepAfterService = useCallback(() => {
    if (selectedServiceId) {
      setCurrentScreen(isSoloBusiness ? "datetime" : "staff")
    }
  }, [isSoloBusiness, selectedServiceId])

  const canOpenStep = useCallback((step: BookingStep) => {
    if (step === "service") {
      return true
    }

    if (step === "staff") {
      return Boolean(selectedService)
    }

    if (step === "datetime") {
      return Boolean(selectedService) && (isSoloBusiness || Boolean(selectedStaffMember))
    }

    if (step === "customer") {
      return Boolean(selectedTimeSlot)
    }

    if (step === "summary") {
      return isReservationDetailsComplete
    }

    return false
  }, [isReservationDetailsComplete, isSoloBusiness, selectedService, selectedStaffMember, selectedTimeSlot])

  const openStep = useCallback((step: BookingStep) => {
    if (canOpenStep(step)) {
      setCurrentScreen(step)
    }
  }, [canOpenStep])

  const setCurrentStep = useCallback((step: BookingStep) => {
    setCurrentScreen(step)
  }, [])

  const reserve = useCallback(async () => {
    if (!isBookingReady) {
      return
    }

    setTransitionState({
      description: "Za chwilę przejdziesz do potwierdzenia numeru telefonu.",
      title: "Wysyłamy kod SMS",
    })

    await wait(bookingTransitionDelay)
    setSmsVerificationCode(initialSmsVerificationCode)
    setCurrentScreen("verification")
    setTransitionState(undefined)
  }, [isBookingReady])

  const resendSmsCode = useCallback(async () => {
    setTransitionState({
      description: "Wysyłamy nowy kod SMS na podany numer telefonu.",
      title: "Ponownie wysyłamy kod",
    })

    await wait(bookingTransitionDelay)
    setSmsVerificationCode(resentSmsVerificationCode)
    setTransitionState(undefined)
  }, [])

  const verifySmsCode = useCallback(async (code: string) => {
    setTransitionState({
      description: "Sprawdzamy kod i zapisujemy szczegóły Twojej wizyty.",
      title: "Potwierdzamy rezerwację",
    })

    await wait(bookingTransitionDelay)

    if (code !== smsVerificationCode || !selectedService || !selectedTimeSlot || (!isSoloBusiness && !selectedStaffMember)) {
      setTransitionState(undefined)
      return false
    }

    const { reservation } = createStoredReservation({
      consents: bookingConsents,
      customerDetails,
      service: selectedService,
      staffMember: selectedStaffMember,
      timeSlot: selectedTimeSlot,
    })

    setCompletedReservation(reservation)

    if (!isAuthenticated) {
      setAccountInviteVariant(customerDetails.email ? "with-email" : "without-email")
    }

    clearBookingDraft()
    setCurrentScreen("success")
    setTransitionState(undefined)

    return true
  }, [
    bookingConsents,
    customerDetails,
    isAuthenticated,
    isSoloBusiness,
    selectedService,
    selectedStaffMember,
    selectedTimeSlot,
    smsVerificationCode,
  ])

  return {
    actions: {
      canOpenStep,
      goToNextStepAfterService,
      openStep,
      reserve,
      resendSmsCode,
      selectService,
      selectStaffMember,
      selectTimeSlot,
      setCurrentStep,
      updateCustomerDetails,
      updateBookingConsents,
      verifySmsCode,
    },
    accountInviteVariant,
    availableStaffMembers,
    availableTimeSlots,
    bookingConsents,
    bookingDraftRestoreKey,
    completedReservation,
    currentScreen,
    customerDetails,
    isBookingReady,
    isBookingDraftHydrated,
    isCustomerDetailsComplete,
    isReservationDetailsComplete,
    isSoloBusiness,
    smsVerificationCode,
    transitionState,
    services: mockBeautyServices,
    selectedService,
    selectedServiceId,
    selectedStaffMember,
    selectedStaffMemberId,
    selectedTimeSlot,
    selectedTimeSlotId,
    visibleSteps,
  }
}

export { useBookingFlow }
