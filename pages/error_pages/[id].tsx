import { Divider } from 'antd';

export async function getStaticPaths() {
  return {
    paths: ['401', '403', '404'].map((errorcode) => ({
      params: { id: errorcode },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: { params: { id: string } }) {
  return {
    props: { errorcode: context.params.id },
  };
}

export default function DynamicPage(errorcode: { errorcode: string }) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div>
        <div className="text-center text-9xl">{errorcode.errorcode}</div>
        <Divider />
        <div className="text-2xl align-middle">{errorText(errorcode)}</div>
      </div>
    </div>
  );
}

function errorText(errorcode: { errorcode: string }) {
  if (errorcode.errorcode === '401') {
    return 'You are not authorized to view this page';
  }
  if (errorcode.errorcode === '403') {
    return 'You do not have permissions to view this page';
  }
  if (errorcode.errorcode === '404') {
    return 'The page you are looking for does not exist';
  }
  return 'An error occurred';
}
