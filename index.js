'use strict';

const fs = require('fs');

/**
 * Bitmap -- receives a file name, used in the transformer to note the new buffer
 * @param filePath
 * @constructor
 */
function Bitmap(filePath) {
  this.file = filePath;
}

/**
 * Parser -- accepts a buffer and will parse through it, according to the specification, creating object properties for each segment of the file
 * @param buffer
 */
Bitmap.prototype.parse = function(buffer) {
  this.buffer = buffer;
  this.type = buffer.toString('utf-8', 0, 2);
  //... and so on

  this.size = buffer.readInt32LE(2);
  this.offset = buffer.readInt32LE(10);
  this.width = buffer.readInt32LE(18);
  this.height = buffer.readInt32LE(22);
  this.bitsPerPixel = buffer.readInt32LE(0x1C);
  this.colorBuffer = buffer.slice(54, this.offset);
  this.pixelBuffer = buffer.slice(this.offset);
};

/**
 * Transform a bitmap using some set of rules. The operation points to some function, which will operate on a bitmap instance
 * @param operation
 */
Bitmap.prototype.transform = function(operation) {
  // This is really assumptive and unsafe
  transforms[operation](this);
  this.newFile = this.file.replace(/\.bmp/, `.${operation}.bmp`);
};

/**
 * Sample Transformer (greyscale)
 * Would be called by Bitmap.transform('greyscale')
 * Pro Tip: Use "pass by reference" to alter the bitmap's buffer in place so you don't have to pass it around ...
 * @param bmp
 */
const flipImage = (bmp) => {
  let flipArr = [];
  var pixelWidth = Math.ceil(bmp.width / 4) * 4;
  console.log(bmp)
  console.log(bmp.pixelBuffer.length)
  console.log(bmp.height * bmp.width)
  for(let i = 0; i < bmp.pixelBuffer.length; i += pixelWidth) {
    flipArr.push(bmp.pixelBuffer.slice(i, i + pixelWidth));
  }
  let newBuffer = Buffer.concat(flipArr.reverse());
  newBuffer.copy(bmp.pixelBuffer);
  console.log(bmp.pixelBuffer.length);
};

const doTheInversion = (bmp) => {
  for(let i = 0; i < bmp.colorBuffer.length; i += 4) {
    bmp.colorBuffer[i] = ~bmp.colorBuffer[i];
    bmp.colorBuffer[i + 1] = ~bmp.colorBuffer[i + 1];
    bmp.colorBuffer[i + 2] = ~bmp.colorBuffer[i + 2];
    bmp.colorBuffer[i + 3] = ~bmp.colorBuffer[i + 3];
  }
};

/**
 * A dictionary of transformations
 * Each property represents a transformation that someone could enter on the command line and then a function that would be called on the bitmap to do this job
 */
const transforms = {
  flip: flipImage,
  invert: doTheInversion,
};

// ------------------ GET TO WORK ------------------- //

function transformWithCallbacks() {

  fs.readFile(file, (err, buffer) => {

    if (err) {
      throw err;
    }

    bitmap.parse(buffer);

    bitmap.transform(operation);

    // Note that this has to be nested!
    // Also, it uses the bitmap's instance properties for the name and thew new buffer
    fs.writeFile(bitmap.newFile, bitmap.buffer, (err, out) => {
      if (err) {
        throw err;
      }
      console.log(`Bitmap Transformed: ${bitmap.newFile}`);
    });

  });
}

// TODO: Explain how this works (in your README)
const [file, operation] = process.argv.slice(2);

let bitmap = new Bitmap(file);


if (!module.parent) {
  transformWithCallbacks();
}

module.exports = {
  Bitmap,
  flipImage,
  doTheInversion,
};