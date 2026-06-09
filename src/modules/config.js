export async function loadConfig() {
    try {
        const response = await fetch('/config.json', {
            cache: 'no-store'
        });
        if (response.status === 204 || response.status === 304) {
            throw new Error('Empty config response');
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
            throw new Error('Empty config body');
        }

        return JSON.parse(text);
    } catch (err) {
        console.warn('Using fallback config:', err);
        return {
            VITE_BACKEND_API_URL: window.location.origin
        };
    }
}