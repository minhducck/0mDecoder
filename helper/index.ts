import { generate512BitsBlock } from './construct-encryption-blocks'
import { decompressInflate } from './decompress-inflate'

export * from './decompress-inflate'

export const decryptBuffer = (src: Buffer, length: number, encryptionKey: number): Buffer => {
  const dest = Buffer.alloc(length)
  const encryption64BytesKey = generate512BitsBlock(encryptionKey)

  let processedLength = 0
  let bufferIndex = 0

  while (processedLength < length) {
    for (let i = 0; i < encryption64BytesKey.length; i++) {
      dest[bufferIndex] = src[bufferIndex] ^ encryption64BytesKey[i]
      bufferIndex++
    }
    processedLength += 64
  }

  return dest
}

export const decryptFileBuffer = async (fileBuffer: Buffer): Promise<Buffer> => {
  const magicNumber: number = fileBuffer.readUInt32LE(0)
  const encryptedBufferLength: number = fileBuffer.readUInt32LE(4)
  const encryptedBuffer = fileBuffer.subarray(8)

  const header = encryptedBuffer.readInt8(0)
  const flags = encryptedBuffer.readInt8(1)
  const keyToDecodeToInflateBuffer = encryptedBuffer.readInt32LE(2)

  console.log({
    fileBuffer,
    magicNumber,
    header,
    flags,
    keyToDecodeToInflateBuffer
  })

  if (header !== 83) {
    throw new Error('File has not encrypted nor compressed by 0m Format.')
  }

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
    encryptedContent = decryptBuffer(encryptedContent, totalRemainingEncryptedLength, encryptionKey)
  }

  return await decompressInflate(encryptedContent, decryptedBufferSize)
}
