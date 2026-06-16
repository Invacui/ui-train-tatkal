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
