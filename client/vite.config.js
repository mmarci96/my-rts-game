import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/socket.io': {
                target: 'http://localhost:8080', // Backend WebSocket server
                ws: true, // Enable WebSocket proxying
                changeOrigin: true, // Adjust the origin header for cross-origin requests
            },
            '/api': {
                target: 'http://localhost:8080', // Backend API server
                changeOrigin: true,
            },
        },
    },
    define: {
        'process.env.VITE_LOCAL': JSON.stringify(process.env.VITE_LOCAL === 'true'), 
    },
});
