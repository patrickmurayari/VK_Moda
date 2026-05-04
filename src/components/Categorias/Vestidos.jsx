import CategoriaTemplate from "./CategoriaTemplate";
import { productosVestidos } from "../../data/productosData";

const Vestidos = () => {
    return <CategoriaTemplate titulo="VESTIDOS" productos={productosVestidos} />;
};

export default Vestidos;