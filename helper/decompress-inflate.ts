import { inflate } from 'zlib'

export const decompressInflate = async (encryptedContent: Buffer, decryptedBufferSize: number): Promise<Buffer> =>
  await new Promise<Buffer>((resolve, reject) => {
    inflate(encryptedContent, (error, result) => {
      if (error !== null) {
        reject(error)
        return
      }

      resolve(result)
    })
  })
