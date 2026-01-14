declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

export const loginWithGoogle = () => {
    window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
            console.log("Google ID token:", response.credential);
            // You can send the ID token to your server for verification and authentication
        },
    });

    window.google.accounts.id.prompt(); // popup
};
