const PurchaseConfirmationModal = ({ isModalOpen, selectedProduct, handleConfirmPurchase, setIsModalOpen }) => {
    return (
      isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Conferma Acquisto</h3>
            <p>Sei sicuro di voler acquistare {selectedProduct.name} per {selectedProduct.points} punti?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={handleConfirmPurchase} className="bg-fuchsia-500 text-white px-4 py-2 rounded-md mr-2">
                Conferma
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded-md">Annulla</button>
            </div>
          </div>
        </div>
      )
    );
  };
  
  export default PurchaseConfirmationModal;
  