const express = require('express');
const app = express();
app.use(express.static(`${__dirname}/GUI`))
app.listen(process.env.WEB_PORT, () => {
    console.log(`listening on port ${process.env.WEB_PORT}`);
});