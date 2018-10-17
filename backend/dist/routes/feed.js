'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _response = require('../util/response');

var _response2 = _interopRequireDefault(_response);

var _db_helpers = require('../util/db_helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var feedRouter = _express2.default.Router();

feedRouter.get('/', function (req, res) {
	_db_helpers.Feed.getAll().then(function (feed) {
		return (0, _response2.default)(res, { feed: feed }, 200, 'All Feeds');
	}).catch(function (err) {
		return (0, _response2.default)(res, {}, 500, 'Failed to get all feeds');
	});
});

exports.default = feedRouter;