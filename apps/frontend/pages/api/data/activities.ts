import type { NextApiResponse } from 'next';
import { NextApiRequestUnknown } from '@pages/api/types';
import { getToken } from 'next-auth/jwt';
import { activitiesFromCosmos } from '@repo/cosmosdb';
import { getQueryParam } from '@utils/api';

export default async function handler(
  req: NextApiRequestUnknown,
  res: NextApiResponse,
) {
  const token = await getToken({ req });
  if (!token) {
    res.status(401).end();
    return;
  }

  switch (req.method) {
    case 'GET':
      await handleGet(res, req, token.id as string);
      break;
    default:
      res.setHeader('Allow', 'GET');
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

async function handleGet(
  res: NextApiResponse,
  req: NextApiRequestUnknown,
  id: string,
) {
  const startDate = getQueryParam(req.query, 'startDate') || '';
  const endDate = getQueryParam(req.query, 'endDate') || '';
  const activities = await activitiesFromCosmos({
    id,
    startDate,
    endDate,
  });

  return res.status(200).json(activities);
}
