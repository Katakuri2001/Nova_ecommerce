import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#070a12] px-5 pb-28 pt-16 sm:pb-10 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="NOVA home">
            <span className="nova-mark">
              <span />
            </span>
            <span className="text-[13px] font-semibold tracking-[0.23em] text-white">
              NOVA <b className="font-medium text-white/45">COMMERCE</b>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#718096]">
            A curated marketplace for considered objects, progressive design, and exceptional craft.
          </p>
        </div>
        {[
          ['Discover', 'New arrivals', 'Curated collections', 'Gift cards'],
          ['NOVA', 'Our story', 'Seller studio', 'Journal'],
          ['Support', 'Contact', 'Delivery', 'Returns'],
        ].map(([title, ...links]) => (
          <div key={title}>
            <p className="eyebrow">{title}</p>
            <div className="mt-4 space-y-3 text-sm text-[#718096]">
              {links.map((link) => (
                <p key={link} className="cursor-pointer hover:text-white">
                  {link}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-wrap justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-[#4f5b70]">
        <p>© 2025 NOVA COMMERCE. Curated in Yangon.</p>
        <p>Privacy · Terms · Accessibility</p>
      </div>
    </footer>
  );
}