import { useState } from 'react';
import { FaCamera, FaUpload } from 'react-icons/fa';

export default function ModalPhoto({ isOpen, onClose, onPhotoUpdate }) {
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Gestione della selezione della foto
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Funzione per caricare la foto
  const handleUpload = async () => {
    if (!photo) {
      setMessage('Seleziona una foto prima di caricare.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const response = await fetch('/api/utils/s3', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include i cookie per inviare il token
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Foto caricata con successo!');
        setPhotoUrl(data.photoUrl); // Mostra l'URL della foto aggiornata
        onPhotoUpdate(data.photoUrl); // Aggiorna la foto nel parent component
        onClose(); // Chiudi il modale
      } else {
        setMessage(data.message || 'Errore durante il caricamento della foto.');
      }
    } catch (error) {
      setMessage('Errore di connessione.');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative mx-3">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Carica la tua Foto</h2>
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                  style={{ objectPosition: 'top center' }}
                />
              ) : (
                <FaCamera className="text-gray-400 text-3xl" />
              )}
            </div>
            <label className="bg-fuchsia-600 text-white py-2 px-4 rounded-lg cursor-pointer shadow-md flex items-center gap-2">
              <FaUpload size={16} />
              <span>Seleziona Foto</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <button
              onClick={handleUpload}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg w-full"
            >
              Carica Foto
            </button>
            {message && <p className="text-red-500 mt-4 text-center">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}
