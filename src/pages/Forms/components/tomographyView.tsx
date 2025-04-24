import { useEffect, useState } from "react";
import axios from "axios";

export default function TomographyView({ tomography, onBack }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [contrast, setContrast] = useState(100);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(
                    "https://backendhackaton-production.up.railway.app/api/studies/ee44d1f7-6fd75bcb-ae051007-677351ca-759382ea/images"
                );
                setImages(response.data.images.map((img) => img.imageUrl));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching images:", error);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleScroll = (e) => {
        const { deltaY } = e;
        if (deltaY > 0 && currentIndex < images.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } else if (deltaY < 0 && currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleDownload = (format) => {
        const link = document.createElement("a");
        link.href = images[currentIndex];
        link.download = `tomography-image.${format}`;
        link.click();
    };

    const handleContrastChange = () => {
        setContrast((prev) => (prev === 100 ? 150 : 100));
    };

    const handleResize = () => {
        setScale((prev) => (prev === 1 ? 1.5 : 1));
    };

    const handleAddNote = () => {
        alert("Add note functionality not implemented yet.");
    };

    const handleCreateLine = () => {
        alert("Create line functionality not implemented yet.");
    };

    return (
        <div
            className="min-h-[84vh] bg-black text-white flex flex-col items-center justify-center"
            style={{ backgroundColor: "#000000", overflow: "hidden" }}
            onWheel={handleScroll}
        >
            <button
                onClick={onBack}
                className="absolute top-4 left-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="w-full px-6 mb-4">
                <div className="flex justify-between items-center ">
                    <h1 className="text-3xl font-bold mb-2">{tomography.title}</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleDownload("jpg")}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                        >
                            Guardar JPG
                        </button>
                        <button
                            onClick={() => handleDownload("png")}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                        >
                            Guardar PNG
                        </button>
                    </div>
                </div>
                <p className="text-sm mb-1 text-gray-400">Fecha: {tomography.date}</p>
                <p className="text-lg mb-6 text-gray-300">{tomography.description}</p>

            </div>
            {loading ? (
                <p className="text-lg">Cargando imágenes...</p>
            ) : (
                <div className="flex items-center justify-center h-[100%] w-full">
                    <img
                        src={images[currentIndex]}
                        alt={`Tomografía ${currentIndex + 1}`}
                        className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                        style={{ filter: `contrast(${contrast}%)`, transform: `scale(${scale})` }}
                    />
                </div>
            )}
            <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
                <button
                    onClick={handleContrastChange}
                    className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
                    title="Cambiar contraste"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m9-9H3" />
                    </svg>
                </button>
                <button
                    onClick={handleResize}
                    className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
                    title="Redimensionar imagen"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8v12h12M16 4h4v4" />
                    </svg>
                </button>
                <button
                    onClick={handleAddNote}
                    className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
                    title="Realizar notas"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9m-9 0H3m9 0v-7m0 7l-3-3m3 3l3-3" />
                    </svg>
                </button>
                <button
                    onClick={handleCreateLine}
                    className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
                    title="Crear líneas"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
