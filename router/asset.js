import { Router } from "express";
const assetRouter = Router();

/** Import all controllers */
import * as controller from '../controllers/assetController.js';

/** GET Methods */
assetRouter.route('/').get(controller.getAssets); // Get assets

export default assetRouter;
