import { BASE, hasBase, withBase } from './routes';

/**
 * Markdown links and images are written root-relative (`/media/x.png`,
 * `/#contact`); this applies the deploy base to them. Protocol-relative
 * (`//host`), absolute, relative, fragment-only and already-based URLs are
 * left alone.
 */
export function prefixBase(url: string, base = BASE): string {
  if (!url.startsWith('/') || url.startsWith('//') || hasBase(url, base)) return url;
  return withBase(url, base);
}

type Node = { type: string; url?: string; children?: Node[] };

/** Remark plugin: runs `prefixBase` over every link, image and link definition. */
export function remarkBaseUrl({ base = BASE }: { base?: string } = {}) {
  const walk = (node: Node) => {
    if ((node.type === 'link' || node.type === 'image' || node.type === 'definition') && node.url) {
      node.url = prefixBase(node.url, base);
    }
    node.children?.forEach(walk);
  };
  return (tree: Node) => walk(tree);
}
