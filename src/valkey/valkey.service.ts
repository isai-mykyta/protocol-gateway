import { ValkeyService } from "@mykyta-isai/node-utils";

export const valkeyService = new ValkeyService({ clientId: process.env.VALKEY_CLIENT_NAME });
