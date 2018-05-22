const express = require('express');
const axios = require('axios');
const path = require('path');

const keys = require('./config/keys.js');

const app = express();

const token = keys.hhwcToken;
const url = 'https://dev.hiphopwordcount.com:443/api/lyrics/?q=';
let query = 'gold';

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/:query", function(req, res) {
  let query = req.params.query;
  axios.get(url + query,
    {
      headers: { 'Authorization': 'Token ' + token }
    })
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
