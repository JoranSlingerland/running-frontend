import Navbar from '@modules/navbar';
import '../styles/globals.css';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import Footer from '@modules/footer';
import React from 'react';
import useTheme from '@hooks/useTheme';
import { useUserInfo } from '@services/.auth/me';
import { PropsContext } from '@hooks/useProps';
import { useUserSettings } from '@services/user/get';

function MyApp({ Component, pageProps }: AppProps) {
  const userSettings = useUserSettings();
  const { data: userInfo } = useUserInfo();
  const { algorithmTheme, className } = useTheme(
    userSettings.data?.dark_mode || 'system',
  );

  return (
    <PropsContext.Provider
      value={{
        userInfo,
        userSettings,
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: algorithmTheme,

          components: {
            List: {
              paddingContentHorizontalLG: 0,
            },
            Form: {
              marginLG: 8,
            },
          },
        }}
      >
        <div className={`min-h-screen flex flex-col ${className}`}>
          <Navbar />
          <div className="px-2">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </ConfigProvider>
    </PropsContext.Provider>
  );
}

export default MyApp;
