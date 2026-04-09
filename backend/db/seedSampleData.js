import dotenv from "dotenv";
import connectToMongoDB from "./connectToMongoDB.js";
import { ensureDefaultSampleData, sampleUsers, SAMPLE_PASSWORD } from "./defaultDataSeeder.js";

dotenv.config();

const seed = async () => {
	try {
		await connectToMongoDB();
		await ensureDefaultSampleData();

		console.log("Sample data ready.");
		console.log("Demo login usernames:", sampleUsers.map((user) => user.username).join(", "));
		console.log(`Demo login password: ${SAMPLE_PASSWORD}`);
		process.exit(0);
	} catch (error) {
		console.error("Failed to seed sample data:", error.message);
		process.exit(1);
	}
};

seed();
