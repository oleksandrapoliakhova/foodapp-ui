const express = require('express');
const path = require('path');
const app = express();
// /Users/poliakhova/foodapp-ui/foodapp-ui
app.use(express.static(__dirname + '/dist/foodapp-ui/foodapp-ui'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname +
    // /Users/poliakhova/foodapp-ui/foodapp-ui/src/index.html
    '/src/index.html'));
});
app.listen(process.env.PORT || 8082);
