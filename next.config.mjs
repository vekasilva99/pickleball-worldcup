/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{

        STRIPE_PUBLISHABLE_KEY:"pk_live_51Oo8BkAC5IPXkXnPhUFawonhzrf6dzi6mISLy9JvsfuxlFYADYwPZOLMUhyQpEkqyCE30JdSfARC6ZGhMzMYcjl700GG4hIgFQ",
        STRIPE_SECRET_KEY:"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",


    
    }, images: {
        domains: ['firebasestorage.googleapis.com'],
      },
};

export default nextConfig;

