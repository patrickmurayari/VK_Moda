import insta from "../../img/insta.png"
import facebook from "../../img/facebook.png"

function SeccionRedes() {
    return (
        <div className="flex justify-center gap-6 md:gap-8 mt-12 pb-8">
            <a 
                href="https://www.instagram.com/vk_design_moda/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
            >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-accent-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary-900 group-hover:shadow-elegant-lg transform group-hover:scale-110">
                    <img className="w-6 h-6 md:w-7 md:h-7" src={insta} alt="Instagram" />
                </div>
            </a>
            <a 
                href="https://www.facebook.com/Granjaelsolarman" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
            >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-accent-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary-900 group-hover:shadow-elegant-lg transform group-hover:scale-110">
                    <img className="w-6 h-6 md:w-7 md:h-7" src={facebook} alt="Facebook" />
                </div>
            </a>
        </div>
    );
}

export default SeccionRedes;
