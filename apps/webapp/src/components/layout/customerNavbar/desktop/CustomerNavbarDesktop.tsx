import { CustomerNavbarDesktopActions } from "@/components/layout/customerNavbar/desktop/CustomerNavbarDesktopActions";
import { CustomerNavbarDesktopNavigation } from "@/components/layout/customerNavbar/desktop/CustomerNavbarDesktopNavigation";

export const CustomerNavbarDesktop = () => {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:flex">
        <div className="pointer-events-auto">
          <CustomerNavbarDesktopNavigation />
        </div>
      </div>

      <div className="ml-auto hidden shrink-0 items-center gap-4 xl:flex">
        <CustomerNavbarDesktopActions />
      </div>
    </>
  );
};
