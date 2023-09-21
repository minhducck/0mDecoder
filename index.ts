import * as fs from 'fs'
import { decryptFileBuffer } from './helper'

async function main (): Promise<void> {
  const blob = fs.readFileSync('./taan_server.0m')
  const decodedBuffer = await decryptFileBuffer(blob)
  fs.writeFileSync('./taan_server.0m.de', decodedBuffer)
}

main().then(() => process.exit()).catch(err => {
  console.log(err); process.exit(1)
})
