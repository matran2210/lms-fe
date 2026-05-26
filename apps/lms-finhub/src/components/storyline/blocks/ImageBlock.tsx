import Image from 'next/image'

export default function ImageBlock({ src }: { src: string }) {
  return (
    <Image
      src={src || ''}
      alt=""
      width={600}
      height={400}
      sizes="(max-width: 768px) 100vw, 600px"
      style={{ width: '100%', height: 'auto' }}
    />
  )
}
