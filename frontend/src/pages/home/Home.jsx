import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation } = useConversation();

	return (
		<div className='flex h-[calc(100vh-5rem)] sm:h-[450px] md:h-[550px] w-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
			<Sidebar className={selectedConversation ? "hidden sm:flex" : "flex"} />
			<MessageContainer className={!selectedConversation ? "hidden sm:flex" : "flex"} />
		</div>
	);
};
export default Home;
