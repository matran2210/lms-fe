export default function VideoBlock({ src }: { src: string }) {
  return <video src={src || ''} controls className="" />
}
