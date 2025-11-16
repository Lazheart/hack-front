import { useState } from "react";
import { Footer as FlowbiteFooter } from "flowbite-react";
import type { FC, SVGProps } from "react";
import type { IconType } from "react-icons";
import LogoImage from "../assets/react.svg";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";


const iconAdapter = (Icon: IconType): FC<SVGProps<SVGSVGElement>> => {
  return (props: SVGProps<SVGSVGElement>) => <Icon {...props} />;
};

const Footer = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const aboutLinks = [
    { href: "#", text: "Sobre Nosotros" },
    { href: "#", text: "Nuestra Misión" },
    { href: "#", text: "Equipo" },
  ];

  const legalLinks = [
    { href: "#", text: "Política de Privacidad" },
    { href: "#", text: "Términos y Condiciones" },
    { href: "#", text: "Aviso Legal" },
  ];

  const socialLinks = [
    { href: "#", icon: BsFacebook, label: "Facebook" },
    { href: "#", icon: BsInstagram, label: "Instagram" },
    { href: "#", icon: BsTwitter, label: "Twitter" },
    { href: "#", icon: BsGithub, label: "GitHub" },
    { href: "#", icon: BsDribbble, label: "Dribbble" },
  ];


  return (
    <FlowbiteFooter container className="bg-white">
      <div className="w-full">
        {/* Contenido principal */}
        <div className="w-full paddings">
          {/* Versión Desktop */}
          <div className="hidden lg:flex lg:items-start lg:justify-between lg:gap-8">
            {/* Logo - Centrado y más grande */}
            <div className="shrink-0 flex items-center justify-center px-6 py-4">
              <img src={LogoImage} alt="Waveon Logo" className="h-20 w-auto" />
            </div>

            {/* About */}
            <div className="flexColStart gap-2">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">About Us</h3>
              <div className="flexColStart gap-2">
                {aboutLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="flexColStart gap-2">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Legal</h3>
              <div className="flexColStart gap-2">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Follow Us */}
            <div className="flexColStart gap-2">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = iconAdapter(social.icon);
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="text-gray-600 hover:text-purple-600 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Versión Mobile */}
          <div className="lg:hidden relative">
            {/* Logo centrado y más grande */}
            <div className="flex items-center justify-center mb-4 py-4">
              <img src={LogoImage} alt="Waveon Logo" className="h-16 w-auto" />
            </div>

            {/* Botón hamburguesa - Alineado a la derecha */}
            <div className="absolute top-4 right-0">
              <button
                onClick={toggleMobileMenu}
                className="p-2 bg-gray-500! text-white! rounded-lg focus:outline-none transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Menú desplegable móvil */}
            {isMobileMenuOpen && (
              <div className="space-y-2 mt-4">
                {/* About Us - Desplegable */}
                <div>
                  <button
                    onClick={() => toggleSection("about")}
                    className="w-full flex items-center justify-between py-2 px-4 bg-gray-500! text-white! font-semibold rounded-lg transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                  >
                    <span>About Us</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openSection === "about" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSection === "about" && (
                    <div className="pl-4 space-y-2 mt-2">
                      {aboutLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="block text-sm text-gray-600 hover:text-purple-600 transition-colors py-1"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Legal - Desplegable */}
                <div>
                  <button
                    onClick={() => toggleSection("legal")}
                    className="w-full flex items-center justify-between py-2 px-4 bg-gray-500! text-white! font-semibold rounded-lg transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                  >
                    <span>Legal</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openSection === "legal" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSection === "legal" && (
                    <div className="pl-4 space-y-2 mt-2">
                      {legalLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="block text-sm text-gray-600 hover:text-purple-600 transition-colors py-1"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Follow Us - Desplegable */}
                <div>
                  <button
                    onClick={() => toggleSection("follow")}
                    className="w-full flex items-center justify-between py-2 px-4 bg-gray-500! text-white! font-semibold rounded-lg transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                  >
                    <span>Follow Us</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openSection === "follow" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSection === "follow" && (
                    <div className="pl-4 flex gap-4 mt-2">
                      {socialLinks.map((social, index) => {
                        const Icon = iconAdapter(social.icon);
                        return (
                          <a
                            key={index}
                            href={social.href}
                            className="text-gray-600 hover:text-purple-600 transition-colors"
                            aria-label={social.label}
                          >
                            <Icon className="w-5 h-5" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Copyright - Integrado en la parte superior (común para desktop y mobile) */}
          <div className="w-full mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Waveon™. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </FlowbiteFooter>
  );
};

export default Footer;
export const NewFooter = Footer;