import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const JimpPkg = require('jimp');

console.log('Keys of Jimp package:', Object.keys(JimpPkg));
if (JimpPkg.default) {
    console.log('Keys of Jimp.default:', Object.keys(JimpPkg.default));
}
if (JimpPkg.Jimp) {
    console.log('Keys of Jimp.Jimp (static):', Object.keys(JimpPkg.Jimp));
    console.log('Prototype keys:', Object.getOwnPropertyNames(JimpPkg.Jimp.prototype));
}
