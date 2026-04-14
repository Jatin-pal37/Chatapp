import { useEffect, useRef } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation();
	const notificationAudioRef = useRef(null);

	useEffect(() => {
		notificationAudioRef.current = new Audio(notificationSound);
		notificationAudioRef.current.preload = "auto";

		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;
			setMessages((prevMessages) => [...prevMessages, newMessage]);

			const audio = notificationAudioRef.current;
			if (!audio) return;

			audio.currentTime = 0;
			void audio.play().catch(() => {
				// Browsers can block autoplay until first user interaction.
			});
		};
		socket?.on("newMessage", handleNewMessage);

		return () => socket?.off("newMessage", handleNewMessage);
	}, [socket, setMessages]);
};
export default useListenMessages;
