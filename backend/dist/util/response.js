"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var response = function response(res, data, code, message) {
	res.statusCode = code;
	var response = {
		data: data,
		message: message
	};
	return res.json(response);
};

exports.default = response;