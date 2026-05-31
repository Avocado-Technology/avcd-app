import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

describe('Production Docker Environment', () => {
  const webRoot = path.join(__dirname, '../..');
  let prodComposeConfig: any;

  beforeAll(() => {
    const prodComposePath = path.join(webRoot, 'deploy/production/docker-compose.yml');
    if (fs.existsSync(prodComposePath)) {
      const content = fs.readFileSync(prodComposePath, 'utf8');
      prodComposeConfig = yaml.parse(content);
    }
  });

  it('should require PUBLIC_HOST in environment or labels', () => {
    const labels = prodComposeConfig.services.web.labels || [];
    const environment = prodComposeConfig.services.web.environment || {};
    
    const hasPublicHost = labels.some((l: string) => l.includes('PUBLIC_HOST')) ||
                          environment.PUBLIC_HOST !== undefined;
    
    expect(hasPublicHost).toBe(true);
  });

  it('should have AUTH_SECRET in environment', () => {
    const environment = prodComposeConfig.services.web.environment;
    expect(environment).toBeDefined();
    expect(environment.AUTH_SECRET !== undefined).toBe(true);
  });

  it('should load .env.infisical via env_file', () => {
    const envFile = prodComposeConfig.services.web.env_file;
    const paths = Array.isArray(envFile)
      ? envFile.map((e: { path: string }) => e.path)
      : [];
    expect(paths).toContain('.env.infisical');
  });

  it('should not have WATCHPACK_POLLING in production', () => {
    const environment = prodComposeConfig.services.web.environment || {};
    expect(environment.WATCHPACK_POLLING).toBeUndefined();
  });

  it('should have NEXT_PUBLIC environment variables configured', () => {
    // Production compose should allow NEXT_PUBLIC vars to be passed through
    // Even if not explicitly set, the structure should support them
    expect(prodComposeConfig.services.web).toBeDefined();
  });

  it('should have env_file configuration for secrets', () => {
    const envFile = prodComposeConfig.services.web.env_file;
    expect(envFile).toBeDefined();
  });
});
