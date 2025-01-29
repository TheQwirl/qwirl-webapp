import { motion } from "framer-motion";
import UserCard from "../user-card";

const dummyUsers = [
  {
    avatar: "/placeholder.svg?height=50&width=50",
    name: "Alice Smith",
    username: "@alice",
    isFollowing: true,
  },
  {
    avatar: "/placeholder.svg?height=50&width=50",
    name: "Bob Johnson",
    username: "@bob",
    isFollowing: false,
  },
  {
    avatar: "/placeholder.svg?height=50&width=50",
    name: "Charlie Brown",
    username: "@charlie",
    isFollowing: true,
  },
];

export default function PeoplesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      {dummyUsers.map((user, index) => (
        <UserCard key={index} {...user} />
      ))}
    </motion.div>
  );
}
