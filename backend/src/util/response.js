const response = (res, data, code, message) => {
	res.statusCode = code;
	const response = {
		data,
		message,
	};
	return res.json(response);
};

export default response;