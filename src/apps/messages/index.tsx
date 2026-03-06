import { useUser } from "~/hooks/use-user";
import { MessagesView } from "./MessagesView";

export const Messages = () => {
  const { user } = useUser();

  if (!user) return null;

  return <MessagesView />;
};