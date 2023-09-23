import * as fs from 'fs'
import { decryptFileBuffer } from './helper'
import path from "path";

async function getDecodedBufferForFile(inputFilePath: string, withHeader: boolean = true) {
  return await decryptFileBuffer(
    fs.readFileSync(path.resolve(inputFilePath)),
    withHeader
  )
}

async function main (inputFilePath: string, outputFilePath: string|boolean = false, withHeader: boolean = true): Promise<void> {
  if(fs.lstatSync(inputFilePath).isDirectory()) {
    for (const filename of fs.readdirSync(inputFilePath)) {
      if (!RegExp('^(.*)\\.0m$').test(filename)) {
        continue;
      }
      if (!outputFilePath || !fs.lstatSync(outputFilePath as string).isDirectory()) {
        throw new Error('Output file path must be declared for batch files and be directory type.');
      }


      fs.writeFileSync(
        path.resolve(outputFilePath as string, filename),
        await getDecodedBufferForFile(path.resolve(inputFilePath, filename), withHeader)
      );
    }
    return;
  }

  const decodedBuffer = await getDecodedBufferForFile(inputFilePath, withHeader);

  if (outputFilePath === false) {
    return fs.writeFileSync(process.stdout.fd, decodedBuffer);
  }

  fs.writeFileSync(path.resolve(outputFilePath as string), decodedBuffer);
}

const inputFile = process.argv[2]
const outputFile = process.argv[3] || false
const withHeader = process.argv[3] === '1'


if (!inputFile) {
  console.error('Please provide input file. cli format: node index.js {inputFile} {!outputFile} {fileWithMagicNumber?}');
  process.exit(1)
}

main(inputFile, outputFile, withHeader).then(() => process.exit()).catch(err => {
  console.log(err); process.exit(1)
})
