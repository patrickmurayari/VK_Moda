import CategoriaTemplate from "./CategoriaTemplate";
import { productosIndumentaria } from "../../data/productosData";

const Indumentaria = () => {
    return <CategoriaTemplate titulo="INDUMENTARIA" productos={productosIndumentaria} />;
};

export default Indumentaria;