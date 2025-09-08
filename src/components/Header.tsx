"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-dark/60 border-b border-primary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo image expected at public/logo.png */}
            <Image
              src="/image/logomarca_transp-red.png"
              alt="PP Tech"
              width={374}
              height={262}
              priority
              className="h-24 w-auto object-contain drop-shadow-[0_0_6px_rgba(235,51,204,0.6)] group-hover:drop-shadow-[0_0_10px_rgba(235,51,204,0.8)] transition-shadow"
            />
            <span className="sr-only">Página inicial</span>
          </Link>

          <nav aria-label="Principal" className="flex items-center gap-6 text-sm text-text-muted">
            {/* Add future links here */}
          </nav>
        </div>
      </div>
    </header>
  );
}
