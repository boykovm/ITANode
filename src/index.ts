import {createServer, IncomingMessage, ServerResponse} from 'http'
import * as fs from 'fs'
import 'body-parser'

const PATH: string = './file/superFile.txt'
const HOSTNAME: string = '127.0.0.1'
const PORT: number = 3000

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/') {
        switch (req.method) {
            case 'GET': {
                fs.readFile(PATH, "utf8", (e, data: string) => {
                    if (e) {
                        console.error(e)
                        res.statusCode = 500
                        res.end()
                    } else {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'text/plain')
                        res.end(`${data}`)
                    }
                })
                break
            }
            case 'POST': {
                let data: string = '';
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    data = JSON.parse(data).data + '\n'
                    fs.writeFile(PATH, data, 'utf-8', (e) => {
                        if (e) {
                            res.statusCode = 500
                            res.end();
                            console.error(e)
                        } else {
                            res.statusCode = 200
                            res.end();
                        }
                    })
                })
                break
            }
            case 'PATCH': {
                let data: string = ''
                req.on('data', chunk => {
                    data += chunk
                })
                req.on('end', () => {
                    data = JSON.parse(data).data + '\n'
                    if (fs.existsSync(PATH)) {
                        fs.appendFile(PATH, data, (e) => {
                            if (e) {
                                console.error(e)
                                res.statusCode = 500
                                res.end()
                            } else {
                                res.statusCode = 200
                                res.end()
                            }
                        })
                    } else {
                        res.statusCode = 500
                        res.end()
                    }
                })
                break
            }
            case 'DELETE': {
                fs.unlink(PATH, (e) => {
                    if (e) {
                        res.statusCode = 500
                        res.end()
                        console.log(e)
                    } else {
                        res.statusCode = 200
                        res.end()
                    }
                });
                break
            }
            default: {
                res.statusCode = 404
                res.end()
            }
        }
    } else {
        res.statusCode = 404
        res.end()
    }
})

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server was running at http://${HOSTNAME}:${PORT}/`)
})