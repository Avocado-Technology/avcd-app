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

    it('should trigger on Kamal-related paths', () => {
      const paths = workflow.on.push.paths as string[];
      expect(paths).toContain('config/**');
      expect(paths).toContain('.kamal/**');
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
  });

  describe('release-tag-on-merge.yml', () => {
    let workflow: ReturnType<typeof yaml.parse>;

    beforeAll(() => {
      const workflowPath = path.join(webRoot, '.github/workflows/release-tag-on-merge.yml');
      workflow = yaml.parse(fs.readFileSync(workflowPath, 'utf8'));
    });

    it('should run only when a PR to main is merged', () => {
      expect(workflow.on.pull_request.types).toContain('closed');
      expect(workflow.on.pull_request.branches).toContain('main');
      expect(workflow.jobs['tag-release'].if).toBe('github.event.pull_request.merged == true');
    });

    it('should use github-tag-action for semver analysis', () => {
      const step = workflow.jobs['tag-release'].steps.find(
        (s: { name?: string }) => s.name === 'Analyze commits for semver bump',
      );
      expect(step?.uses).toBe('step-security/github-tag-action@v6');
      expect(step?.with?.dry_run).toBe(true);
    });

    it('should require contents write to push tags', () => {
      expect(workflow.permissions?.contents).toBe('write');
    });
  });
});
