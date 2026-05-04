import CategoriaTemplate from "./CategoriaTemplate";
import { productosBolsos } from "../../data/productosData";

const Bolsos = () => {
    return <CategoriaTemplate titulo="BOLSOS" productos={productosBolsos} />;
};

export default Bolsos;