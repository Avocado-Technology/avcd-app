import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

describe('Development Docker Setup - Hot Reload', () => {
  const webRoot = path.join(__dirname, '../..');
  
  describe('Dockerfile.dev', () => {
    it('should exist', () => {
      const dockerfilePath = path.join(webRoot, 'Dockerfile.dev');
      expect(fs.existsSync(dockerfilePath)).toBe(true);
    });

    it('should start the dev server via docker-entrypoint-dev.sh', () => {
      const dockerfilePath = path.join(webRoot, 'Dockerfile.dev');
      const content = fs.readFileSync(dockerfilePath, 'utf8');
      expect(content).toMatch(
        /ENTRYPOINT\s+\[\s*"sh"\s*,\s*".\/docker-entrypoint-dev.sh"\s*\]/,
      );
      const scriptPath = path.join(webRoot, 'docker-entrypoint-dev.sh');
      expect(fs.existsSync(scriptPath)).toBe(true);
      const script = fs.readFileSync(scriptPath, 'utf8');
      expect(script).toContain('exec npm run dev:local');
    });

    it('should be single-stage build (no multi-stage FROM)', () => {
      const dockerfilePath = path.join(webRoot, 'Dockerfile.dev');
      const content = fs.readFileSync(dockerfilePath, 'utf8');
      const fromStatements = content.match(/^FROM /gm) || [];
      expect(fromStatements.length).toBe(1);
    });

    it('should use Node 22', () => {
      const dockerfilePath = path.join(webRoot, 'Dockerfile.dev');
      const content = fs.readFileSync(dockerfilePath, 'utf8');
      expect(content).toMatch(/FROM\s+node:22/);
    });
  });

  describe('docker-compose.yml (development)', () => {
    type DevComposeFile = {
      services: {
        web: {
          build: { dockerfile: string };
          volumes: string[];
          environment: Record<string, string>;
          ports: string[];
          labels?: Record<string, string>;
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

    it('should use Dockerfile.dev', () => {
      expect(composeConfig.services.web.build.dockerfile).toBe('Dockerfile.dev');
    });

    it('should have volume mounts for source code', () => {
      const volumes = composeConfig.services.web.volumes;
      expect(volumes).toBeDefined();
      expect(volumes.some((v: string) => v.includes('.:/app'))).toBe(true);
    });

    it('should isolate node_modules from the bind mount with a dedicated volume', () => {
      const volumes = composeConfig.services.web.volumes;
      expect(
        volumes.some((v: string) => v === 'web_node_modules:/app/node_modules'),
      ).toBe(true);
      expect(composeConfig.volumes?.web_node_modules).toBeDefined();
    });

    it('should exclude .next from volume sync', () => {
      const volumes = composeConfig.services.web.volumes;
      expect(volumes.some((v: string) => v === '/app/.next')).toBe(true);
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
