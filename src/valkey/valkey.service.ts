import { logger } from "@mykyta-isai/logger";
import { 
  GlideClient, 
  GlideClientConfiguration, 
  GlideClusterClient, 
  GlideClusterClientConfiguration, 
  TimeUnit
} from "@valkey/valkey-glide";

import { ValkeyOptions } from "./types";

class ValkeyService {
  private client: GlideClient | GlideClusterClient;

  public async destroy(): Promise<void> {
    this.client.close();
  }

  public async init(options: ValkeyOptions): Promise<void> {
    const config = {
      addresses: [{ host: options.host, port: options.port }],
      clientName: options.clientName,
      requestTimeout: options.timeout,
      useTLS: options.useTls,
    };

    if (options.isClusterMode) {
      const clusterConfig: GlideClusterClientConfiguration = { ...config };
      this.client = await GlideClusterClient.createClient(clusterConfig);
    } else {
      const standaloneConfig: GlideClientConfiguration = { ...config };
      this.client = await GlideClient.createClient(standaloneConfig);
    }

    logger.info(`[Valkey] client connected. Cluster mode - ${options.isClusterMode}, client name - ${options.clientName}`);
  }

  public async set<V>(key: string, value: V, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      const expiry = { type: TimeUnit.Seconds, count: ttlSeconds };
      await this.client.set(key, JSON.stringify(value), { expiry });
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  public async get<V>(key: string): Promise<V | null> {
    const value = await this.client.get(key);
    if (!value) return null;

    const stringValue = typeof value === "string" ? value : value.toString();
    return JSON.parse(stringValue);
  }

  public async del(keys: string[]): Promise<void> {
    this.client.del(keys);
  }

  public async exists(keys: string[]): Promise<number> {
    const result = await this.client.exists(keys);
    return Number(result);
  }
}

export const valkeyService = new ValkeyService();
