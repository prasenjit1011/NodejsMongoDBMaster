console.clear();
const express = require('express');
const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

const app = express();
const PORT = 3000;

app.post('/upload', (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file, info) => {
    const { filename } = info;
    const saveTo = path.join(__dirname, 'uploads', filename);

    const writeStream = fs.createWriteStream(saveTo);
    file.pipe(writeStream);

    writeStream.on('close', () => {
      const worker = new Worker('./uploadfileProcessor.js', {
        workerData: { filePath: saveTo },
      });

      worker.on('message', (msg) => {
        console.log('Worker finished:', msg);
        res.status(200).send('File uploaded and processed');
      });

      worker.on('error', (err) => {
        console.error('Worker error:', err);
        res.status(500).send('Worker failed');
      });
    });
  });

  req.pipe(busboy);
});

app.listen(PORT, () => {
  console.log(`Worker ${process.pid} running on port ${PORT}`);
});
