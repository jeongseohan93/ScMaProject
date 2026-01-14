import ChatClient from "./ChatClient";

export default function ChatPage({
  params,
}: {
  params: { friendId: string };
}) {
  return <ChatClient friendId={params.friendId} />;
}
