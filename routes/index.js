const express = require('express');
const router = express.Router();

// basic unauthenticated pages
router.get("/", (req, res) => {
  res.render('index', { title: 'Express' });
});
router.get("/about", (req, res) => {
  res.render('about');
});
router.get("/registerForm", (req, res) => {
  res.render('registerForm');
});

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use(function (err, req, res, next) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('404')
  }
});

module.exports = router;
