import * as fs from 'fs'
import * as crypto from 'crypto'

const blob = fs.readFileSync('./taan_server.0m')
function xor (buf1: Buffer, buf2: Buffer): Uint8Array {
  return buf1.map((b, i) => b ^ buf2[i])
}
function initiateVector (encryptionKey: number) {
  const result: Uint32Array[] = []
  const xorRs = xor(
    Buffer.from(encryptionKey.toString(16), 'hex'),
    Buffer.from('8473FBC1', 'hex')
  )

  result[0] = new Uint32Array((new DataView(xorRs.buffer)).getUint32(0))
  for (let i = 1; i < 16; i++) {
    result[i] = result[i - 1] - 2072773695
  }

  return result
}

const decryptBuffer = (dest: Buffer, src: Buffer, length: number, encryptionKey: number) => {
  const iv = initiateVector(encryptionKey)
  console.log(iv)
  const algorithm = 'DES-CBC'
  // use a hex key here
  const key = Buffer.from(encryptionKey.toString(16), 'hex')
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(src)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  console.log('Decrypted: ', decrypted)
}

const magicNumber: number = blob.readUInt32LE(0)
const encryptedBufferLength: number = blob.readUInt32LE(4)
const encryptedBuffer = blob.subarray(8)

console.log(magicNumber.toString(16))
console.log(encryptedBufferLength.toString(16))
console.log(encryptedBuffer)

// Something for decryption
const header = encryptedBuffer.readInt8(0)
const flags = encryptedBuffer.readInt8(1)
const keyToDecodeToInflateBuffer = encryptedBuffer.readInt32LE(2)
let encryptedContent = encryptedBuffer.subarray(6)

let totalRemainingEncryptedLength: number = encryptedBufferLength - 6 // v8

const isBufferEncrypted: boolean = (flags & 2) !== 0
const isBufferCompressed: boolean = (flags & 1) === 1

let encryptionKey: number = 0
let decryptedBufferSize = 0

if (isBufferEncrypted) {
  encryptionKey = encryptedContent.readUInt32LE(0)
  encryptedContent = encryptedContent.subarray(4)
  totalRemainingEncryptedLength -= 4
}

if (isBufferCompressed) {
  decryptedBufferSize = encryptedContent.readUInt32LE(0)
  encryptedContent = encryptedContent.subarray(4)
  totalRemainingEncryptedLength -= 4
}

if (isBufferEncrypted && isBufferCompressed) {
  const decryptedBuffer = Buffer.alloc(totalRemainingEncryptedLength).fill(0)
  decryptBuffer(decryptedBuffer, encryptedContent, totalRemainingEncryptedLength, encryptionKey)
}

console.log({
  header,
  flags,
  keyToDecodeToInflateBuffer,
  encryptionKey: encryptionKey.toString(16),
  encryptedContent
})
