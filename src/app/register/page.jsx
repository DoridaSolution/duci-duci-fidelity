import RegisterForm from "../Components/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex flex-col justify-center items-center p-3">
      {/* SVG di decorazione per simulare una colata di glassa in alto
      <div className="absolute top-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fbcfe8"
            d="M0,160L60,176C120,192,240,224,360,218.7C480,213,600,171,720,154.7C840,139,960,149,1080,149.3C1200,149,1320,139,1380,133.3L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div> */}

      {/* Form di registrazione centrato */}
      <div className="flex flex-col bg-white rounded-xl shadow-lg px-8 py-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-6">
          Create your Duci Duci account
        </h1>

        <RegisterForm />

        {/* Footer o link per il login */}
        <div className="mt-8 text-center text-pink-600">
          <p>
            Hai già un account?{" "}
            <a href="/Login" className="text-pink-500 font-bold">
              Accedi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
