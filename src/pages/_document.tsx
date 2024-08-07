import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GoogleAnalytics } from '@next/third-parties/google'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
        <Head>
          <link rel="icon" href="/sapp.svg" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"></meta>
          <meta charSet="utf-8"></meta>
          <meta
            name="robots"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
          <meta name="analytics" content="G-HRLKW6S3X0" />
          <meta
            name="csrf-token"
            content="Hl4U5KjkBFkHN2m2ptOE1L8QbTGV19yrEINaOrsd"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta property="og:type" content="website" />
          <meta name="author" content="SAPP Academy" />
          <meta
            property="og:title"
            content="Hệ thống Quản lý học và thi ACCA, CFA trực tuyến SAPP Academy"
            key="title"
          />
          <meta
            name="description"
            content="Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA"
            key="desc"
          />
          <meta
            name="og:description"
            content="Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA"
            key="description"
          />
          <meta
            property="og:image"
            content="https://sapp-lms-fe-prod.vercel.app/thumbnail.webp"
            key="image"
          />
          <meta name="og:url" content={'https://lms-pro.sapp.edu.vn'} />
          <meta
            name="keywords"
            content="sapp, lms, acca, ACCA, CFA, Big4, 3P, SAPP Academy"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Hệ thống Quản lý học và thi ACCA, CFA trực tuyến SAPP Academy"
          />
          <meta
            name="twitter:description"
            content="Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA"
          />
          <meta
            name="twitter:image"
            content="https://sapp-lms-fe-prod.vercel.app/thumbnail.webp"
          />
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
                  })(window,document,'script','dataLayer',"${process.env.NEXT_PUBLIC_GTM_ID}");
            `,
            }}
          />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
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
