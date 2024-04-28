/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{

        STRIPE_PUBLISHABLE_KEY:"pk_live_51Oo8BkAC5IPXkXnPhUFawonhzrf6dzi6mISLy9JvsfuxlFYADYwPZOLMUhyQpEkqyCE30JdSfARC6ZGhMzMYcjl700GG4hIgFQ",
        STRIPE_SECRET_KEY:"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",

        // STRIPE_PUBLISHABLE_KEY:"pk_test_51Oo8BkAC5IPXkXnPFXSJj9eRKdCvJcCcj0yX1zleAFoA9PLFqR9N7aTLimptcw76W79IpEamoNY81RlbMkjPE4YB00KvJbcfgW",
        // STRIPE_SECRET_KEY:"sk_test_51Oo8BkAC5IPXkXnPbGkMZmoXjXLezIzZf3htKqCAd2QetGVcbNXZaFampf2Q4cy44ZOlEegMsSfrdOXcmbNulzlh00AW51IZQ3",


    
    }, images: {
        domains: ['firebasestorage.googleapis.com'],
      },
};

export default nextConfig;

