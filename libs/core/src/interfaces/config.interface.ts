export interface ConfigInterface {
  NODE_ENV: string;

  MAIN_SVC_PORT: string;

  PG_HOST: string;
  PG_DATABASE: string;
  PG_USER: string;
  PG_PASSWORD: string;
  PG_PORT: string;

  DATABASE_URL: string;

  JWT_KEY: string;

  ADMIN_LOGIN: string;
  ADMIN_PASSWORD: string;

  SWAGGER_THEME: string;
}
