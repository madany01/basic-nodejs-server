const fs = require('fs/promises')
const path = require('path')
const http = require('http')

const port = process.env.SERVER_PORT || 3000

let cachedFiles = new Map()

async function getDirFiles(dirPath) {
  const filesInDir = await fs.readdir(dirPath)
  const contents = await Promise.all(
    filesInDir.map(async file => {
      const fileName = path.basename(file, path.extname(file))
      return [fileName, await fs.readFile(path.join(dirPath, file), 'utf-8')]
    })
  )

  return Object.fromEntries(contents)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `https://${req.headers.host}`)

  const pathName = url.pathname.slice(1) || 'index'

  res.setHeader('Content-Type', 'text/html')

  if (!cachedFiles.has(pathName) || pathName === '404') {
    res.statusCode = 404
    res.end(cachedFiles.get('404'))
    return
  }

  res.end(cachedFiles.get(pathName))
})

async function main() {
  cachedFiles = new Map(Object.entries(await getDirFiles('./pages')))

  server.listen(port, () => {
    console.log(`server starts listening on port ${port}`)
  })
}
main()
