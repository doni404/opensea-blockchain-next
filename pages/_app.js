import '../styles/globals.css'
import { ThirdwebProvider } from '@thirdweb-dev/react';

function MyApp({ Component, pageProps }) {
  const desiredChainId = 80001;

  /**
   * Make sure that your app is wrapped with these contexts.
   * If you're using React, you'll have to replace the Component setup with {children}
   */
  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp
