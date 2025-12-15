import CategoriaTemplate from "./CategoriaTemplate";
import { productosJoyeria } from "../../data/productosData";

const Joyeria = () => {
    return <CategoriaTemplate titulo="JOYERÍA" productos={productosJoyeria} />;
};

export default Joyeria;