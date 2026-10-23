import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { activatedWorkspaceIdSet } from '../lib/workspace/workspace-activations.server.js';

test('activatedWorkspaceIdSet collects workspace ids', () => {
  const set = activatedWorkspaceIdSet([
    { workspace_id: 'a', activation_kind: 'sign_in' },
    { workspace_id: 'b', activation_kind: 'team_page_activate' },
  ]);
  assert.equal(set.size, 2);
  assert.ok(set.has('a'));
});

test('team_page_activate is documented in resolve-activated-workspace source', () => {
  const src = readFileSync(new URL('../lib/workspace/resolve-activated-workspace.js', import.meta.url), 'utf8');
  assert.ok(src.includes('team_page_activate'));
});
