'use strict';

const flip = require('../../index').flipImage;

describe('flip transform', () => {
  it('works for row size requiring padding', () => {
    var bmp = {
      width: 5,
      height: 4,
      pixelBuffer: new Buffer([
        /* pixels        padding to multiple of 4 */
        0, 1, 2, 3, 4,   0, 0, 0,
        2, 4, 6, 8, 0,   0, 0, 0,
        9, 7, 5, 3, 1,   0, 0, 0,
        4, 6, 8, 6, 4,   0, 0, 0,
      ])
    };
  
    flip(bmp);
  
    expect(bmp.pixelBuffer).toEqual(new Buffer([
      4, 6, 8, 6, 4,   0, 0, 0,
      9, 7, 5, 3, 1,   0, 0, 0,
      2, 4, 6, 8, 0,   0, 0, 0,
      0, 1, 2, 3, 4,   0, 0, 0,
    ]));
  });
  
  it('works for row size not requiring padding', () => {
    var bmp = {
      width: 4,
      height: 3,
      pixelBuffer: new Buffer([
        /* pixels        padding to multiple of 4 */
        0, 1, 2, 3,
        2, 4, 6, 8,
        9, 7, 5, 3,
      ])
    };
  
    flip(bmp);
  
    expect(bmp.pixelBuffer).toEqual(new Buffer([
      9, 7, 5, 3,
      2, 4, 6, 8,
      0, 1, 2, 3,
    ]));
  });
});
