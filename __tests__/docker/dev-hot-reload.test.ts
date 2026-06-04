import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

describe('Development Docker Setup - Hot Reload', () => {
  const webRoot = path.join(__dirname, '../..');

  describe('Dockerfile (dev target)', () => {
    it('should define a dev stage', () => {
      const dockerfilePath = path.join(webRoot, 'Dockerfile');
      const content = fs.readFileSync(dockerfilePath, 'utf8');
      expect(content).toMatch(/FROM\s+.*\s+AS\s+dev/i);
    });

    it('should start the dev server via docker-entrypoint-dev.sh', () => {
      const dockerfilePath = path.join(webRoot, 'Dockerfile');
      const content = fs.readFileSync(dockerfilePath, 'utf8');
      expect(content).toMatch(
        /ENTRYPOINT\s+\[\s*"sh"\s*,\s*".\/docker-entrypoint-dev.sh"\s*\]/,
      );
      const scriptPath = path.join(webRoot, 'docker-entrypoint-dev.sh');
      expect(fs.existsSync(scriptPath)).toBe(true);
      const script = fs.readFileSync(scriptPath, 'utf8');
      expect(script).toContain('exec npm run dev:local');
    });

    it('should use Node 22 in base image', () => {
      const dockerfilePath = path.join(webRoot, 'Dockerfile');
      const content = fs.readFileSync(dockerfilePath, 'utf8');
      expect(content).toMatch(/FROM\s+node:22/);
    });
  });

  describe('docker-compose.yml (development)', () => {
    type DevComposeFile = {
      services: {
        web: {
          build: { dockerfile: string; target?: string };
          volumes: string[];
          environment: Record<string, string>;
          ports: string[];
          labels?: Record<string, string>;
          develop?: { watch: unknown[] };
        };
      };
      volumes?: Record<string, unknown>;
    };

    let composeConfig: DevComposeFile;

    beforeAll(() => {
      const composePath = path.join(webRoot, 'docker-compose.yml');
      const content = fs.readFileSync(composePath, 'utf8');
      composeConfig = yaml.parse(content) as DevComposeFile;
    });

    it('should exist', () => {
      const composePath = path.join(webRoot, 'docker-compose.yml');
      expect(fs.existsSync(composePath)).toBe(true);
    });

    it('should use Dockerfile with dev target', () => {
      expect(composeConfig.services.web.build.dockerfile).toBe('Dockerfile');
      expect(composeConfig.services.web.build.target).toBe('dev');
    });

    it('should use Compose Watch for source sync', () => {
      expect(composeConfig.services.web.develop?.watch?.length).toBeGreaterThan(0);
    });

    it('should not have bind mount for source code (watch handles sync)', () => {
      const volumes = composeConfig.services.web.volumes;
      expect(volumes).toBeDefined();
      expect(volumes.some((v: string) => v.startsWith('.:/app'))).toBe(false);
    });

    it('should isolate node_modules with a named volume (not bind mount)', () => {
      const volumes = composeConfig.services.web.volumes;
      expect(
        volumes.some((v: string) => v === 'app_node_modules:/app/node_modules'),
      ).toBe(true);
      expect(composeConfig.volumes?.app_node_modules).toBeDefined();
      expect(volumes.some((v: string) => v.startsWith('.:/app'))).toBe(false);
    });

    it('should use named volume for .next (not anonymous volume)', () => {
      const volumes = composeConfig.services.web.volumes;
      expect(volumes.some((v: string) => v === 'app_next:/app/.next')).toBe(true);
      expect(composeConfig.volumes?.app_next).toBeDefined();
    });

    it('should set WATCHPACK_POLLING to true', () => {
      expect(composeConfig.services.web.environment.WATCHPACK_POLLING).toBe('true');
    });

    it('should not have Traefik labels', () => {
      expect(composeConfig.services.web.labels).toBeUndefined();
    });

    it('should expose port 3000', () => {
      const ports = composeConfig.services.web.ports;
      expect(ports).toBeDefined();
      expect(ports.some((p: string) => p.includes('3000'))).toBe(true);
    });
  });
});
