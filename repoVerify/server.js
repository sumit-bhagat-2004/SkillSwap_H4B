const express = require('express');
const routes = require('./app/routes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
