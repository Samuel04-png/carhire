export function Watermark() {
  return (
    <a
      href="https://byteandberry.com"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-2 left-2 z-30 rounded-full border border-white/10 bg-[rgba(10,22,40,0.36)] px-2 py-1 text-[9px] font-medium tracking-[0.12em] text-white/72 backdrop-blur-md transition hover:bg-[rgba(10,22,40,0.56)] hover:text-white sm:bottom-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.18em]"
    >
      Made by Byte&Berry
    </a>
  );
}
