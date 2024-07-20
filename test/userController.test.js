import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; // Assuming you have an Express app exported from 'app.js'
import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('User API', () => {
	let server;
	beforeAll(async () => {
		server = app.listen(3000);
		await mongoose.connect('mongodb://localhost:27017/testdb', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	});

	afterAll(async () => {
		await mongoose.connection.close();
		server.close();
	});

	beforeEach(async () => {
		await UserModel.deleteMany({});
	});

	describe('POST /api/users/verify', () => {
		it('should verify the user', async () => {
			const user = new UserModel({
				username: 'example123',
				password: 'password',
				email: 'example@gmail.com',
				firstName: 'Bill',
				lastName: 'William'
			});
			await user.save();

			const res = await request(app)
				.post('/api/users/verify')
				.send({ username: 'example123' });

			expect(res.status).toBe(201);
			expect(res.body.User).toHaveProperty('username', 'example123');
		});

		it('should return 404 if user is not found', async () => {
			const res = await request(app)
				.post('/api/users/verify')
				.send({ username: 'example123' });

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', "Can't find User!");
		});
	});

	describe('GET /api/users', () => {
		it('should get a list of users', async () => {
			const users = [
				{ username: 'user1', password: 'password', email: 'user1@example.com', firstName: 'User', lastName: 'One' },
				{ username: 'user2', password: 'password', email: 'user2@example.com', firstName: 'User', lastName: 'Two' }
			];
			await UserModel.insertMany(users);

			const res = await request(app).get('/api/users?limit=2');

			expect(res.status).toBe(201);
			expect(res.body.length).toBe(2);
			expect(res.body[0]).toHaveProperty('username', 'user1');
		});

		it('should return 501 if no users found', async () => {
			const res = await request(app).get('/api/users');

			expect(res.status).toBe(501);
			expect(res.body).toHaveProperty('error', "Couldn't Find Any Users");
		});
	});

	describe('POST /api/users/register', () => {
		it('should register a new user', async () => {
			const res = await request(app)
				.post('/api/users/register')
				.send({
					username: 'example123',
					password: 'admin123',
					email: 'example@gmail.com',
					firstName: 'Bill',
					lastName: 'William'
				});

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('msg');
		});

		it('should return 400 if username or email already exists', async () => {
			const user = new UserModel({
				username: 'example123',
				password: 'password',
				email: 'example@gmail.com',
				firstName: 'Bill',
				lastName: 'William'
			});
			await user.save();

			const res = await request(app)
				.post('/api/users/register')
				.send({
					username: 'example123',
					password: 'admin123',
					email: 'example@gmail.com',
					firstName: 'Bill',
					lastName: 'William'
				});

			expect(res.status).toBe(400);
		});
	});

	describe('POST /api/users/login', () => {
		it('should login a user and return a token', async () => {
			const hashedPassword = await bcrypt.hash('admin123', 10);
			const user = new UserModel({
				username: 'example123',
				password: hashedPassword,
				email: 'example@gmail.com',
				firstName: 'Bill',
				lastName: 'William'
			});
			await user.save();

			const res = await request(app)
				.post('/api/users/login')
				.send({ username: 'example123', password: 'admin123' });

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('access_token');
		});

		it('should return 404 if username not found', async () => {
			const res = await request(app)
				.post('/api/users/login')
				.send({ username: 'example123', password: 'admin123' });

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'Username not Found');
		});

		it('should return 400 if password is incorrect', async () => {
			const hashedPassword = await bcrypt.hash('admin123', 10);
			const user = new UserModel({
				username: 'example123',
				password: hashedPassword,
				email: 'example@gmail.com',
				firstName: 'Bill',
				lastName: 'William'
			});
			await user.save();

			const res = await request(app)
				.post('/api/users/login')
				.send({ username: 'example123', password: 'wrongpassword' });

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Incorrect Password');
		});
	});

	describe('GET /api/users/:username', () => {
		it('should get a user by username', async () => {
			const user = new UserModel({
				username: 'example123',
				password: 'password',
				email: 'example@gmail.com',
				firstName: 'Bill',
				lastName: 'William'
			});
			await user.save();

			const res = await request(app).get('/api/users/example123');

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('username', 'example123');
		});

		it('should return 404 if user not found', async () => {
			const res = await request(app).get('/api/users/example123');

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', "Couldn't Find the User");
		});
	});

	describe('PUT /api/users/update', () => {
		it('should update a user', async () => {
			const user = new UserModel({
				username: 'example123',
				password: 'password',
				email: 'example@gmail.com',
				firstName: 'Bill',
				lastName: 'William'
			});
			await user.save();

			const res = await request(app)
				.put('/api/users/update')
				.send({ userId: user._id, firstName: 'UpdatedName' });

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('msg', 'Record Updated...!');
		});

		it('should return 400 if userId is not provided', async () => {
			const res = await request(app)
				.put('/api/users/update')
				.send({ firstName: 'UpdatedName' });

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'User Not Found...!');
		});
	});

	describe('DELETE /api/users/:userId', () => {
		it('should delete a user', async () => {
			const user = new UserModel({
				username: 'example123',
				password: 'password',
				email: 'example@gmail.com',
				firstName: 'Bill',
				lastName: 'William'
			});
			await user.save();

			const res = await request(app).delete(`/api/users/${user._id}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('msg', 'Record Deleted...!');
		});

		it('should return 400 if userId is not provided', async () => {
			const res = await request(app).delete('/api/users/');

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'User Not Found...!');
		});
	});
});
