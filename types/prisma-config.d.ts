declare module "dotenv/config";

declare module "prisma/config" {
  type PrismaConfig = {
    schema?: string;
    migrations?: {
      path?: string;
    };
    datasource?: {
      url?: string;
    };
  };

  export function defineConfig(config: PrismaConfig): PrismaConfig;
}
