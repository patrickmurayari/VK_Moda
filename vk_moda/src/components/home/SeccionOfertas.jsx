import CardOfertas from "../common/CardOfertas";
import { ofertasProducts } from "../../data/ofertasData";

function SeccionOfertas() {
    return (
        <div className="mt-16 md:mt-20 py-20" id="ofertas">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full -ml-48 -mt-48"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-900/5 rounded-full -mr-40 -mb-40"></div>
            </div>

            {/* Encabezado */}
            <div className="text-center mb-12 md:mb-16 px-4 md:px-8">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-12 bg-accent-600"></div>
                    <span className="text-accent-600 font-semibold tracking-widest text-sm uppercase">Promociones</span>
                    <div className="h-px w-12 bg-accent-600"></div>
                </div>
                
                <h1 className="text-primary-900 font-elegant text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider mb-6">
                    Ofertas Exclusivas
                </h1>
                
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-accent-600"></div>
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                    <div className="h-px w-16 bg-accent-600"></div>
                </div>
                
                <p className="text-neutral-600 mt-8 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto">
                    Descubre nuestras piezas seleccionadas con descuentos especiales
                </p>
            </div>
            {/* Tarjetas de ofertas */}
            <div className="px-4 md:px-8">
                <CardOfertas products={ofertasProducts} />
            </div>
        </div>
    );
}

export default SeccionOfertas;
