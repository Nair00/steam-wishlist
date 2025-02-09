import { SteamUser } from '../types/steam';

interface UserProfileProps {
  user: SteamUser;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex items-center gap-4 mb-8 p-4 bg-gray-800 rounded-lg">
      <img
        src={user.avatarfull}
        alt={user.personaname}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h2 className="text-2xl font-bold text-white">{user.personaname}</h2>
        <a
          href={user.profileurl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Steam Profile
        </a>
      </div>
    </div>
  );
};
