'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectionConfig = {
	host: 'localhost',
	user: 'nodeuser',
	password: 'password',
	database: 'social_media',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
};

var connection = _mysql2.default.createConnection(connectionConfig);

exports.default = connection;