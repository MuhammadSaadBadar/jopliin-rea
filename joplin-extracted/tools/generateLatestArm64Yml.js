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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLatestArm64Yml = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const calculateHash = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha512');
    hashSum.update(fileBuffer);
    return hashSum.digest('base64');
};
const getFileSize = (filePath) => {
    return fs.statSync(filePath).size;
};
const generateLatestArm64Yml = (info, destinationPath) => {
    if (!fs.existsSync(info.dmgPath) || !fs.existsSync(info.zipPath)) {
        throw new Error(`One or both executable files do not exist: ${info.dmgPath}, ${info.zipPath}`);
    }
    if (!info.version) {
        throw new Error('Version is empty');
    }
    if (!destinationPath) {
        throw new Error('Destination path is empty');
    }
    console.info('Calculating hash of files...');
    const dmgHash = calculateHash(info.dmgPath);
    const zipHash = calculateHash(info.zipPath);
    console.info('Calculating size of files...');
    const dmgSize = getFileSize(info.dmgPath);
    const zipSize = getFileSize(info.zipPath);
    console.info('Generating content of latest-mac-arm64.yml file...');
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }
    const yamlFilePath = path.join(destinationPath, 'latest-mac-arm64.yml');
    const yamlContent = `version: ${info.version}
files:
  - url: ${path.basename(info.zipPath)}
    sha512: ${zipHash}
    size: ${zipSize}
  - url: ${path.basename(info.dmgPath)}
    sha512: ${dmgHash}
    size: ${dmgSize}
path: ${path.basename(info.zipPath)}
sha512: ${zipHash}
releaseDate: '${info.releaseDate}'
`;
    fs.writeFileSync(yamlFilePath, yamlContent);
    console.log(`YML file for version ${info.version} was generated successfully at ${destinationPath} for arm64.`);
    const fileContent = fs.readFileSync(yamlFilePath, 'utf8');
    console.log('Generated YML Content:\n', fileContent);
    return yamlFilePath;
};
exports.generateLatestArm64Yml = generateLatestArm64Yml;
//# sourceMappingURL=generateLatestArm64Yml.js.map