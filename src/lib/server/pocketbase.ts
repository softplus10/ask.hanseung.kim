import PocketBase from 'pocketbase';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { TypedPocketBase } from '$lib/pocketbase-types';

export function getPocketBase(event: RequestEvent): TypedPocketBase {
  const url = event.platform?.env?.POCKETBASE_URL ?? env.POCKETBASE_URL;

  if (!url) {
    throw new Error('POCKETBASE_URL이 설정되지 않았습니다.');
  }

  return new PocketBase(url) as TypedPocketBase;
}
