import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

describe('Production Docker Build Configuration', () => {
  const webRoot = path.join(__dirname, '../..');
  let prodComposeConfig: any;

  beforeAll(() => {
    const prodComposePath = path.join(webRoot, 'deploy/production/docker-compose.yml');
    if (fs.existsSync(prodComposePath)) {
      const content = fs.readFileSync(prodComposePath, 'utf8');
      prodComposeConfig = yaml.parse(content);
    }
  });

  it('should have production compose file at deploy/production/docker-compose.yml', () => {
    const prodComposePath = path.join(webRoot, 'deploy/production/docker-compose.yml');
    expect(fs.existsSync(prodComposePath)).toBe(true);
  });

  it('should use production Dockerfile (not .dev)', () => {
    const dockerfile = prodComposeConfig.services.web.build.dockerfile;
    expect(dockerfile).toBe('Dockerfile');
  });

  it('should have build context pointing to web root (../..)', () => {
    const context = prodComposeConfig.services.web.build.context;
    expect(context).toBe('../..');
  });

  it('should have Traefik labels', () => {
    const labels = prodComposeConfig.services.web.labels;
    expect(labels).toBeDefined();
    expect(Array.isArray(labels)).toBe(true);
    expect(labels.some((l: string) => l.includes('traefik.enable=true'))).toBe(true);
  });

  it('should require PUBLIC_HOST environment variable', () => {
    const labels = prodComposeConfig.services.web.labels;
    const hasPublicHostRequirement = labels.some((l: string) => 
      l.includes('${PUBLIC_HOST:?') || l.includes('PUBLIC_HOST')
    );
    expect(hasPublicHostRequirement).toBe(true);
  });

  it('should join avcd_edge network', () => {
    const networks = prodComposeConfig.services.web.networks;
    expect(networks).toBeDefined();
    expect(networks.includes('avcd_edge') || networks.some((n: any) => n === 'avcd_edge')).toBe(true);
  });

  it('should have avcd_edge as external network', () => {
    const networks = prodComposeConfig.networks;
    expect(networks).toBeDefined();
    expect(networks.avcd_edge).toBeDefined();
    expect(networks.avcd_edge.external).toBe(true);
  });

  it('should not have volume mounts (built-in code)', () => {
    const volumes = prodComposeConfig.services.web.volumes;
    expect(volumes).toBeUndefined();
  });
});
