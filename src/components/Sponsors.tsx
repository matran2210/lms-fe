import Image from 'next/image';

const Sponsors = () => (
  <div className="flex flex-col items-center mt-8">
    <Image
      src="assets/images/nextjs-starter-banner.png"
      alt="Your Project Logo"
      width={180}
      height={180}
      className="rounded shadow"
    />
  </div>
);

export { Sponsors };
