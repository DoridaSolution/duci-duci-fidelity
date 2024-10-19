import LogoutButton from './Logout';

const ProfileSection = ({ user, points }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <LogoutButton />
      <h2 className="text-2xl font-bold">{user}</h2>
      <p className="text-fuchsia-600 font-medium">Punti Accumulati: {points}</p>
    </div>
  );
};

export default ProfileSection;
