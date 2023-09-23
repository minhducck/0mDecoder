"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const node_readline_1 = __importDefault(require("node:readline"));
const readLineHandler = node_readline_1.default.createInterface({
    input: process.stdin
});
let dataBuffer = Buffer.alloc(0);
const inputBuffer = new Promise((resolve) => {
    let dataBuffer = Buffer.alloc(0);
    readLineHandler.on('line', buf => {
        console.error(buf);
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(buf, 'ascii')]);
        // dataBuffer = Buffer.concat([dataBuffer, line])
    }).on('close', () => resolve(dataBuffer));
});
async function main() {
    // const blob = fs.readFileSync('./taan_server.0m')
    dataBuffer = await inputBuffer;
    console.log("VAI LON", dataBuffer);
    fs.writeSync(process.stdout.fd, dataBuffer);
    // const decodedBuffer = await decryptFileBuffer(dataBuffer)
    // fs.writeSync(process.stdout.fd, decodedBuffer, 0, decodedBuffer.length)
}
main().then(() => process.exit()).catch(err => {
    console.log(err);
    process.exit(1);
});
