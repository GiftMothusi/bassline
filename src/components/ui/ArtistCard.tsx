"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface Props {
  id: number;
  name: string;
  picture_big: string;
  nb_fan: number;
  genre?: string;
}

function formatFans(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

export default function ArtistCard({ id, name, picture_big, nb_fan, genre }: Props) {
  return (
    <Link href={`/artists/${id}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative overflow-hidden rounded-2xl bg-bass-surface border border-white/5 hover:border-bass-accent/20 transition-all cursor-pointer"
      >
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={picture_big}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bass-bg via-transparent to-transparent opacity-80" />
        </div>
        <div className="absolute bottom-0 inset-x-0 p-4">
          {genre && (
            <span className="inline-block text-[10px] uppercase tracking-wider text-bass-accent bg-bass-accent/10 px-2 py-0.5 rounded-full mb-2 font-medium">
              {genre}
            </span>
          )}
          <h3 className="text-base font-display font-bold text-white truncate">{name}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Users size={12} /> {formatFans(nb_fan)} fans
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
