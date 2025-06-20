export default class ConfigService {
    static get baseURL() {
        const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        // 確保 URL 以 / 結尾
        return url.endsWith('/') ? url : url + '/';
    }
}
