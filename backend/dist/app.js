'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _posts = require('./routes/posts');

var _posts2 = _interopRequireDefault(_posts);

var _comments = require('./routes/comments');

var _comments2 = _interopRequireDefault(_comments);

var _like = require('./routes/like');

var _feed = require('./routes/feed');

var _feed2 = _interopRequireDefault(_feed);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _db = require('./util/db');

var _db2 = _interopRequireDefault(_db);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var storage = _multer2.default.diskStorage({
	destination: './public/images/uploads',
	filename: function filename(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + _path2.default.extname(file.originalname));
	}
});

var io = new _socket2.default();
io.on('connection', function (client) {
	client.on('click_like', function (data) {
		(0, _like.toggleLike)(data, client);
	});
});
io.listen(8000);

app.use(_bodyParser2.default.json()); // to support JSON-encoded bodies
app.use(_bodyParser2.default.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

app.use((0, _morgan2.default)('dev'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var upload = (0, _multer2.default)({ storage: storage }).single('post_file');

app.use('/feed', _feed2.default);
app.use('/posts', upload, _posts2.default);
app.use('/comments', _comments2.default);

app.get('/public/images/uploads/:image_name', function (req, res) {
	res.sendFile(_path2.default.resolve(__dirname + '/../public/images/uploads/' + req.params.image_name));
});

// Connect to MySQL on start
_db2.default.connect(function (err) {
	if (err) {
		console.log('Unable to connect to MySQL.\n' + err);
		process.exit(1);
	} else {
		_http2.default.createServer(app).listen(4000, function () {
			console.log('Express server started on port 4000...');
		});
	}
});