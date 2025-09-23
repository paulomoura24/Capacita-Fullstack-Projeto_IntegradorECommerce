import app from './app.js'
import { config } from './config/env.js'

const port = Number(config.port || process.env.PORT || 3000)
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})