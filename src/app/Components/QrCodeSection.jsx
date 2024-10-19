const QrCodeSection = ({ qrCode }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        {qrCode && (
          <img src={qrCode} alt="QR Code" className="my-4 mx-auto w-48 h-48 object-cover rounded-lg shadow-md" />
        )}
        <p className="text-center mt-2 font-medium">Scannerizza al checkout</p>
      </div>
    );
  };
  
  export default QrCodeSection;
  