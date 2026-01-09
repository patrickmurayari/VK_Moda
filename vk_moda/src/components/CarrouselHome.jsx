import Carrousel from "./home/Carrousel";
import SeccionCategorias from "./home/SeccionCategorias";
import SeccionColeccion from "./home/SeccionColeccion";
import SeccionQuienesSomos from "./home/SeccionQuienesSomos";
import SeccionContacto from "./home/SeccionContacto";

function Home() {
    return (
        <div>
            <Carrousel />
            <SeccionCategorias />
            <SeccionColeccion />
            <SeccionQuienesSomos />
            <SeccionContacto />
        </div>
    );
}

export default Home;
