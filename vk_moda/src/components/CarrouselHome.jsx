import Carrousel from "./home/Carrousel";
import SeccionCategorias from "./home/SeccionCategorias";
import SeccionColeccion from "./home/SeccionColeccion";
import SeccionOfertas from "./home/SeccionOfertas";
import SeccionQuienesSomos from "./home/SeccionQuienesSomos";
import SeccionContacto from "./home/SeccionContacto";
import SeccionRedes from "./home/SeccionRedes";

function Home() {
    return (
        <div>
            <Carrousel />
            <SeccionCategorias />
            <SeccionColeccion />
            <SeccionOfertas />
            <SeccionQuienesSomos />
            <SeccionContacto />
            <SeccionRedes />
        </div>
    );
}

export default Home;
