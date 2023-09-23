# 0mDecoder
Decode 0m content files


## Command Format
```BASH
  yarn --silent ts-node index.ts {inputFileName|inputFileDir} {outputFile|outputFileDir} {1: fileWithMagicNumber(27AA)|0: fileWithoutMagicNumber}
```
## Sample commands

```BASH
yarn --silent ts-node index.ts ./0mFiles/DataSub ./0mFiles/DataSub/decoded 0
```