
const { app } = require('./app');  

app.set('view engine', 'ejs');

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));