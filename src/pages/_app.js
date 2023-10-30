import Head from "next/head";
import "../globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>GMX Login</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=yes"
        />
        <meta name="description" content />
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
