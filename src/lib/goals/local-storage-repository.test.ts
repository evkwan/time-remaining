import { afterEach, describe, expect, it, vi } from 'vitest';

import { LocalStorageGoalsRepository } from './local-storage-repository';
import type { GoalInput } from './types';

const STORAGE_KEY = 'yearleft.goals.v1';

function makeRepo() {
  return new LocalStorageGoalsRepository();
}

const baseInput: GoalInput = {
  title: 'Run a marathon',
  description: 'Berlin race',
  category: 'target',
  targetDate: '2026-10-12',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LocalStorageGoalsRepository', () => {
  it('creates a goal with id, createdAt, active status and trimmed fields', () => {
    const repo = makeRepo();
    const goal = repo.create({
      ...baseInput,
      title: '  Run a marathon  ',
      description: '   Berlin race   ',
    });

    expect(goal.id).toBeTruthy();
    expect(goal.createdAt).toBeTruthy();
    expect(goal.status).toBe('active');
    expect(goal.title).toBe('Run a marathon');
    expect(goal.description).toBe('Berlin race');
  });

  it('stores an empty description as undefined', () => {
    const repo = makeRepo();
    const goal = repo.create({ ...baseInput, description: '   ' });
    expect(goal.description).toBeUndefined();
  });

  it('returns an empty list when storage is empty', () => {
    expect(makeRepo().list()).toEqual([]);
  });

  it('persists under the versioned key', () => {
    makeRepo().create(baseInput);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(1);
    expect(parsed.goals).toHaveLength(1);
  });

  it('updates an existing goal, preserving id and createdAt', () => {
    const repo = makeRepo();
    const goal = repo.create(baseInput);

    const updated = repo.update(goal.id, { title: 'Run an ultra' });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Run an ultra');
    expect(updated!.id).toBe(goal.id);
    expect(updated!.createdAt).toBe(goal.createdAt);
    expect(repo.list()[0].title).toBe('Run an ultra');
  });

  it('returns null when updating an unknown id', () => {
    expect(makeRepo().update('does-not-exist', { title: 'x' })).toBeNull();
  });

  it('removes only the matching goal', () => {
    const repo = makeRepo();
    const a = repo.create(baseInput);
    const b = repo.create({ ...baseInput, title: 'Second' });

    repo.remove(a.id);

    const ids = repo.list().map((g) => g.id);
    expect(ids).toEqual([b.id]);
  });

  it('replaceAll swaps the set and filters out invalid entries', () => {
    const repo = makeRepo();
    const valid = repo.create(baseInput);
    const garbage = [
      { id: 'bad' }, // missing required fields
      'not-an-object',
      null,
    ] as unknown[];

    repo.replaceAll([valid, ...(garbage as never[])]);

    const list = repo.list();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(valid.id);
  });

  it('recovers from corrupt JSON by returning an empty list', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(makeRepo().list()).toEqual([]);
  });

  it('normalizes an unknown category to "other" on read', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        goals: [
          {
            id: 'g1',
            title: 'Weird',
            category: 'nonsense',
            createdAt: '2026-01-01T00:00:00.000Z',
            targetDate: '2026-12-31',
            status: 'active',
          },
        ],
      }),
    );

    expect(makeRepo().list()[0].category).toBe('other');
  });

  it('swallows write failures (e.g. quota / private mode) without throwing', () => {
    const repo = makeRepo();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => repo.create(baseInput)).not.toThrow();
  });
});
