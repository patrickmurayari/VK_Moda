import CardProducts from "../common/CardCategoria";
import { ProductsCategoria } from "../../data/categoriasData";

function SeccionCategorias() {
    return (
        <div className="md:mt-20 mt-12">
            <div className="text-center mb-12">
                <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-primary-900 font-elegant text-3xl md:text-5xl font-bold tracking-wide">Categorías Destacadas</h1>
                <div className="w-24 h-1 bg-accent-600 mx-auto mt-4 rounded-full"></div>
            </div>
            <CardProducts products={ProductsCategoria} />
        </div>
    );
}

export default SeccionCategorias;
