import { getMuapiApiKeyFromCookies } from '@/lib/ogi/muapi-api-key-cookies.server';
import AgentCreateClient from "./AgentCreateClient";

const BASE_URL = 'https://api.muapi.ai';

async function fetchUserData(apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/v1/account/balance`, {
      cache: "no-store",
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function CreateAgentPage() {
  const apiKey = await getMuapiApiKeyFromCookies();

  const userData = await fetchUserData(apiKey);

  return (
    <AgentCreateClient userData={userData} />
  );
}
