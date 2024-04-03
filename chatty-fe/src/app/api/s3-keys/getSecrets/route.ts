import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { NextResponse } from 'next/server';

export async function GET() {
  const secret_name = 'wequiz/aws/front';

  const client = new SecretsManagerClient({
    region: 'ap-northeast-2',
  });
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: 'AWSCURRENT',
      }),
    );
    const secrets = response.SecretString;
    const keys = JSON.parse(secrets || '{}');
    return NextResponse.json(keys);
  } catch (error) {
    console.error(error);
  }
}
