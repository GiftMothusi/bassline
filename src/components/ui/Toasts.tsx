"use client";
import { useStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = { success: CheckCircle, error: AlertCircle, info: Info };
const colors = { success: "border-green-500/50", error: "border-red-500/50", info: "border-blue-500/50" };

export default function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="fixed bottom-4 right-4 z-[200] space-y-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`glass rounded-xl px-4 py-3 flex items-center gap-3 min-w-[260px] border-l-2 ${colors[t.type]}`}
            >
              <Icon size={16} className="text-bass-accent shrink-0" />
              <span className="text-sm text-white flex-1">{t.msg}</span>
              <button onClick={() => dismissToast(t.id)} className="text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
