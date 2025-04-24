import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

// Definimos interfaces para TypeScript
interface TomographyProps {
    tomography: {
        id: string;
        title: string;
        date: string;
        description: string;
    };
    onBack: () => void;
}

interface ImageData {
    imageUrl: string;
    id: string;
}

// Nuevo tipo para ajustes de visualización
interface ViewSettings {
    contrast: number;
    brightness: number;
    scale: number;
    invert: boolean;
}

export default function TomographyView({ tomography, onBack }: TomographyProps) {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showTools, setShowTools] = useState<boolean>(false);
    // Ahora usamos un objeto para los ajustes de visualización
    const [viewSettings, setViewSettings] = useState<ViewSettings>({
        contrast: 100,
        brightness: 100,
        scale: 1,
        invert: false
    });

    // Referencias para optimización
    const imagesCache = useRef<Record<number, HTMLImageElement>>({});
    const scrollTimeout = useRef<number | null>(null);
    const isFetching = useRef<boolean>(false);
    const apiUrl = useRef<string>("https://backendhackaton-production.up.railway.app/api/studies/ee44d1f7-6fd75bcb-ae051007-677351ca-759382ea/images");

    // Función para precargar imágenes de manera eficiente
    const preloadImages = useCallback((centerIndex: number, range: number = 3) => {
        if (images.length === 0) return;

        for (let i = -range; i <= range; i++) {
            const index = centerIndex + i;
            if (index >= 0 && index < images.length && !imagesCache.current[index]) {
                const img = new Image();
                img.src = images[index];
                imagesCache.current[index] = img;
            }
        }
    }, [images]);

    // Optimización del desplazamiento
    const handleScroll = useCallback((e: React.WheelEvent) => {
        e.preventDefault(); // Prevenir scroll default del navegador

        if (scrollTimeout.current) {
            window.clearTimeout(scrollTimeout.current);
        }

        const { deltaY } = e;
        // Respuesta inmediata con debounce reducido
        scrollTimeout.current = window.setTimeout(() => {
            if (deltaY > 0 && currentIndex < images.length - 1) {
                setCurrentIndex(prevIndex => prevIndex + 1);
            } else if (deltaY < 0 && currentIndex > 0) {
                setCurrentIndex(prevIndex => prevIndex - 1);
            }
        }, 60); // Tiempo de debounce muy reducido para mejor respuesta
    }, [currentIndex, images.length]);

    // Navegación con botones
    const navigateToImage = useCallback((direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (direction === 'next' && currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }, [currentIndex, images.length]);

    // Cargar imágenes una sola vez al inicio
    useEffect(() => {
        const fetchImages = async () => {
            // Si ya está buscando o ya tenemos imágenes, no hacemos nada
            if (isFetching.current || images.length > 0) return;

            isFetching.current = true;
            setLoading(true);

            try {
                const response = await axios.get<{ images: ImageData[] }>(apiUrl.current);
                const imageUrls = response.data.images.map((img) => img.imageUrl);
                setImages(imageUrls);

                // Precarga inmediata de más imágenes iniciales
                setTimeout(() => {
                    preloadImages(0, 10); // Precargar más imágenes al inicio
                }, 0);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
                isFetching.current = false;
            }
        };

        fetchImages();
    }, []); // Dependencias vacías para que solo se ejecute una vez

    // Precarga cuando cambia el índice actual
    useEffect(() => {
        if (images.length > 0) {
            // Precarga las imágenes cercanas al índice actual
            preloadImages(currentIndex, 5);
        }
    }, [currentIndex, images.length, preloadImages]);

    // Soporte para navegación con teclado
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                navigateToImage('next');
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                navigateToImage('prev');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigateToImage]);

    const handleDownload = (format: string) => {
        if (!images[currentIndex]) return;

        const link = document.createElement("a");
        link.href = images[currentIndex];
        link.download = `tomography-image-${currentIndex}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Manejadores para los ajustes de visualización
    const handleSettingChange = (setting: keyof ViewSettings, value: number | boolean) => {
        setViewSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    // Reset de todos los ajustes de visualización
    const handleResetSettings = () => {
        setViewSettings({
            contrast: 100,
            brightness: 100,
            scale: 1,
            invert: false
        });
    };

    const handleAddNote = () => {
        alert("Add note functionality not implemented yet.");
    };

    const handleCreateLine = () => {
        alert("Create line functionality not implemented yet.");
    };

    // Genera el CSS para los filtros de imagen
    const getImageFilters = () => {
        const { contrast, brightness, invert } = viewSettings;
        return `contrast(${contrast}%) brightness(${brightness}%) ${invert ? 'invert(100%)' : ''}`;
    };

    return (
        <div
            className="bg-gray-900 text-white flex flex-col h-full"
            style={{ overflow: "hidden" }}
            onWheel={handleScroll}
        >
            {/* Header con información y acciones principales */}
            <div className="bg-black py-4 px-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{tomography.title}</h1>
                            <p className="text-sm text-gray-400">Fecha: {tomography.date}</p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleDownload("jpg")}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                        >
                            Guardar JPG
                        </button>
                        <button
                            onClick={() => handleDownload("png")}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                        >
                            Guardar PNG
                        </button>
                    </div>
                </div>

                {/* Descripción del estudio */}
                <div className="mt-2 bg-gray-800 p-3 rounded-lg max-w-2xl">
                    <p className="text-gray-300">{tomography.description}</p>
                </div>
            </div>

            {/* Área principal con imagen */}
            <div className="flex-1 relative bg-black">
                <div className="h-full w-full flex items-center justify-center p-6">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-lg">Cargando imágenes...</p>
                        </div>
                    ) : images.length > 0 ? (
                        <img
                            src={images[currentIndex]}
                            alt={`Tomografía ${currentIndex + 1}`}
                            className="max-h-[40%] max-w-[40%] object-contain rounded-lg shadow-lg transition-transform duration-300 ease-in-out"
                            style={{
                                filter: getImageFilters(),
                                transform: `scale(${viewSettings.scale})`
                            }}
                        />
                    ) : (
                        <p className="text-lg text-red-400">No se encontraron imágenes.</p>
                    )}
                </div>

                {/* Botón circular para mostrar/ocultar herramientas */}
                <button
                    onClick={() => setShowTools(!showTools)}
                    className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors z-20"
                    aria-label={showTools ? "Ocultar herramientas" : "Mostrar herramientas"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {showTools ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        )}
                    </svg>
                </button>

                {/* Panel flotante de herramientas mejorado */}
                {showTools && (
                    <div className="absolute bottom-24 right-6 w-80 bg-gray-800 text-white rounded-lg shadow-xl p-4 z-10 animate-fade-in">
                        <div className="flex flex-row items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">Herramientas de visualización</h3>
                            </div>
                            <button
                                onClick={handleResetSettings}
                                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition"
                            >
                                Restablecer
                            </button>
                        </div>

                        {/* Control de contraste profesional con slider */}
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <label className="text-sm text-gray-300 flex items-center">
                                    <svg className="h-4 w-4 mr-1 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                    Contraste
                                </label>
                                <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded">
                                    {viewSettings.contrast}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleSettingChange('contrast', Math.max(50, viewSettings.contrast - 10))}
                                    className="p-1 bg-gray-700 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <input
                                    type="range"
                                    min="50"
                                    max="200"
                                    step="1"
                                    value={viewSettings.contrast}
                                    onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
                                    className="flex-1 accent-emerald-500 h-2 bg-gray-700 rounded appearance-none"
                                />
                                <button
                                    onClick={() => handleSettingChange('contrast', Math.min(200, viewSettings.contrast + 10))}
                                    className="p-1 bg-gray-700 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Control de brillo */}
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <label className="text-sm text-gray-300 flex items-center">
                                    <svg className="h-4 w-4 mr-1 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Brillo
                                </label>
                                <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded">
                                    {viewSettings.brightness}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleSettingChange('brightness', Math.max(50, viewSettings.brightness - 10))}
                                    className="p-1 bg-gray-700 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <input
                                    type="range"
                                    min="50"
                                    max="200"
                                    step="1"
                                    value={viewSettings.brightness}
                                    onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                                    className="flex-1 accent-emerald-500 h-2 bg-gray-700 rounded appearance-none"
                                />
                                <button
                                    onClick={() => handleSettingChange('brightness', Math.min(200, viewSettings.brightness + 10))}
                                    className="p-1 bg-gray-700 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Control de zoom/escala */}
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <label className="text-sm text-gray-300 flex items-center">
                                    <svg className="h-4 w-4 mr-1 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                    Zoom
                                </label>
                                <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded">
                                    {Math.round(viewSettings.scale * 100)}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleSettingChange('scale', Math.max(0.5, viewSettings.scale - 0.1))}
                                    className="p-1 bg-gray-700 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.05"
                                    value={viewSettings.scale}
                                    onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
                                    className="flex-1 accent-emerald-500 h-2 bg-gray-700 rounded appearance-none"
                                />
                                <button
                                    onClick={() => handleSettingChange('scale', Math.min(2, viewSettings.scale + 0.1))}
                                    className="p-1 bg-gray-700 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Toggle para invertir colores */}
                        <div className="mb-4 flex items-center justify-between">
                            <label className="text-sm text-gray-300 flex items-center">
                                <svg className="h-4 w-4 mr-1 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                Invertir colores
                            </label>
                            <button
                                onClick={() => handleSettingChange('invert', !viewSettings.invert)}
                                className={`w-12 h-6 rounded-full flex items-center transition-colors ${viewSettings.invert ? 'bg-emerald-500 justify-end' : 'bg-gray-600 justify-start'}`}
                            >
                                <span className="w-5 h-5 bg-white rounded-full m-0.5"></span>
                            </button>
                        </div>

                        <div className="border-t border-gray-700 my-4 pt-4">
                            <h4 className="text-sm font-medium mb-3 text-gray-300">Otras herramientas</h4>
                            <div className="flex flex-col space-y-2">
                                <button
                                    onClick={handleAddNote}
                                    className="flex items-center px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2 text-emerald-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Añadir notas
                                </button>
                                <button
                                    onClick={handleCreateLine}
                                    className="flex items-center px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2 text-emerald-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                    Crear mediciones
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navegación de imágenes */}
                {images.length > 0 && (
                    <div className="absolute bottom-6 left-6 bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center">
                        {/* Slider para navegación */}
                        <input
                            type="range"
                            min="0"
                            max={images.length - 1}
                            value={currentIndex}
                            onChange={(e) => setCurrentIndex(Number(e.target.value))}
                            className="w-full accent-emerald-500 mb-2"
                        />
                        <div className="flex items-center">
                            <button
                                className="p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 mr-2"
                                disabled={currentIndex === 0}
                                onClick={() => navigateToImage('prev')}
                                aria-label="Imagen anterior"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-sm px-2">
                                Imagen {currentIndex + 1} de {images.length}
                            </span>
                            <button
                                className="p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 ml-2"
                                disabled={currentIndex === images.length - 1}
                                onClick={() => navigateToImage('next')}
                                aria-label="Imagen siguiente"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}