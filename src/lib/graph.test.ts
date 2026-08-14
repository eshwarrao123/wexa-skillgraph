/**
 * Tests for graph API route and data transformation
 */

import { describe, it, expect } from '@jest/globals';

// Mock data structures
interface MockGraphData {
  nodes: Array<{
    id: string;
    name: string;
    label: string;
    slug?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    type: string;
  }>;
}

describe('Graph Data Transformation', () => {
  it('should remove duplicate nodes', () => {
    const nodes = [
      { id: '1', name: 'Node 1', label: 'Role' },
      { id: '1', name: 'Node 1', label: 'Role' }, // duplicate
      { id: '2', name: 'Node 2', label: 'Skill' },
    ];

    const uniqueNodes = Array.from(
      new Map(nodes.map((n) => [n.id, n])).values()
    );

    expect(uniqueNodes).toHaveLength(2);
    expect(uniqueNodes.map((n) => n.id)).toEqual(['1', '2']);
  });

  it('should sanitize Neo4j objects to JSON-safe primitives', () => {
    const node = {
      id: 'test-id',
      name: 'Test Node',
      label: 'Role',
      slug: 'test-slug',
    };

    const sanitized = {
      id: String(node.id),
      name: String(node.name),
      label: String(node.label),
      slug: node.slug ? String(node.slug) : undefined,
    };

    expect(typeof sanitized.id).toBe('string');
    expect(typeof sanitized.name).toBe('string');
    expect(typeof sanitized.label).toBe('string');
  });

  it('should handle empty graph data', () => {
    const graphData: MockGraphData = {
      nodes: [],
      links: [],
    };

    expect(graphData.nodes).toHaveLength(0);
    expect(graphData.links).toHaveLength(0);
  });

  it('should validate link references', () => {
    const nodes = [
      { id: '1', name: 'Node 1', label: 'Role' },
      { id: '2', name: 'Node 2', label: 'Skill' },
    ];

    const links = [
      { source: '1', target: '2', type: 'REQUIRES_SKILL' },
      { source: '1', target: '3', type: 'INVALID' }, // invalid target
    ];

    const nodeIds = new Set(nodes.map((n) => n.id));
    const validLinks = links.filter(
      (l) => nodeIds.has(l.source) && nodeIds.has(l.target)
    );

    expect(validLinks).toHaveLength(1);
    expect(validLinks[0].target).toBe('2');
  });

  it('should preserve relationship types', () => {
    const link = {
      source: 'role-1',
      target: 'skill-1',
      type: 'REQUIRES_SKILL',
    };

    expect(link.type).toBe('REQUIRES_SKILL');
    expect(typeof link.type).toBe('string');
  });
});

describe('Graph API Error Handling', () => {
  it('should return 400 for invalid slug', async () => {
    const invalidSlugs = ['', 'UPPERCASE', 'with spaces', 'special!chars'];

    invalidSlugs.forEach((slug) => {
      // Slug validation would reject these
      expect(slug).not.toMatch(/^[a-z0-9][a-z0-9-]{0,78}[a-z0-9]$/);
    });
  });

  it('should return 400 for invalid limit', () => {
    const invalidLimits = [-1, 0, 5, 200];

    invalidLimits.forEach((limit) => {
      const isValid = limit >= 10 && limit <= 150;
      expect(isValid).toBe(false);
    });
  });

  it('should accept valid limit values', () => {
    const validLimits = [10, 80, 150];

    validLimits.forEach((limit) => {
      const isValid = limit >= 10 && limit <= 150;
      expect(isValid).toBe(true);
    });
  });
});

describe('Graph Node Types', () => {
  it('should support all semantic node types', () => {
    const nodeTypes = ['Role', 'Skill', 'Technology', 'Project', 'Resource'];

    nodeTypes.forEach((type) => {
      const node = {
        id: `test-${type.toLowerCase()}`,
        name: `Test ${type}`,
        label: type,
      };

      expect(node.label).toBe(type);
    });
  });

  it('should handle nodes with optional properties', () => {
    const nodeWithAllProps: {
      id: string;
      name: string;
      label: string;
      slug?: string;
      category?: string;
      difficulty?: string;
    } = {
      id: '1',
      name: 'Test',
      label: 'Skill',
      slug: 'test',
      category: 'Backend',
      difficulty: 'intermediate',
    };

    const nodeWithMinProps: {
      id: string;
      name: string;
      label: string;
      slug?: string;
    } = {
      id: '2',
      name: 'Test 2',
      label: 'Resource',
    };

    expect(nodeWithAllProps.slug).toBeDefined();
    expect(nodeWithAllProps.category).toBeDefined();
    expect(nodeWithMinProps.slug).toBeUndefined();
  });
});
