import Image from "next/image";
import { UserAvatar } from "../user-avatar";

const QwirlCard = ({
  qwirl,
}: {
  qwirl: {
    username: string;
    avatar: string;
    image: string;
    categories: string[];
  };
}) => (
  <div className="cursor-pointer group transition-all duration-300 relative w-80 h-96 rounded-2xl overflow-hidden shadow-lg mx-4 flex-shrink-0">
    <Image
      src={qwirl.image}
      alt={`${qwirl.username}'s Qwirl background`}
      className=" transition-transform duration-500 group-hover:scale-110"
      fill
    />
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm group-hover:bg-black/40"></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
      <div className="relative">
        <UserAvatar
          name={qwirl.username}
          image={qwirl.avatar}
          ringed
          size={"2xl"}
          className="shadow-2xl"
        />
        <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl -z-10"></div>
      </div>
      <h3 className="mt-4 text-2xl font-bold tracking-tight">
        {qwirl.username}
      </h3>
      <div className="flex items-center space-x-2 mt-2 text-sm text-white/80">
        {qwirl.categories.slice(0, 2).map((cat) => (
          <span
            key={cat}
            className="bg-white/20 backdrop-blur-lg px-2 py-1 rounded-full"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default QwirlCard;
