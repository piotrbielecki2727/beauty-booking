type BookingConsents = {
  emailNotifications: boolean
  phoneNotifications: boolean
  termsAccepted: boolean
}

const emptyBookingConsents: BookingConsents = {
  emailNotifications: false,
  phoneNotifications: false,
  termsAccepted: false,
}

export { emptyBookingConsents }
export type { BookingConsents }
