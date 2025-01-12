// lib/api/client.ts
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./v1.d";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://myapi.dev/v1/";

export const fetchClient = createFetchClient<paths>({
  baseUrl,
});

export const $api = createClient(fetchClient);

export default $api;
