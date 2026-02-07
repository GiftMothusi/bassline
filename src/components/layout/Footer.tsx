"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Image src="/logo.png" alt="Bassline" width={180} height={64}/>
            <p className="text-sm text-gray-400 max-w-md">
              The voice of the people. Discover, vote, and celebrate South African music and culture — unbiased and community-powered.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Explore</h4>
            <div className="space-y-2">
              {[["Artists", "/artists"], ["Rankings", "/rankings"], ["Events", "/events"], ["News", "/news"]].map(([label, href]) => (
                <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-bass-accent transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">About</h4>
            <p className="text-sm text-gray-400">
              Bassline gives power directly to the community — showcasing what South Africans really think about their music.
            </p>
            <p className="text-sm text-gray-500 mt-4">For the People. By the People.</p>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Bassline. All rights reserved. Artist data powered by Deezer.</p>
        </div>
      </div>
    </footer>
  );
}
