let Parser = require('rss-parser');
let parser = new Parser();
let feedUrl = `https://www.upwork.com/ab/feed/topics/rss?securityToken=742b421b7f0205755852803a556a9100f75b380bc135606cf94d09f796f31edd92b45ba431be978a637aaca41d6961c4cace74a4d6682d328d116917dda85c2f&userUid=424136872025686016&orgUid=424136872029880321&topic=4636379`;

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
//const path = require('path');

const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* (async () => {
	let feed = await parser.parseURL(feedUrl);
	//console.log(feed.title);

	feed.items.forEach((item) => {
		console.log({ item });
	});
})();
 */
//An error handling middleware
app.use((err, req, res, next) => {
	console.log('🐞 Error Handler');

	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		err: err,
	});
});

// routes
app.get('/', async (req, res, next) => {
	try {
		let feed = await getFeed();
		res.render('pages/index', { feedItems: feed.items });
	} catch (err) {
		return next(err);
	}
});

// get feed
async function getFeed() {
	let feed = await parser.parseURL(feedUrl);
	return feed;
}

// Run the server
const port = process.env.PORT || 3000;
app.listen(port, () =>
	console.log(`🐹 app listening on http://localhost:${port}`)
);
