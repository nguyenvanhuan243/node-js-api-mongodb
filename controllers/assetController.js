import AssetModel from '../model/Asset.model.js';

/**
 * GET: http://localhost:3000/api/assets?limit=10
 * @queryParam {number} [limit=10] - The number of assets to retrieve.
 * @returns {Array} - A list of assets
 */
export async function getAssets(req, res) {
	console.log("##################################################")
	console.log("### params", req.params)
	console.log("### query", req.query)
	console.log("### body", req.body)
	console.log("##################################################")
	try {
		const limit = parseInt(req.query.limit, 10) || 10;
		const assets = await AssetModel.find({}).limit(limit);

		if (!assets || assets.length === 0) {
			return res.status(501).send({ error: "Couldn't Find Any Assets" });
		}
		return res.status(201).send(assets);
	} catch (error) {
		return res.status(404).send({ error: "Cannot Find Assets Data" });
	}
}

