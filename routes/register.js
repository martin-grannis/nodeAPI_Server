var express = require('express');
var router = express.Router();

/* register user */


router.post('/register', function(req, res, next) {
	res.locals.connection.query('SELECT * from users where email like "' +res.email+ "'", function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": "found"}));
	});
});

module.exports = router;
