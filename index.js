const express = require('express');
const app = express();
const path = require('path');
//setting ejs as the view engine
app.set('view engine', 'ejs');

//getting static files from views and public folders
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//Routes from index.js files in the routes folder will be handled here
//We should organize routes in this way.
const indexRouter = require('./routes/index');
app.use('/',indexRouter);

 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
