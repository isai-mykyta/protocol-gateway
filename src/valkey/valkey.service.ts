import { ValkeyService } from "@mykyta-isai/node-utils";

export const valkeyService = new ValkeyService({ clientId: process.env.VALKEY_CLIENT_NAME });

valkeyService.init({
  host: process.env.VALKEY_HOST,
  useTls: process.env.VALKEY_USE_TLS === "true",
  isClusterMode: process.env.VALKEY_USE_CLUSTER_MODE === "true",
  clientName: process.env.VALKEY_CLIENT_NAME,
  port: Number(process.env.VALKEY_PORT),
  timeout: Number(process.env.VALKEY_TIMEOUT),
});
