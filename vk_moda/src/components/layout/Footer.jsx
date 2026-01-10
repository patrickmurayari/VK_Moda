import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { FaCcMastercard, FaCcVisa } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import SocialIcons from '../common/SocialIcons';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-neutral-200 bg-primary-50">
      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Sección 1: Información */}
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-display font-semibold tracking-wide text-primary-900">
              VK Moda
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 font-body">
              Diseño, confección e indumentaria con identidad. Más de 20 años creando piezas que celebran el arte de la moda.
            </p>
            <div className="mt-6 space-y-3 text-sm text-neutral-700">
              <div className="flex items-start gap-2">
                <FiPhone className="mt-0.5 text-accent-600" />
                <a className="hover:text-primary-900 transition-colors" href="tel:+541126073801">
                  (+54) 11 2607-3801
                </a>
              </div>
              <div className="flex items-start gap-2">
                <FiMail className="mt-0.5 text-accent-600" />
                <a className="hover:text-primary-900 transition-colors break-all" href="mailto:murayarivirginia797@gmail.com">
                  murayarivirginia797@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 text-accent-600" />
                <a
                  href="https://www.google.com/maps/place/V%26A+DISE%C3%91O+Y+MODA/@-34.44548603723854,-58.98292763996581,15z/data=!4m6!3m5!1s0x95bc830071a4eb65:0x6abb3b406ef6f180!8m2!3d-34.44548603723854!4d-58.98292763996581!16s%2Fg%2F11s5v5v5v5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-900 transition-colors"
                >
                  V&A DISEÑO Y MODA
                </a>
              </div>
            </div>
          </div>

          {/* Sección 2: Contacto Rápido */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-heading font-semibold tracking-[0.28em] uppercase text-neutral-900">
              Navegación
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-neutral-700">
              <ScrollLink
                to="hero"
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="cursor-pointer hover:text-primary-900 transition-colors"
              >
                Inicio
              </ScrollLink>
              <ScrollLink
                to="categorias"
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="cursor-pointer hover:text-primary-900 transition-colors"
              >
                Categorías
              </ScrollLink>
              <ScrollLink
                to="coleccion"
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="cursor-pointer hover:text-primary-900 transition-colors"
              >
                Colección
              </ScrollLink>
              <ScrollLink
                to="quienes-somos"
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="cursor-pointer hover:text-primary-900 transition-colors"
              >
                Quiénes Somos
              </ScrollLink>
              <ScrollLink
                to="contactos"
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="cursor-pointer hover:text-primary-900 transition-colors"
              >
                Contáctanos
              </ScrollLink>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-heading font-semibold tracking-[0.28em] uppercase text-neutral-900">
              Productos
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-neutral-700">
              <RouterLink className="hover:text-primary-900 transition-colors" to="/vestidos">
                Vestidos
              </RouterLink>
              <RouterLink className="hover:text-primary-900 transition-colors" to="/indumentaria">
                Indumentaria
              </RouterLink>
              <RouterLink className="hover:text-primary-900 transition-colors" to="/joyeria">
                Joyería
              </RouterLink>
              <RouterLink className="hover:text-primary-900 transition-colors" to="/bolsos">
                Bolsos
              </RouterLink>
            </div>
          </div>

          {/* Sección 3: Redes Sociales */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-neutral-200 bg-white/70 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-heading font-semibold tracking-[0.28em] uppercase text-neutral-900">
                Atelier
              </p>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Piezas hechas con detalle, caída y terminaciones que se sienten.
              </p>
              <div className="mt-5">
                <p className="text-xs font-heading font-semibold tracking-[0.28em] uppercase text-neutral-900">
                  Síguenos
                </p>
                <div className="mt-3">
                  <SocialIcons variant="minimal" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Línea Divisora */}
      <div className="border-t border-neutral-200"></div>

      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600">
              <a className="hover:text-primary-900 transition-colors" href="#">
                Cookies Policy
              </a>
              <a className="hover:text-primary-900 transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-primary-900 transition-colors" href="#">
                Terms & Conditions
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-600">
                Métodos de pago
              </span>
              <div className="flex items-center gap-3 text-neutral-900">
                <FaCcMastercard className="text-2xl" />
                <FaCcVisa className="text-2xl" />
                <SiMercadopago className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-neutral-600 text-xs flex items-center gap-1">
              Hecho con <FiHeart className="text-accent-600 text-sm" /> por VK Moda &copy; {currentYear}
            </p>
            <p className="text-neutral-500 text-xs">
              Todos los derechos reservados | Diseño y Moda
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
