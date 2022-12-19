const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const Comment = require('./models/comment');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
io.on('connection', (socket) => {
  Comment.watch().on('change', () => {
    socket.emit('RefreshPage', 'emis de backend');
  });
});

server.listen(4007);
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => logger.info('Connected to MongoDB'));

app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
    safeFileName: true,
    useTempFiles: true,
    tempFileDir: 'tmp/',
    parseNested: true,
  })
);

app.use(express.json());

app.use('/public', express.static('public'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/post', require('./routes/post'));
module.exports = app;
