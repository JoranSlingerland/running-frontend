import { CosmosClient, ItemResponse, ItemDefinition } from '@azure/cosmos';

function cosmosClient() {
  const endpoint = process.env.COSMOSDB_ENDPOINT as string;
  const key = process.env.COSMOSDB_KEY;
  const database = process.env.COSMOSDB_DATABASE as string;

  const cosmosClient = new CosmosClient({ endpoint, key });
  const cosmosDatabase = cosmosClient.database(database);

  return { cosmosClient, cosmosDatabase };
}

function cosmosContainer(containerName: string) {
  const { cosmosDatabase } = cosmosClient();
  return cosmosDatabase.container(containerName);
}

async function containerFunctionWithBackOff(
  functionToExecute: () => Promise<ItemResponse<ItemDefinition>>,
  maxRetries: number = 5,
  maxDelay: number = 5,
): Promise<{
  result: ItemResponse<ItemDefinition> | undefined;
  isError: boolean;
}> {
  let isError = false;
  let retryCount = 0;
  let delay = Math.random();
  let result: ItemResponse<ItemDefinition> | undefined = undefined;

  const operation = async () => {
    const result = await functionToExecute();

    if (result.statusCode >= 200 && result.statusCode < 300) {
      return result;
    }

    isError = true;

    if (result.statusCode === 404) {
      console.debug('Item not found');
    } else if (result.statusCode === 409) {
      console.debug('Item already exists');
    } else {
      console.error('Something went wrong');
    }

    return result;
  };

  while (true) {
    try {
      result = await operation();
      break;
    } catch (error) {
      retryCount += 1;

      if (retryCount > maxRetries) {
        console.error('Max retries reached, See error below:');
        console.error(error);
        isError = true;
        break;
      }

      console.debug(error);
      console.debug(`Retrying in ${delay} seconds`);

      await new Promise((resolve) => setTimeout(resolve, delay * 1000));

      delay = Math.min(delay * 2, maxDelay);
    }
  }

  return { result, isError };
}

function removeKeys(
  obj: Record<string, unknown>,
  keys: string[] = ['_rid', '_self', '_etag', '_attachments', '_ts'],
): Record<string, unknown> {
  const newObj = { ...obj };

  keys.forEach((key) => {
    delete newObj[key];
  });

  return newObj;
}

export {
  cosmosClient,
  cosmosContainer,
  containerFunctionWithBackOff,
  removeKeys,
};
