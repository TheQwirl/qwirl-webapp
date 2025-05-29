import UserCard from "../user-card";

const dummyUsers = [
  {
    avatar: "https://i.pravatar.cc/150?img=67",
    name: "Alice Smith",
    username: "@alice",
    isFollowing: true,
  },
  {
    avatar: "https://i.pravatar.cc/150?img=67",
    name: "Bob Johnson",
    username: "@bob",
    isFollowing: false,
  },
  {
    avatar: "https://i.pravatar.cc/150?img=67",
    name: "Charlie Brown",
    username: "@charlie",
    isFollowing: true,
  },
];

export default function PeoplesTab() {
  return (
    <div className="space-y-4">
      {dummyUsers.map((user, index) => (
        <UserCard key={index} {...user} />
      ))}
    </div>
  );
}
