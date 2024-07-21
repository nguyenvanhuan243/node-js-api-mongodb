import { Router } from "express";
const userRouter = Router();

/** Import all controllers */
import * as controller from '../controllers/userController.js';

/** POST Methods */
userRouter.route('/register').post(controller.register); // Register user
userRouter.route('/login').post(controller.login); // Login to app
userRouter.route('/verify').post(controller.verifyUser, (req, res) => res.end()); // Authenticate user

/** GET Methods */
userRouter.route('/').get(controller.getUsers); // Get user list
userRouter.route('/:username').get(controller.getUser); // Get user by username

/** PUT Methods */
userRouter.route('/update').put(controller.updateUser); // Update user profile

/** DELETE Methods */
userRouter.route('/:userId').delete(controller.deleteUser); // Delete user by userId

export default userRouter;
