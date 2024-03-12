import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Player, Controls } from '@lottiefiles/react-lottie-player'
import animation from 'src/assets/images/animation.json'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/sapp.svg" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
          <script
            src={`https://cdn.tiny.cloud/1/${process.env.NEXT_PUBLIC_TINY_EDITDER_API_KEY}/tinymce/6/tinymce.min.js`}
            referrerPolicy="origin"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
