import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="font-display font-black text-8xl text-accent mb-4 tracking-tighter">404</h1>
        <h2 className="font-display font-bold text-2xl uppercase mb-4">Halaman Tidak Ditemukan</h2>
        <p className="font-body text-muted-foreground mb-8">
          Sepertinya jalur pendakian yang Anda cari tidak ada atau telah berpindah lokasi. Kembali ke basecamp untuk memulai petualangan baru.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-accent text-white font-display font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default NotFound;
