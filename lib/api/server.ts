import createFetchClient from "openapi-fetch";
import { paths } from "./v1";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://myapi.dev/v1/";

export const serverFetchClient = createFetchClient<paths>({
  baseUrl,
  cache: "no-cache",
});
