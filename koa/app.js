const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');

const app = new Koa();
const router = new Router();

// Serve static files from public directory
app.use(serve('public'));

// Parse URL-encoded bodies
app.use(bodyParser());

// Setup view engine
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

// Define routes
router.get('/', async (ctx) => {
    await ctx.render('index');
});

router.get('/endpoint', (ctx) => {
    ctx.body = 'We are so back!';
});

// Use the routes defined in router
app.use(router.routes()).use(router.allowedMethods());

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));