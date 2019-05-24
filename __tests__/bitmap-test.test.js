'use strict';

const fs = require('fs');
const util = require('util');
const fsReadFile = util.promisify(fs.readFile);

const Bitmap = require('../index').Bitmap;

const bmpPath = `${__dirname}/../assets/baldy.bmp`;

describe('Bitmap Module', () => {
  it('can parse a file!', async () => {
    const buffer = await fsReadFile(bmpPath);
    expect(buffer).toBeDefined();

    let bitmap = new Bitmap(bmpPath);

    bitmap.parse(buffer);

    expect(bitmap.buffer).toBe(buffer);
    expect(bitmap.type).toBe('BM');

    expect(bitmap.size).toBe(15146);
    expect(bitmap.offset).toBe(0x47A);

    expect(bitmap.width).toBe(0x6E);
    expect(bitmap.height).toBe(0x7D);

    expect(bitmap.bitsPerPixel).toBe(8);

    expect(bitmap.colorBuffer).toBeDefined();
    expect(bitmap.pixelBuffer).toBeDefined();
  });
});