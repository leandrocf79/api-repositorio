import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.github.com/', // "repository_url": "https://api.github.com/repos/{owner}/{repo}",
});

export default api;

