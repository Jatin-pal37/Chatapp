import { useEffect, useRef } from "react";

import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { authUser } = useAuthContext();
	const { selectedConversation, setMessages } = useConversation();
	const notificationAudioRef = useRef(null);

	useEffect(() => {
		notificationAudioRef.current = new Audio(notificationSound);
		notificationAudioRef.current.preload = "auto";

		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;
			setMessages((prevMessages) => [...prevMessages, newMessage]);

			const audio = notificationAudioRef.current;
			if (!audio) return;

			const isFromMe = newMessage.senderId === authUser?._id;
			const isCurrentChatOpen = selectedConversation?._id === newMessage.senderId;
			const isTabVisible = document.visibilityState === "visible";
			const shouldPlaySound = !isFromMe && (!isTabVisible || !isCurrentChatOpen);
			if (!shouldPlaySound) return;

			audio.currentTime = 0;
			void audio.play().catch(() => {
				// Browsers can block autoplay until first user interaction.
			});
		};
		socket?.on("newMessage", handleNewMessage);

		return () => socket?.off("newMessage", handleNewMessage);
	}, [socket, authUser?._id, selectedConversation?._id, setMessages]);
};
export default useListenMessages;
