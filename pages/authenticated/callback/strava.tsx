import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useRouter } from 'next/router';

import Steps from '@elements/steps';
import { useStravaCallback } from '@services/callback/strava';
import { useEffect } from 'react';

export default function home() {
  const router = useRouter();
  const { code, scope } = router.query;
  const query = { code: code as string, scope: scope as string };

  const { isLoading, isError, data, error } = useStravaCallback({
    query: query,
    enabled: router.isReady,
  });

  useEffect(() => {
    if (!isLoading) {
      setTimeout(
        () => {
          router.push('/authenticated/settings');
        },
        isError ? 5000 : 1000,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError]);

  return (
    <div className="flex justify-center">
      <Steps
        steps={[
          {
            title: 'Processing Strava Authentication',
            status: isLoading ? 'process' : isError ? 'error' : 'finish',
            icon: isLoading ? (
              <Loader2 className="animate-spin" />
            ) : isError ? (
              <XCircle />
            ) : (
              <CheckCircle2 />
            ),
          },
          {
            title: 'Redirecting to settings',
            status: isLoading ? 'wait' : isError ? 'error' : 'finish',
            icon: isLoading ? <></> : <Loader2 className="animate-spin" />,
            description: isError ? error?.json.result : data?.result,
          },
        ]}
        className="w-auto mt-4"
      />
    </div>
  );
}
