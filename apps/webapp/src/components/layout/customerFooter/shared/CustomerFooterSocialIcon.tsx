import type { CustomerFooterSocial } from "@/components/layout/customerFooter/customerFooterTypes";

type CustomerFooterSocialIconProperties = {
  icon: CustomerFooterSocial["icon"];
};

export const CustomerFooterSocialIcon = ({
  icon,
}: CustomerFooterSocialIconProperties) => {
  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d="M14 8.2H16V5H13.6C10.9 5 9.4 6.6 9.4 9.1V11H7V14.2H9.4V20H12.9V14.2H15.4L15.9 11H12.9V9.4C12.9 8.6 13.2 8.2 14 8.2Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d="M8.2 4H15.8C18.4 4 20 5.6 20 8.2V15.8C20 18.4 18.4 20 15.8 20H8.2C5.6 20 4 18.4 4 15.8V8.2C4 5.6 5.6 4 8.2 4ZM8.3 6C6.9 6 6 6.9 6 8.3V15.7C6 17.1 6.9 18 8.3 18H15.7C17.1 18 18 17.1 18 15.7V8.3C18 6.9 17.1 6 15.7 6H8.3ZM12 8.2C14.1 8.2 15.8 9.9 15.8 12C15.8 14.1 14.1 15.8 12 15.8C9.9 15.8 8.2 14.1 8.2 12C8.2 9.9 9.9 8.2 12 8.2ZM12 10.1C11 10.1 10.1 11 10.1 12C10.1 13 11 13.9 12 13.9C13 13.9 13.9 13 13.9 12C13.9 11 13 10.1 12 10.1ZM16 7.6C16.6 7.6 17 8 17 8.6C17 9.2 16.6 9.6 16 9.6C15.4 9.6 15 9.2 15 8.6C15 8 15.4 7.6 16 7.6Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "pinterest") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d="M12.3 4C7.9 4 5.5 7 5.5 10.2C5.5 12.1 6.5 13.8 8.1 14.5C8.4 14.6 8.6 14.5 8.7 14.2L9 13C9.1 12.7 9.1 12.6 8.9 12.3C8.4 11.7 8.1 11 8.1 10C8.1 7.8 9.8 5.8 12.5 5.8C14.9 5.8 16.2 7.3 16.2 9.2C16.2 11.8 15 14 13.4 14C12.5 14 11.8 13.2 12 12.3C12.3 11.2 12.8 10 12.8 9.2C12.8 8.5 12.4 7.9 11.6 7.9C10.7 7.9 10 8.8 10 10.1C10 10.9 10.3 11.4 10.3 11.4L9.1 16.4C8.8 17.7 9 19.2 9 20C9 20.2 9.3 20.3 9.4 20.1C9.9 19.5 10.7 18.3 11 17.1L11.6 14.9C12 15.6 13 16.2 14.1 16.2C17.3 16.2 19.5 13.2 19.5 9.4C19.5 6.5 17 4 12.3 4Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d="M14.7 4C15 6.2 16.3 7.6 18.4 7.8V10.8C17 10.8 15.8 10.4 14.8 9.7V15.1C14.8 18 12.9 20 10.1 20C7.6 20 5.6 18.2 5.6 15.8C5.6 13.2 7.7 11.4 10.5 11.4C10.8 11.4 11.1 11.4 11.4 11.5V14.5C11.1 14.4 10.8 14.3 10.5 14.3C9.5 14.3 8.7 14.9 8.7 15.8C8.7 16.7 9.4 17.3 10.3 17.3C11.2 17.3 11.8 16.7 11.8 15.5V4H14.7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M20.2 7.4C20 6.5 19.3 5.8 18.4 5.6C16.8 5.2 12 5.2 12 5.2C12 5.2 7.2 5.2 5.6 5.6C4.7 5.8 4 6.5 3.8 7.4C3.5 9 3.5 12 3.5 12C3.5 12 3.5 15 3.8 16.6C4 17.5 4.7 18.2 5.6 18.4C7.2 18.8 12 18.8 12 18.8C12 18.8 16.8 18.8 18.4 18.4C19.3 18.2 20 17.5 20.2 16.6C20.5 15 20.5 12 20.5 12C20.5 12 20.5 9 20.2 7.4ZM10.3 14.8V9.2L15 12L10.3 14.8Z"
        fill="currentColor"
      />
    </svg>
  );
};
