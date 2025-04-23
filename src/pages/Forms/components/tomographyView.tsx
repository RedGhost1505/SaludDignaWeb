import { useEffect, useState } from "react";
import axios from "axios";

export default function TomographyView({ tomography, onBack }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <div
            className="min-h-screen bg-black text-white flex flex-col items-center justify-center"
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
            <h1 className="text-3xl font-bold mb-4">{tomography.title}</h1>
            <p className="text-sm mb-2">Fecha: {tomography.date}</p>
            <p className="text-lg mb-6">{tomography.description}</p>
            {loading ? (
                <p className="text-lg">Cargando imágenes...</p>
            ) : (
                <div className="flex items-center justify-center h-[70vh] w-full">
                    <img
                        src={images[currentIndex]}
                        alt={`Tomografía ${currentIndex + 1}`}
                        className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                    />
                </div>
            )}
        </div>
    );
}
