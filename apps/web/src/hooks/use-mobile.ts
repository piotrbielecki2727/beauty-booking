import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768

const getIsMobileSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT

const getServerIsMobileSnapshot = () => false

const subscribeToMobileBreakpoint = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {}
  }

  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)

  return () => mql.removeEventListener("change", callback)
}

const useIsMobile = () => (
  useSyncExternalStore(
    subscribeToMobileBreakpoint,
    getIsMobileSnapshot,
    getServerIsMobileSnapshot
  )
)

export { useIsMobile }
