import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

describe('Docker Setup Integration', () => {
  const webRoot = path.join(__dirname, '../..');
  let devComposeConfig: any;
  let prodComposeConfig: any;

  beforeAll(() => {
    const devComposePath = path.join(webRoot, 'docker-compose.yml');
    const prodComposePath = path.join(webRoot, 'deploy/production/docker-compose.yml');
    
    const devContent = fs.readFileSync(devComposePath, 'utf8');
    const prodContent = fs.readFileSync(prodComposePath, 'utf8');
    
    devComposeConfig = yaml.parse(devContent);
    prodComposeConfig = yaml.parse(prodContent);
  });

  it('should have separate dev and prod compose files', () => {
    const devPath = path.join(webRoot, 'docker-compose.yml');
    const prodPath = path.join(webRoot, 'deploy/production/docker-compose.yml');
    
    expect(fs.existsSync(devPath)).toBe(true);
    expect(fs.existsSync(prodPath)).toBe(true);
  });

  it('dev should use Dockerfile.dev', () => {
    expect(devComposeConfig.services.web.build.dockerfile).toBe('Dockerfile.dev');
  });

  it('prod should use Dockerfile (production)', () => {
    expect(prodComposeConfig.services.web.build.dockerfile).toBe('Dockerfile');
  });

  it('dev should have volumes, prod should not', () => {
    expect(devComposeConfig.services.web.volumes).toBeDefined();
    expect(prodComposeConfig.services.web.volumes).toBeUndefined();
  });

  it('dev should have WATCHPACK_POLLING, prod should not', () => {
    expect(devComposeConfig.services.web.environment.WATCHPACK_POLLING).toBe('true');
    expect(prodComposeConfig.services.web.environment?.WATCHPACK_POLLING).toBeUndefined();
  });

  it('prod should have Traefik labels, dev should not', () => {
    expect(prodComposeConfig.services.web.labels).toBeDefined();
    expect(devComposeConfig.services.web.labels).toBeUndefined();
  });

  it('both should expose port 3000', () => {
    const devPorts = devComposeConfig.services.web.ports;
    const prodPorts = prodComposeConfig.services.web.ports;
    
    expect(devPorts.some((p: string) => p.includes('3000'))).toBe(true);
    expect(prodPorts.some((p: string) => p.includes('3000'))).toBe(true);
  });

  it('Dockerfile.dev and Dockerfile should both exist', () => {
    const devDockerfilePath = path.join(webRoot, 'Dockerfile.dev');
    const prodDockerfilePath = path.join(webRoot, 'Dockerfile');
    
    expect(fs.existsSync(devDockerfilePath)).toBe(true);
    expect(fs.existsSync(prodDockerfilePath)).toBe(true);
  });
});
