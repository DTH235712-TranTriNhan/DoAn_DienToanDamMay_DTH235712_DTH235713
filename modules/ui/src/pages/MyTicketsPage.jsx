const MyTicketsPage = () => {
  return (
    <div className="py-20 flex flex-col items-center">
      <div className="relative p-1 border-2 border-secondary/50 bg-card backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,255,0.2)] max-w-2xl w-full">
        {/* Decorative corner accents */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

        <div className="bg-secondary/10 px-6 py-4 border-b border-secondary/30 flex justify-between items-center">
          <h2 className="font-heading text-lg text-secondary tracking-widest uppercase font-bold">
            USER_INVENTORY / MY_TICKETS.DAT
          </h2>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-primary/60"></div>
            <div className="h-2 w-2 rounded-full bg-secondary/60"></div>
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="font-sans font-bold text-foreground/70 text-lg mb-4 animate-pulse uppercase tracking-widest">
            &gt; QUERYING_DECRYPTED_STORAGE...
          </p>
          <div className="w-full h-px bg-linear-to-r from-transparent via-secondary/50 to-transparent my-6"></div>
          <p className="text-secondary/80 text-[10px] font-sans font-bold tracking-[0.2em] uppercase">
            [ STATUS: NO_ASSETS_FOUND_IN_VAULT ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;
