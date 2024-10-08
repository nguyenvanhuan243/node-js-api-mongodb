import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connect from './database/conn.js';
import userRouter from './router/user.js';
import postRouter from './router/post.js';
import swaggerDocs from './swagger.js'
import assetRouter from './router/asset.js';

dotenv.config()
const app = express();
/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

const port = process.env.PORT || 8080;
/** HTTP GET Request */
app.get('/', (req, res) => {
	res.status(201).json("Home GET Request");
});

/** api routes */
app.use('/api/users', userRouter)
app.use('/api/post', postRouter)
app.use('/api/assets', assetRouter)
/** start server only when we have valid connection */
connect().then(() => {
	try {
		app.listen(port, () => {
			console.log(`Server connected to http://localhost:${port}`);
		})
		swaggerDocs(app, port)
	} catch (error) {
		console.log('Cannot connect to the server')
	}
}).catch(error => {
	console.log("Invalid database connection...!");
	console.log("Plz update database access: https://cloud.mongodb.com/v2/669b33db85326633803d313b#/security/network/accessList")
})