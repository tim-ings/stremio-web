/* eslint-disable */ 

const express = require('express');

const path = __dirname + '/public';
const port = 3000;

express()
  .use(express.static(path))
  .get('*', (request, response) => response.sendFile(path + '/index.html'))
  .listen(port);
