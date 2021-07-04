import {createServer, IncomingMessage, ServerResponse} from 'http'
import * as fs from 'fs'
import 'body-parser'
const PATH = './file/superFile.txt'


const hostname = '127.0.0.1'
const port = 3000

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    switch (req.url) {
        case '/': {
            if (req.method === 'GET'){
                try {
                    fs.readFile(PATH, "utf8", (e, data) => {
                        if (e) {
                            res.statusCode = 500
                            res.end()
                            throw e
                        }
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'text/plain')
                        res.end(`${data}`)
                    })
                } catch (e) {
                    console.error(e)
                }

            } else if (req.method === 'POST') {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    data = JSON.parse(data).data + '\n'
                    fs.writeFile(PATH, data, 'utf-8', (e) => {
                        if (e) {
                            res.statusCode = 500
                            res.end();
                            throw e
                        }
                        res.statusCode = 200
                        res.end();
                    })
                })
            } else if (req.method === 'PATCH') {
                let data = ''
                req.on('data', chunk => {
                    data += chunk
                })
                req.on('end', () => {
                    data = JSON.parse(data).data + '\n'
                    try {
                        if (fs.existsSync(PATH)) {
                            fs.appendFile(PATH, data, (e) => {
                                if (e) {
                                    throw e
                                }
                                res.statusCode = 200
                                res.end()
                            })

                            res.statusCode = 200
                            res.end();
                        } else {
                            throw new Error('file not exists')
                        }
                    } catch (e) {
                        console.error(e)
                        res.statusCode = 500
                        res.end();

                    }
                })
            } else if (req.method === 'DELETE'){
                try {
                    fs.unlink(PATH, (e) => {
                        if (e) {
                            throw e
                        }
                        res.statusCode = 200
                        res.end()
                    });
                } catch (e) {
                    console.error(e)
                    res.statusCode = 500
                    res.end()
                }
            } break
        }
        default: {
            res.statusCode = 404
            res.end()
        }
    }
})


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})