import React from "react";

export function EmailIcon({ className = "text-dark-6 dark:text-dark-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 4.16666H2.5C1.57953 4.16666 0.833336 4.91285 0.833336 5.83332V14.1667C0.833336 15.0871 1.57953 15.8333 2.5 15.8333H17.5C18.4205 15.8333 19.1667 15.0871 19.1667 14.1667V5.83332C19.1667 4.91285 18.4205 4.16666 17.5 4.16666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.1667 5.83331L10 11.6666L0.833336 5.83331"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PasswordIcon({ className = "text-dark-6 dark:text-dark-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8333 9.16666H4.16667C3.24619 9.16666 2.5 9.91285 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91285 16.7538 9.16666 15.8333 9.16666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83334 9.16666V5.83332C5.83334 4.72826 6.27232 3.66845 7.05372 2.88705C7.83512 2.10565 8.89493 1.66666 10 1.66666C11.1051 1.66666 12.1649 2.10565 12.9463 2.88705C13.7277 3.66845 14.1667 4.72826 14.1667 5.83332V9.16666"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.00006 4.31641L4.31647 7.63281L10.9493 1.00001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon({ className = "text-dark-6 dark:text-dark-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33334 14.9493 3.33334 15.8333V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 9.16667C12.3012 9.16667 14.1667 7.30119 14.1667 5C14.1667 2.69881 12.3012 0.833336 10 0.833336C7.69881 0.833336 5.83334 2.69881 5.83334 5C5.83334 7.30119 7.69881 9.16667 10 9.16667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.6 10.23c0-.71-.06-1.4-.18-2.05H10v3.88h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.36z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.22-2.51c-.9.6-2.04.95-3.4.95-2.6 0-4.81-1.76-5.6-4.12H1.08v2.6C2.73 17.76 6.1 20 10 20z"
        fill="#34A853"
      />
      <path
        d="M4.4 11.9c-.2-.6-.31-1.24-.31-1.9s.11-1.3.31-1.9V5.5H1.08A9.97 9.97 0 0 0 0 10c0 1.61.39 3.14 1.08 4.5l3.32-2.6z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.98c1.47 0 2.79.5 3.82 1.49l2.87-2.87C14.95 1.05 12.69 0 10 0 6.1 0 2.73 2.24 1.08 5.5l3.32 2.6C5.19 5.74 7.4 3.98 10 3.98z"
        fill="#EA4335"
      />
    </svg>
  );
}
