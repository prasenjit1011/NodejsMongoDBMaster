const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const crypto = require('crypto');

const { filePath } = workerData;

function computeChecksum(path) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(path);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

computeChecksum(filePath)
  .then((checksum) => {
    parentPort.postMessage({ filePath, checksum });
  })
  .catch((err) => {
    parentPort.postMessage({ error: err.message });
  });
