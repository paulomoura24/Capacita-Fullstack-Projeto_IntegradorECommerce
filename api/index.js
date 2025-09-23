export default async function handler(req, res) {
    try {
        const mod = await import('../src/app.js');
        const app = mod?.default;
        if (typeof app !== 'function') {
            throw new Error('Express app default export ausente em src/app.js');
        }
        return app(req, res);
    } catch (e) {
        console.error('[BOOT ERROR]', e);
        res.statusCode = 500;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({
            ok: false,
            message: String(e?.message || e),
            where: 'api/index.js handler',
        }));
    }
}
