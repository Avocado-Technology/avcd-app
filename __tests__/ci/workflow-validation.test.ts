import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

describe('GitHub Actions Workflow Configuration', () => {
  const webRoot = path.join(__dirname, '../..');

  describe('deploy-digitalocean-dev.yml', () => {
    let workflow: any;

    beforeAll(() => {
      const workflowPath = path.join(webRoot, '.github/workflows/deploy-digitalocean-dev.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      workflow = yaml.parse(content);
    });

    it('should use deploy/production as compose_subdirectory', () => {
      const subdirectory = workflow.jobs.deploy.steps
        .find((s: any) => s.name === 'Deploy web stack')
        ?.with?.compose_subdirectory;
      expect(subdirectory).toBe('deploy/production');
    });

    it('should trigger on deploy/production changes', () => {
      const paths = workflow.on.push.paths;
      expect(paths).toContain('deploy/production/**');
    });

    it('should request OIDC id-token for Infisical export', () => {
      expect(workflow.permissions?.['id-token']).toBe('write');
    });

    it('should have workflow_dispatch trigger', () => {
      expect(workflow.on.workflow_dispatch).toBeDefined();
    });
  });

  describe('deploy-digitalocean-prod.yml', () => {
    let workflow: any;

    beforeAll(() => {
      const workflowPath = path.join(webRoot, '.github/workflows/deploy-digitalocean-prod.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      workflow = yaml.parse(content);
    });

    it('should use deploy/production as compose_subdirectory', () => {
      const subdirectory = workflow.jobs.deploy.steps
        .find((s: any) => s.name === 'Deploy web stack')
        ?.with?.compose_subdirectory;
      expect(subdirectory).toBe('deploy/production');
    });

    it('should request OIDC id-token for Infisical export', () => {
      expect(workflow.permissions?.['id-token']).toBe('write');
    });

    it('should have workflow_dispatch trigger', () => {
      expect(workflow.on.workflow_dispatch).toBeDefined();
    });
  });
});
