import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { FaCcMastercard, FaCcVisa } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';
import SocialIcons from '../common/SocialIcons';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-0">
      <div className="bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-600">
            Métodos de pago
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
              <FaCcMastercard className="text-xl text-neutral-900" />
              <span className="text-xs font-medium text-neutral-700">Mastercard</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
              <FaCcVisa className="text-xl text-neutral-900" />
              <span className="text-xs font-medium text-neutral-700">Visa</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
              <SiMercadopago className="text-xl text-neutral-900" />
              <span className="text-xs font-medium text-neutral-700">Mercado Pago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-900 text-white">
        {/* Contenido Principal */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          
          {/* Sección 1: Información */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-elegant font-bold mb-4 text-accent-600">
              VK Moda
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Más de 20 años de experiencia en moda, diseño y confecciones. 
              Tu estilo, nuestra pasión.
            </p>
          </div>

          {/* Sección 2: Contacto Rápido */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-accent-600">
              Contacto
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-2 hover:text-accent-600 transition-colors">
                <FiPhone className="text-accent-600" />
                <a href="tel:+541126073801">(+54) 11 2607-3801</a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 hover:text-accent-600 transition-colors">
                <FiMail className="text-accent-600" />
                <a href="mailto:murayarivirginia797@gmail.com">murayarivirginia797@gmail.com</a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-300">
                <FiMapPin className="text-accent-600" />
                <a 
                  href="https://www.google.com/maps/place/V%26A+DISE%C3%91O+Y+MODA/@-34.44548603723854,-58.98292763996581,15z/data=!4m6!3m5!1s0x95bc830071a4eb65:0x6abb3b406ef6f180!8m2!3d-34.44548603723854!4d-58.98292763996581!16s%2Fg%2F11s5v5v5v5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-600 transition-colors"
                >
                  V&A DISEÑO Y MODA
                </a>
              </div>
            </div>
          </div>

          {/* Sección 3: Redes Sociales */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4 text-accent-600">
              Síguenos
            </h3>
            <div className="flex justify-center md:justify-end">
              <SocialIcons variant="gradient" size="md" />
            </div>
          </div>
        </div>

        {/* Línea Divisora */}
        <div className="h-px bg-neutral-700 my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-neutral-400 text-sm flex items-center justify-center gap-1">
            Hecho con <FiHeart className="text-accent-600 text-base" /> por VK Moda &copy; {currentYear}
          </p>
          <p className="text-neutral-500 text-xs mt-2">
            Todos los derechos reservados | Diseño y Moda
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
