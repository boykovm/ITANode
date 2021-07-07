import {createServer, IncomingMessage, ServerResponse} from 'http'
import * as fs from 'fs'
import 'body-parser'
import {keys} from "./keys"


const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url !== '/') {
        res.statusCode = 404
        res.end()
        return
    }
    switch (req.method) {
        case 'GET': {
            fs.readFile(keys.PATH, keys.ENCODING, (e, data) => {
                if (e) {
                    console.error(e)
                    res.statusCode = 500
                    res.end()
                    return
                }
                res
                    .writeHead(200, {
                        'Content-Type': 'text/plain'
                    })
                    .end(`${data}`)
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
                fs.writeFile(keys.PATH, data, keys.ENCODING, (e) => {
                    if (e) {
                        res.statusCode = 500
                        res.end();
                        console.error(e)
                        return
                    }
                    res.statusCode = 200
                    res.end();
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
                if (fs.existsSync(keys.PATH)) {
                    fs.appendFile(keys.PATH, data, (e) => {
                        if (e) {
                            console.error(e)
                            res.statusCode = 500
                            res.end()
                            return
                        }
                        res.statusCode = 200
                        res.end()
                    })
                    return
                }
                res.statusCode = 500
                res.end()
            })
            break
        }
        case 'DELETE': {
            fs.unlink(keys.PATH, (e) => {
                if (e) {
                    res.statusCode = 500
                    res.end()
                    console.log(e)
                    return
                }
                res.statusCode = 200
                res.end()
            })
            break
        }
        default: {
            res.statusCode = 404
            res.end()
        }
    }
    return
})


server.listen(keys.PORT, keys.HOSTNAME, () => {
    console.log(`Server was running at http://${keys.HOSTNAME}:${keys.PORT}/`)
})