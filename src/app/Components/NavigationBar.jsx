import { FaHome, FaUser, FaGift } from "react-icons/fa";

const NavigationBar = ({ activeTab, setActiveTab, setShowQrProducts }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl">
      <ul className="flex justify-around p-4">
        {[{ icon: FaHome, label: "Home" }, { icon: FaUser, label: "Profile" }, { icon: FaGift, label: "Rewards" }].map((item) => (
          <li key={item.label}>
            <button
              onClick={() => {
                setActiveTab(item.label.toLowerCase());
                if (item.label === "Rewards") setShowQrProducts(true);
                else setShowQrProducts(false);
              }}
              className={`p-2 rounded-full transition-colors duration-300 ${activeTab === item.label.toLowerCase() ? "bg-fuchsia-500 text-white" : "text-fuchsia-500 hover:bg-fuchsia-100"}`}
              aria-label={item.label}
            >
              <item.icon className="w-6 h-6" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
