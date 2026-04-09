import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const SAMPLE_PASSWORD = "password123";

export const sampleUsers = [
	{ fullName: "Rahul Sharma", username: "rahul_demo", gender: "male" },
	{ fullName: "Priya Singh", username: "priya_demo", gender: "female" },
	{ fullName: "Aman Verma", username: "aman_demo", gender: "male" },
	{ fullName: "Neha Gupta", username: "neha_demo", gender: "female" },
];

const sampleConversations = [
	{
		from: "rahul_demo",
		to: "priya_demo",
		messages: ["Hi Priya! Demo chat test kar raha hoon.", "Great! Mujhe message receive ho gaya."],
	},
	{
		from: "aman_demo",
		to: "neha_demo",
		messages: ["Hello Neha, app ka UI kaafi clean hai.", "Thanks Aman! Realtime messaging smooth lag rahi hai."],
	},
	{
		from: "priya_demo",
		to: "aman_demo",
		messages: ["Kal demo presentation ready rakhna.", "Done, main slides aur app dono ready rakhunga."],
	},
];

const buildProfilePic = (username, gender) =>
	gender === "male"
		? `https://avatar.iran.liara.run/public/boy?username=${username}`
		: `https://avatar.iran.liara.run/public/girl?username=${username}`;

const ensureSampleUsers = async () => {
	const hashedPassword = await bcrypt.hash(SAMPLE_PASSWORD, 10);

	const operations = sampleUsers.map((user) =>
		User.updateOne(
			{ username: user.username },
			{
				$setOnInsert: {
					fullName: user.fullName,
					username: user.username,
					password: hashedPassword,
					gender: user.gender,
					profilePic: buildProfilePic(user.username, user.gender),
				},
			},
			{ upsert: true }
		)
	);

	await Promise.all(operations);
	return User.find({ username: { $in: sampleUsers.map((user) => user.username) } });
};

const ensureConversationMessages = async (fromUser, toUser, texts) => {
	let conversation = await Conversation.findOne({
		participants: { $all: [fromUser._id, toUser._id] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [fromUser._id, toUser._id],
			messages: [],
		});
	}

	if (conversation.messages.length > 0) return;

	const createdMessages = await Message.insertMany(
		texts.map((text, index) => ({
			senderId: index % 2 === 0 ? fromUser._id : toUser._id,
			receiverId: index % 2 === 0 ? toUser._id : fromUser._id,
			message: text,
		}))
	);

	conversation.messages.push(...createdMessages.map((message) => message._id));
	await conversation.save();
};

export const ensureDefaultSampleData = async () => {
	const users = await ensureSampleUsers();
	const usersByUsername = users.reduce((acc, user) => {
		acc[user.username] = user;
		return acc;
	}, {});

	for (const chat of sampleConversations) {
		const fromUser = usersByUsername[chat.from];
		const toUser = usersByUsername[chat.to];
		if (!fromUser || !toUser) continue;
		await ensureConversationMessages(fromUser, toUser, chat.messages);
	}
};
