import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const AssetSchema = new mongoose.Schema({
    balance: {
		type: Number,
		required: [true, "Please provide unique username"],
		unique: [true, "Username Exist"]
	},
	symbol: {
		type: String,
		required: [true, "Please provide a password"],
		unique: false,
	},
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model.Assets || mongoose.model('Asset', AssetSchema);