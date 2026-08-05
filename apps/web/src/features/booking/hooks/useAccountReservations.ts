"use client"

import { useSyncExternalStore } from "react"

import type { StoredBookingReservation } from "@/features/booking/types/reservation"
import {
  getStoredReservations,
  getStoredReservationsByAccountId,
  reservationsChangeEventName,
  reservationsStorageKey,
} from "@/features/booking/utils/reservationStorage"

let cachedAccountId = ""
let cachedRawReservations: string | null | undefined
let cachedReservations: StoredBookingReservation[] = []
let cachedRawAllReservations: string | null | undefined
let cachedAllReservations: StoredBookingReservation[] = []
const emptyReservations: StoredBookingReservation[] = []

const subscribeToReservations = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(reservationsChangeEventName, onStoreChange)

  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(reservationsChangeEventName, onStoreChange)
  }
}

const getReservationsServerSnapshot = () => emptyReservations

const getReservationsSnapshot = (accountId: string) => {
  if (typeof window === "undefined" || !accountId) {
    return emptyReservations
  }

  const rawReservations = window.localStorage.getItem(reservationsStorageKey)

  if (rawReservations === cachedRawReservations && accountId === cachedAccountId) {
    return cachedReservations
  }

  cachedAccountId = accountId
  cachedRawReservations = rawReservations
  cachedReservations = getStoredReservationsByAccountId(accountId)

  return cachedReservations
}

const getAllReservationsSnapshot = () => {
  if (typeof window === "undefined") {
    return emptyReservations
  }

  const rawReservations = window.localStorage.getItem(reservationsStorageKey)

  if (rawReservations === cachedRawAllReservations) {
    return cachedAllReservations
  }

  cachedRawAllReservations = rawReservations
  cachedAllReservations = getStoredReservations()

  return cachedAllReservations
}

const useAccountReservations = (accountId: string) =>
  useSyncExternalStore(
    subscribeToReservations,
    () => getReservationsSnapshot(accountId),
    getReservationsServerSnapshot
  )

const useStoredReservations = () =>
  useSyncExternalStore(
    subscribeToReservations,
    getAllReservationsSnapshot,
    getReservationsServerSnapshot
  )

export { useAccountReservations, useStoredReservations }
