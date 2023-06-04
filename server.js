const express = require('express');
const path = require('path');
const app = express();
app.use(express.static('public'));
// /Users/poliakhova/foodapp-ui/foodapp-ui
app.use(express.static(__dirname + '/dist/foodapp-ui/'));
app.get('*', function (req, res, next) {
  res.sendFile('index.html', {root: './dist'});

});
app.listen(process.env.PORT || 8082);
