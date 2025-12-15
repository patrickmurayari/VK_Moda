import CardOfertas from "../common/CardOfertas";
import { ofertasProducts } from "../../data/ofertasData";
import ofertas from "../../img/ofertafoto1.jpg";

function SeccionOfertas() {
    return (
        <div className="mt-20 md:mt-20">
            <div className="flex justify-center items-center w-full">
                <img className="object-cover md:h-[600px] md:w-[2000px] h-[300px] transform scale-110" src={ofertas} alt="Ofertas" />
            </div>
            <div>
                <CardOfertas products={ofertasProducts} />
            </div>
        </div>
    );
}

export default SeccionOfertas;
