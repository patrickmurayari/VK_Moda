import { FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import SocialIcons from '../common/SocialIcons';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A]">
      {/* Newsletter */}
      <div className="border-b border-neutral-800 px-6 md:px-12 py-16 md:py-20 text-center">
        <h3 className="font-display text-4xl tracking-[0.2em] uppercase text-white">
          Suscríbase a las novedades de V&A
        </h3>
        <p className="mt-3 font-body font-light text-xl text-neutral-400 max-w-md mx-auto">
          Reciba anticipaciones exclusivas, colecciones y novedades del atelier directamente en su correo.
        </p>
        <div className="mt-8 flex items-center justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full bg-transparent border-b border-neutral-700 focus:border-white outline-none font-body text-sm text-white placeholder:text-neutral-600 pb-2 transition-colors duration-300"
          />
          <button
            type="button"
            className="ml-4 text-white transition-colors"
            aria-label="Suscribir"
          >
            <FiArrowRight className="w-4 h-4" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="px-6 md:px-12 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Column: Navegación */}
          <div>
            <h4 className="font-body font-medium text-[11px] tracking-[0.15em] uppercase text-neutral-400">
              Navegación
            </h4>
            <div className="mt-5 space-y-3">
              <a href="#hero" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Inicio
              </a>
              <a href="#categorias" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Categorías
              </a>
              <a href="#coleccion" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Colección
              </a>
              <RouterLink to="/quienes-somos" onClick={() => window.scrollTo(0, 0)} className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Quiénes Somos
              </RouterLink>
              <a href="#contactos" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Contáctanos
              </a>
            </div>
          </div>

          {/* Column: Productos */}
          <div>
            <h4 className="font-body font-medium text-[11px] tracking-[0.15em] uppercase text-neutral-400">
              Productos
            </h4>
            <div className="mt-5 space-y-3">
              <RouterLink to="/categoria/buzos-mujer" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Buzos
              </RouterLink>
              <RouterLink to="/categoria/camperas-hombre" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Camperas
              </RouterLink>
            </div>
          </div>

          {/* Column: Contacto */}
          <div>
            <h4 className="font-body font-medium text-[11px] tracking-[0.15em] uppercase text-neutral-400">
              ¿Necesita ayuda?
            </h4>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-2">
                <FiPhone className="mt-0.5 text-neutral-200" strokeWidth={1} />
                <a className="font-body font-light text-xs text-white transition-colors duration-300" href="tel:+541126073801">
                  (+54) 11 2607-3801
                </a>
              </div>
              <div className="flex items-start gap-2">
                <FiMail className="mt-0.5 text-white" strokeWidth={1} />
                <a className="font-body font-light text-xs text-white transition-colors duration-300 break-all" href="mailto:murayarivirginia797@gmail.com">
                  murayarivirginia797@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 text-neutral-200" strokeWidth={1} />
                <a
                  href="https://www.google.com/maps/place/V%26A+DISE%C3%91O+Y+MODA/@-34.44548603723854,-58.98292763996581,15z/data=!4m6!3m5!1s0x95bc830071a4eb65:0x6abb3b406ef6f180!8m2!3d-34.44548603723854!4d-58.98292763996581!16s%2Fg%2F11s5v5v5v5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body font-light text-xs text-neutral-200 hover:text-white transition-colors duration-300"
                >
                  V&A Diseño y Moda
                </a>
              </div>
            </div>
          </div>

          {/* Column: Síguenos */}
          <div>
            <h4 className="font-body font-medium text-[11px] tracking-[0.15em] uppercase text-white">
              Síguenos
            </h4>
            <div className="mt-5">
              <SocialIcons variant="minimal" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a className="font-body text-[10px] text-white transition-colors duration-300" href="#">
              Cookies Policy
            </a>
            <a className="font-body text-[10px] text-white transition-colors duration-300" href="#">
              Privacy Policy
            </a>
            <a className="font-body text-[10px] text-white transition-colors duration-300" href="#">
              Terms & Conditions
            </a>
          </div>
          <p className="font-body text-[10px] text-white">
            &copy; {currentYear} V&A Diseño y Moda. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Monumental Watermark */}
      <div className="w-full flex justify-center items-center py-6 md:py-16 overflow-hidden">
        <span className="font-display font-light text-[28vw] md:text-[10vw] tracking-[0.4em] text-white select-none leading-none">
          V&amp;A
        </span>
      </div>
    </footer>
  );
}

export default Footer;
