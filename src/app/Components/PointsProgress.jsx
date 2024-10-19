import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const PointsProgress = ({ points }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Points Progress</h3>
      <div className="w-32 h-32 mx-auto">
        <CircularProgressbar
          value={(points / 1000) * 100}
          text={`${points}/1000`}
          styles={buildStyles({
            textSize: "14px",
            pathColor: "#d946ef",
            textColor: "#701a75",
            trailColor: "#fdf2f8"
          })}
        />
      </div>
    </div>
  );
};

export default PointsProgress;
