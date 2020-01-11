import UPNG from 'upng-js';
import downloadjs from 'downloadjs';
import framePrepare from './framePrepare';

function saveImg() {
  const dataObj = framePrepare();
  const { ctxDataArr, delay, actualSize } = dataObj;

  const bufferArr = [];
  const delayArr = [];
  for (let i = 0; i < ctxDataArr.length; i += 1) {
    bufferArr.push(ctxDataArr[i].data.buffer);
    delayArr.push(delay);
  }
  const result = UPNG.encode(bufferArr, actualSize, actualSize, 0, delayArr);
  downloadjs(result, 'apng-img.apng', 'apng');
}

export default function apngExport() {
  const apngExportBtn = document.querySelector('.apng-export-btn');
  apngExportBtn.addEventListener('click', () => {
    saveImg();
  });
}
