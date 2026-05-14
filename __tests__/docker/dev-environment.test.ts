import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

describe('Development Docker Environment', () => {
  const webRoot = path.join(__dirname, '../..');
  let composeConfig: any;

  beforeAll(() => {
    const composePath = path.join(webRoot, 'docker-compose.yml');
    const content = fs.readFileSync(composePath, 'utf8');
    composeConfig = yaml.parse(content);
  });

  it('should not inline AUTH0_SECRET in compose (use .env.local via env_file)', () => {
    expect(composeConfig.services.web.environment.AUTH0_SECRET).toBeUndefined();
  });

  it('should load NEXT_PUBLIC_AVCD_API_URL from committed .env (env_file), not duplicate in compose', () => {
    const envPath = path.join(webRoot, '.env');
    expect(fs.existsSync(envPath)).toBe(true);
    const envText = fs.readFileSync(envPath, 'utf8');
    expect(envText).toContain('NEXT_PUBLIC_AVCD_API_URL=');
    expect(composeConfig.services.web.environment.NEXT_PUBLIC_AVCD_API_URL).toBeUndefined();
  });

  it('should set NODE_ENV to development', () => {
    expect(composeConfig.services.web.environment.NODE_ENV).toBe('development');
  });

  it('should have WATCHPACK_POLLING set to true', () => {
    expect(composeConfig.services.web.environment.WATCHPACK_POLLING).toBe('true');
  });

  it('should not have Traefik labels (local only)', () => {
    expect(composeConfig.services.web.labels).toBeUndefined();
  });

  it('should not join avcd_edge network (local dev only)', () => {
    const networks = composeConfig.services.web.networks;
    if (networks && Array.isArray(networks)) {
      expect(networks.includes('avcd_edge')).toBe(false);
    }
  });

  it('should support .env.local for secrets', () => {
    const envFile = composeConfig.services.web.env_file;
    expect(envFile).toBeDefined();
    const hasEnvLocal = envFile.some((entry: any) => {
      return typeof entry === 'string' ? entry.includes('.env.local') : entry.path?.includes('.env.local');
    });
    expect(hasEnvLocal).toBe(true);
  });
});
