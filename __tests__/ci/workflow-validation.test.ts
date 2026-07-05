import { describe, it, expect, beforeAll } from '@jest/globals';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';

function kamalDeployStep(workflow: { jobs: { deploy: { steps: Array<{ name?: string; uses?: string; with?: Record<string, unknown> }> } } }) {
  return workflow.jobs.deploy.steps.find((s) => s.name === 'Deploy web with Kamal');
}

describe('GitHub Actions Workflow Configuration', () => {
  const webRoot = path.join(__dirname, '../..');

  describe('deploy-digitalocean-dev.yml', () => {
    let workflow: ReturnType<typeof yaml.parse>;

    beforeAll(() => {
      const workflowPath = path.join(webRoot, '.github/workflows/deploy-digitalocean-dev.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      workflow = yaml.parse(content);
    });

    it('should deploy with Kamal to development', () => {
      const step = kamalDeployStep(workflow);
      expect(step?.uses).toMatch(/kamal-deploy@(v5\.5|feat\/web-kamal-cicd)$/);
      expect(step?.with?.kamal_destination).toBe('development');
      expect(step?.with?.infisical_env).toBe('dev');
    });

    it('should be manual workflow_dispatch only (no push deploy)', () => {
      expect(workflow.on.push).toBeUndefined();
      expect(workflow.on.workflow_dispatch).toBeDefined();
      expect(workflow.on.workflow_dispatch.inputs.kamal_command.default).toBe('remove');
    });

    it('should request OIDC id-token for Infisical export', () => {
      expect(workflow.permissions?.['id-token']).toBe('write');
    });

    it('should have workflow_dispatch trigger', () => {
      expect(workflow.on.workflow_dispatch).toBeDefined();
    });
  });

  describe('deploy-digitalocean-prod.yml', () => {
    let workflow: ReturnType<typeof yaml.parse>;

    beforeAll(() => {
      const workflowPath = path.join(webRoot, '.github/workflows/deploy-digitalocean-prod.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      workflow = yaml.parse(content);
    });

    it('should trigger on *-release tags', () => {
      expect(workflow.on.push.tags).toEqual(['*-release']);
    });

    it('should deploy with Kamal to production with image version', () => {
      const step = kamalDeployStep(workflow);
      expect(step?.uses).toMatch(/kamal-deploy@(v5\.5|feat\/web-kamal-cicd)$/);
      expect(step?.with?.kamal_destination).toBe('production');
      expect(step?.with?.infisical_env).toBe('prod');
      expect(step?.with?.image_version).toBe('${{ steps.version.outputs.version }}');
    });

    it('should resolve release version from tag', () => {
      const step = workflow.jobs.deploy.steps.find(
        (s: { name?: string }) => s.name === 'Resolve release version',
      );
      expect(step).toBeDefined();
    });

    it('should request OIDC id-token for Infisical export', () => {
      expect(workflow.permissions?.['id-token']).toBe('write');
    });

    it('should have workflow_dispatch with version input', () => {
      expect(workflow.on.workflow_dispatch?.inputs?.version).toBeDefined();
    });
  });

  describe('pr-checks.yml', () => {
    it('should run on pull requests to main', () => {
      const workflowPath = path.join(webRoot, '.github/workflows/pr-checks.yml');
      const workflow = yaml.parse(fs.readFileSync(workflowPath, 'utf8'));
      expect(workflow.on.pull_request.branches).toContain('main');
    });

    it('should validate commits with commitlint', () => {
      const workflowPath = path.join(webRoot, '.github/workflows/pr-checks.yml');
      const workflow = yaml.parse(fs.readFileSync(workflowPath, 'utf8'));
      const step = workflow.jobs['lint-test-build'].steps.find(
        (s: { name?: string }) => s.name === 'Validate commit messages',
      );
      expect(step?.run).toContain('commitlint');
    });
  });

  describe('release.yml', () => {
    let workflow: ReturnType<typeof yaml.parse>;

    beforeAll(() => {
      const workflowPath = path.join(webRoot, '.github/workflows/release.yml');
      workflow = yaml.parse(fs.readFileSync(workflowPath, 'utf8'));
    });

    it('should run on push to main', () => {
      expect(workflow.on.push.branches).toContain('main');
      expect(workflow.on.pull_request).toBeUndefined();
    });

    it('should skip release commits with skip ci', () => {
      expect(workflow.jobs.release.if).toContain('[skip ci]');
    });

    it('should run semantic-release with full git permissions', () => {
      expect(workflow.permissions?.contents).toBe('write');
      const step = workflow.jobs.release.steps.find(
        (s: { name?: string }) => s.name === 'Run semantic-release',
      );
      expect(step?.run).toContain('semantic-release');
    });
  });

  describe('.releaserc.json', () => {
    it('should use vX.Y.Z-release tag format for prod deploy', () => {
      const configPath = path.join(webRoot, '.releaserc.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(config.tagFormat).toBe('v${version}-release');
      expect(config.branches).toContain('main');
    });
  });
});
