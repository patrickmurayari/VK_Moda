import { FiInstagram, FiFacebook } from 'react-icons/fi';

function SocialIcons({ variant = 'default', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/vk_design_moda/',
      icon: FiInstagram,
      color: 'from-pink-500 to-rose-500',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/Granjaelsolarman',
      icon: FiFacebook,
      color: 'from-blue-600 to-blue-400',
    },
  ];

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[size]} text-neutral-600 hover:text-accent-600 transition-all duration-300 hover:scale-110 transform`}
              aria-label={social.name}
              title={social.name}
            >
              <Icon className="w-full h-full" />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-gradient-to-br ${social.color} text-white shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-110 transform`}
              aria-label={social.name}
              title={social.name}
            >
              <Icon className="w-1/2 h-1/2" />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === 'outlined') {
    return (
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2 border-accent-600 text-accent-600 hover:bg-accent-600 hover:text-white transition-all duration-300 hover:scale-110 transform`}
              aria-label={social.name}
              title={social.name}
            >
              <Icon className="w-1/2 h-1/2" />
            </a>
          );
        })}
      </div>
    );
  }

  // Default variant - elegante y moderno
  return (
    <div className="flex items-center gap-6">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-white border-2 border-accent-600 text-accent-600 shadow-elegant hover:bg-accent-600 hover:text-white hover:shadow-elegant-lg transition-all duration-300 hover:scale-110 transform`}
            aria-label={social.name}
            title={social.name}
          >
            <Icon className="w-1/2 h-1/2" />
          </a>
        );
      })}
    </div>
  );
}

export default SocialIcons;
