import Image from 'next/image'

export default function ImageBlock({ src }: { src: string }) {
  return <Image src={src || ''} alt="" width={600} height={400} />
}
