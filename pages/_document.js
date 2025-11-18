import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {process.env.NEXT_PUBLIC_GA && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA}', {
                    'linker': { 'domains': ['poke-holo.simey.me', 'deck-24abcd.netlify.app'] }
                  });
                `,
              }}
            />
          </>
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

