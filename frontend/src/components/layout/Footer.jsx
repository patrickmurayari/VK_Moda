import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import SocialIcons from '../common/SocialIcons';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A]">
      {/* WhatsApp CTA */}
      <div className="border-b border-neutral-800 px-6 md:px-12 py-16 md:py-20 text-center">
        <h3 className="font-display text-3xl md:text-4xl tracking-[0.15em] uppercase text-white leading-tight max-w-xl mx-auto">
          ¿Atención Personalizada o Ventas Mayoristas?
        </h3>
        <p className="mt-4 font-body font-light text-base text-neutral-400 max-w-md mx-auto leading-relaxed">
          Escribínos directamente por WhatsApp y te asesoramos al instante.
        </p>
        <a
          href={`https://wa.me/541126073801?text=${encodeURIComponent('Hola! Quisiera realizar una consulta sobre sus prendas / ventas mayoristas.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-[#25D366] hover:bg-[#1cb954] text-white font-body text-sm tracking-wide rounded-full transition-colors duration-300 shadow-lg"
        >
          <FaWhatsapp className="w-5 h-5" />
          Escribínos por WhatsApp
        </a>
      </div>

      {/* Navigation Grid */}
      <div className="px-6 md:px-12 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
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
              <RouterLink to="/categoria/pantalones" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Pantalones
              </RouterLink>
              <RouterLink to="/categoria/joggings" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Joggings
              </RouterLink>
              <RouterLink to="/categoria/accesorios" className="block font-body font-normal text-xs text-white underline underline-offset-4 decoration-[0.5px] decoration-neutral-500 hover:decoration-white transition-colors duration-300">
                Accesorios
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

          {/* Column: Ubicación */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-body font-medium text-[11px] tracking-[0.15em] uppercase text-neutral-400">
              Ubicación
            </h4>
            <div className="mt-5">
              {/* Mobile: dirección + botón */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start gap-2">
                  <FiMapPin className="mt-0.5 shrink-0 text-neutral-200" strokeWidth={1} />
                  <p className="font-body font-light text-xs text-neutral-300 leading-relaxed">
                    Av. Bartolomé Mitre 363, B1633 Fatima, Provincia de Buenos Aires
                  </p>
                </div>
                <a
                  href="https://maps.app.goo.gl/BpXNoiH7agkrXHmz6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-neutral-600 rounded-lg text-xs text-neutral-200 hover:border-white hover:text-white transition-colors duration-300"
                >
                  <FiMapPin className="w-3 h-3" strokeWidth={1.5} />
                  Ver en Google Mapss
                </a>
              </div>
              {/* Desktop: iframe embebido */}
              <div className="hidden md:block">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1036.3662160340302!2d-58.98326103955324!3d-34.445616385459964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc830071a4eb65%3A0x6abb3b406ef6f180!2sV%26A%20DISE%C3%91O%20Y%20MODA!5e0!3m2!1ses-419!2sar!4v1784607083142!5m2!1ses-419!2sar"
                  className="w-full h-40 rounded-xl border-0 shadow-md"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación V&A Diseño y Moda"
                />
              </div>
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
