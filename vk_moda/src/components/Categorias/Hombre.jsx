import CategoriaTemplate from "./CategoriaTemplate";
import { productosHombre } from "../../data/productosData";

const Hombre = () => {
    return <CategoriaTemplate titulo="HOMBRE" productos={productosHombre} />;
};

export default Hombre;
