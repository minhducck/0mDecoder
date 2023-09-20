import * as fs from 'fs'

const blob = fs.readFileSync('./taan_server.0m')

const magicNumber: number = blob.readUInt32LE(0)
const encryptedBufferLength: number = blob.readUInt32LE(4)
const encryptedBuffer = blob.subarray(8)

console.log(magicNumber.toString(16))
console.log(encryptedBufferLength.toString(16))
console.log(encryptedBuffer)

// Something for decryption
const header = encryptedBuffer.readInt8(0)
const flags = encryptedBuffer.readInt8(1)
const hash = encryptedBuffer.readInt32LE(2)
const encryptedContent = encryptedBuffer.subarray(6)

const remainingContentLength: number = encryptedBufferLength - 6 // v8

console.log({
  header,
  flags,
  hash,
  encryptedContent
})
