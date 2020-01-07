export default function colorConvert(data) {
  let base = data;
  let hexStr = '';
  base = base.split(',');
  base.length = 3;

  base.forEach((k) => {
    const val = +k;
    let num = val.toString(16);
    if (num === '0') num = '00';
    if (num.length < 2) num = `0${num}`;
    hexStr += num;
  });

  hexStr = (hexStr === '000000') ? '#ffffff' : `#${hexStr}`;
  return hexStr;
}
