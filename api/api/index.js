import app from '../src/app.js';

export default function handler(req, res) {
    req.url = req.url.replace(/^\/api/, '') || '/';
    return app(req, res);
}