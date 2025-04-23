import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function PatientHistory({ patient, onBack }) {
    return (
        <div>
            <button
                onClick={onBack}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <PageBreadcrumb pageTitle={`Historial de ${patient.name}`} />

            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="mb-8 flex items-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl">
                        {patient.avatar}
                    </div>
                    <div className="ml-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{patient.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{patient.age} años</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <h3 className="font-medium text-lg mb-2">Información del paciente</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de alta:</p>
                            <p className="text-sm font-medium">{patient.registrationDate}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Última consulta:</p>
                            <p className="text-sm font-medium">{patient.lastConsultation}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <h3 className="font-medium text-lg mb-2">Resumen médico</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Información resumida del historial médico del paciente aparecerá aquí.
                            Esta es una versión de demostración con información de marcador.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                    <h3 className="font-medium text-lg mb-4">Sus tomografías</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <img src="public/images/Tomography.jpg" alt="Tomografía 1" className="w-full h-60 object-cover rounded-md mb-2" />
                            <h4 className="font-medium">Tomografía Craneal</h4>
                            <p className="text-sm mt-1">Evaluación inicial del cráneo para descartar anomalías.</p>
                        </div>

                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <img src="public/images/Tomography.jpg" alt="Tomografía 2" className="w-full h-60 object-cover rounded-md mb-2" />
                            <h4 className="font-medium">Tomografía de Senos Paranasales</h4>
                            <p className="text-sm mt-1">Revisión detallada de los senos paranasales.</p>
                        </div>

                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <img src="public/images/Tomography.jpg" alt="Tomografía 3" className="w-full h-60 object-cover rounded-md mb-2" />
                            <h4 className="font-medium">Tomografía de Tejidos Blandos</h4>
                            <p className="text-sm mt-1">Análisis de tejidos blandos en la región craneal.</p>
                        </div>

                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <img src="public/images/Tomography.jpg" alt="Tomografía 4" className="w-full h-60 object-cover rounded-md mb-2" />
                            <h4 className="font-medium">Tomografía de Diagnóstico General</h4>
                            <p className="text-sm mt-1">Exploración general para diagnóstico inicial.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
