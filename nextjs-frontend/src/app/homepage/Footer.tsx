import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center bg-white pt-12 pb-0">
      <div className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-4 text-center" style={{ fontFamily: 'Pacifico, cursive' }}>
        nutrify<span className="text-green-500">Me</span>
      </div>
      <div className="w-full flex justify-center">
        <Image src="/images/footer.png" alt="footer" width={1920} height={1080} className="object-contain" />
      </div>
    </footer>
  );
}
