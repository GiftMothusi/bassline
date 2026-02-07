import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-display font-black text-bass-accent mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-bass-accent text-bass-bg font-semibold px-6 py-3 rounded-xl hover:bg-bass-accent2 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
