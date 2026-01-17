import { useAuth } from "../../context/AuthContext";
import MyMessages from "./MyMessages";

export default function MyMessagesWrapper() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  return <MyMessages user={user} />;
}
