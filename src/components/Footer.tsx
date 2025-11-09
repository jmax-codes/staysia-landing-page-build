"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#283B73] text-white py-12 lg:py-16 mt-16">
      <div className="px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFB400] flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <span className="text-3xl font-bold">Staysia</span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.careers')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.pressMedia')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.safetyInformation')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.cancellationOptions')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.contactSupport')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.hosting')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.becomeAHost')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.hostResources')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.communityForum')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  {t('footer.responsibleHosting')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              {t('footer.allRightsReserved')}
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                {t('footer.cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}