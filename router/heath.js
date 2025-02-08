import { Router } from "express";
const healthRouter = Router();

/** import all controllers */
import * as controller from '../controllers/healthController.js';

/** GET Methods */

healthRouter.route('/').get(controller.checkHealth); // Check health


export default healthRouter;