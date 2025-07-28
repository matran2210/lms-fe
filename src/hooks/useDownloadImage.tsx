const useDownloadImage = () => {
  const downloadImage = async (url: string) => {
    const originalImage = url
    const image = await fetch(originalImage)

    // Split image name
    const nameSplit = originalImage.split('/')
    const duplicateName = nameSplit.pop()

    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
    const link = document.createElement('a')
    link.href = imageURL
    link.download = '' + duplicateName + ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return { downloadImage }
}
export default useDownloadImage
