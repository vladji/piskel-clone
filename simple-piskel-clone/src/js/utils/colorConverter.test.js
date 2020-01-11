/* eslint-disable no-undef */
import func from './colorConvert';

describe('color converter', () => {
  let res;
  let data;
  beforeEach(() => {
    res = func(data);
  });

  data = '0, 0, 0, 0';
  it('result should be String', () => {
    expect(typeof res).toBe('string');
  });

  data = '0, 0, 0, 0';
  it('1 char should be \'#\'', () => {
    expect(res[0]).toEqual('#');
  });

  data = '0, 0, 0, 0';
  it('0, 0, 0, 0 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });

  data = '0, 0, 0, 255';
  it('0, 0, 0, 255 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });

  data = '255, 255, 255, 255';
  it('255, 255, 255, 255 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });

  data = '193, 10, 230, 255';
  it('193, 10, 230, 255 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });

  data = '12, 245, 19, 255';
  it('12, 245, 19, 255 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });

  data = '206, 64, 64, 255';
  it('206, 64, 64, 255 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });

  data = '64, 74, 206, 255';
  it('64, 74, 206, 255 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });

  data = '196, 206, 64, 255';
  it('196, 206, 64, 255 should be string with length = 7', () => {
    expect(res.length).toEqual(7);
  });
});
