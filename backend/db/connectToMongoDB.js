import dns from "dns";
import mongoose from "mongoose";


const connectToMongoDB = async () => {
	try {
		dns.setServers(["1.1.1.1", "8.8.8.8"]);
		await mongoose.connect(process.env.MONGO_DB_URI);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
