import { CircularProgressbar, buildStyles } from "react-circular-progressbar";


const PointsProgress = ({ points, level }) => {
  // Definisci i valori massimi per ogni livello
  let maxPoints;
  if (level === 'Bronze') {
    maxPoints = 100; // Limite per Bronze
  } else if (level === 'Silver') {
    maxPoints = 500; // Limite per Silver
  } else if (level === 'Gold') {
    maxPoints = 1000; // Limite per Gold
  } else {
    maxPoints = 1000; // Valore predefinito se il livello non è riconosciuto
  }

  // Calcolo della percentuale
  const percentage = (points / maxPoints) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative border border-gray-200">
      <h3 className="text-xl font-bold mb-2 text-center">Progressione Punti</h3>
      <p className="text-sm font-medium mb-4 text-center text-gray-700">Livello: {level}</p>
      <div className="w-32 h-32 mx-auto">
        <CircularProgressbar
          value={percentage > 100 ? 100 : percentage} // Assicurati che non superi il 100%
          text={`${points}/${maxPoints}`} // Mostra i punti attuali rispetto al massimo
          styles={buildStyles({
            textSize: "12px",
            pathColor: "#d946ef",
            textColor: "#701a75",
            trailColor: "#fdf2f8",
          })}
        />
      </div>
      <p className="text-center mt-4 text-gray-600">Raggiungi il prossimo livello!</p>
      <div className="mt-2 text-center">
     
      </div>
    </div>
  );
};

export default PointsProgress;
