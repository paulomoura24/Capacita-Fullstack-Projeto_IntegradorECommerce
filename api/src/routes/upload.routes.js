import multer from 'multer'

const MAX_MB = Number(process.env.UPLOAD_MAX_MB || 30)

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_MB * 1024 * 1024 },
})


export function uploadImage(req, res, next) {
    const handler = upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
    ])

    handler(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400
            return res.status(status).json({
                message:
                    err.code === 'LIMIT_FILE_SIZE'
                        ? `Arquivo muito grande. Máximo permitido: ${MAX_MB}MB`
                        : `Erro de upload: ${err.code}`,
                code: err.code,
                maxMB: MAX_MB,
            })
        } else if (err) {
            return next(err)
        }


        const fImage = req.files?.image?.[0]
        const fFile = req.files?.file?.[0]
        req.file = fImage || fFile || null

        next()
    })
}
