import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        {/* <GoogleTagManager gtmId="GTM-TH9L5T43" /> */}
        <GoogleAnalytics gaId="GTM-TH9L5T43" />
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          ></script>

          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-TH9L5T43');
            `,
            }}
          />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TH9L5T43" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
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
          <script src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"></script>
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
