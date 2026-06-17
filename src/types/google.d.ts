/**
 * @file Google Sign-In type declarations
 * @description Augments the global Window interface with the Google accounts API for Google Sign-In
 * @module types
 */

export {};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: 'outline' | 'filled_black' | 'filled_blue'; size?: 'large' | 'medium' | 'small'; width?: string }
          ) => void;
        };
      };
    };
  }
}
