import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const JimpPkg = require('jimp');
const Jimp = JimpPkg.Jimp || JimpPkg.default || JimpPkg;

async function inspect() {
    try {
        console.log('Creating Jimp instance...');
        const card = new Jimp({ width: 100, height: 100 });
        console.log('Card created.');
        console.log('Card keys:', Object.keys(card));
        console.log('Card prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(card)));

        console.log('Has write:', typeof card.write);
        console.log('Has writeAsync:', typeof card.writeAsync);
        console.log('Has save:', typeof card.save);
    } catch (e) {
        console.error('Error:', e);
    }
}

inspect();
