export function generate512BitsBlock (encryptionKey: number): Buffer {
  const result: bigint[] = []
  result[0] = BigInt(encryptionKey ^ 0x8473FBC1)

  for (let i = 1; i < 16; i++) {
    result[i] = result[i - 1] - BigInt(2072773695)
  }

  return result.reduce((previousValue, currentValue, currentIndex) => {
    const dataView = new DataView(new ArrayBuffer(4))
    dataView.setUint32(0, Number(currentValue))

    previousValue.writeBigInt64LE(currentValue, 4 * currentIndex)
    return previousValue
  }, Buffer.alloc(4 * 17)).subarray(0, 4 * 16)
}
