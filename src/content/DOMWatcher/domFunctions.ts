/* eslint-disable no-param-reassign */
import {
  DomTextNodes,
  DOMTree,
  Modification,
} from '../../popup/types/baseTypes';

function* ids() {
  let id = 0;
  while (true) {
    yield id++;
  }
}

const idGenerator = ids();

const NODE_ATTRIBUTE = 'data-node-id-nsfw';

const textTags = [
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'P',
  'B',
  'I',
  'STRONG',
  'EM',
  'SMALL',
  'A',
  'LI',
  'SPAN',
  'TD',
  'TH',
  'DETAILS',
  'SUMMARY',
];

const includedTags = [
  ...textTags,
  'UL',
  'OL',
  'TABLE',
  'TR',
  'THEAD',
  'TBODY',
  'DIV',
  'SECTION',
  'ARTICLE',
  'NAV',
  'FOOTER',
  'HEADER',
  'MAIN',
  'ASIDE',
  'BODY',
];

export const stripDOM = (DOM: DOMTree, depth: number = 0): DOMTree | null => {
  // Only keep included tags
  if (!includedTags.includes(DOM.tag)) return null;

  // Process children, incrementing the depth
  const children: DOMTree[] = DOM.children
    .map(child => stripDOM(child, depth + 1))
    .filter(child => child !== null) as DOMTree[];

  // children should not have text unless they are leaf nodes (have no children)
  // This to prevent redundant long text from being sent to the backend
  if (children.length > 0 && !textTags.includes(DOM.tag)) DOM.text = null;

  // If it's not a direct child of the root and has no children or meaningful text, remove it
  if (depth > 1 && children.length === 0 && !DOM.text) return null;

  DOM.children = children;

  return DOM;
};

export const buildDOMTree = (element: Element): DOMTree => {
  let nodeId: string | null = null;

  if (textTags.includes(element.tagName) && element.textContent?.trim()) {
    nodeId = `tn_${idGenerator.next().value}`;
    const prevNodeId = element.getAttribute(NODE_ATTRIBUTE);
    if (prevNodeId) {
      nodeId = prevNodeId;
    }
    element.setAttribute(NODE_ATTRIBUTE, nodeId);
  }

  const nodeData: DOMTree = {
    tag: element.tagName,
    text: element.textContent?.trim() || null,
    children: [],
    id: nodeId,
  };

  element.childNodes.forEach(childNode => {
    nodeData.children.push(buildDOMTree(childNode as Element));
  });

  return nodeData;
};

export const removeUnnecessaryNodes = (DOM: DOMTree): DomTextNodes[] => {
  const nodes: DOMTree[] = [];

  const traverseAmongNodes = (node: DOMTree) => {
    if (node.id) {
      nodes.push(node);
    } else {
      node.children.forEach(child => {
        traverseAmongNodes(child);
      });
    }
  };

  traverseAmongNodes(DOM);

  // remove children of all the nodes & filter out nodes with no text and no id
  const textNodes = nodes
    .filter(node => node.text && node.id)
    .map(node => {
      const { children, ...textNode } = node;
      return textNode as DomTextNodes;
    });

  return textNodes;
};

const sanitize = (text: string) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const buildDOMFromJSON = (modifications: Modification[]) => {
  modifications.forEach(mod => {
    const element = document.querySelector(`[${NODE_ATTRIBUTE}="${mod.id}"]`);
    if (element) {
      // Directly modify text content to preserve event handlers
      element.textContent = sanitize(mod.text);
    }
  });
};

export const getTextNodes = (element: Element): DomTextNodes[] => {
  const bodyDOM = buildDOMTree(element);
  const strippedDOM = stripDOM(bodyDOM, 0);
  if (strippedDOM) {
    return removeUnnecessaryNodes(strippedDOM);
  }
  return [];
};

export const getMetadata = () => {
  // Get the favicon (icon) of the website
  const favicon: HTMLAnchorElement | null =
    document.querySelector("link[rel*='icon']") ||
    document.querySelector("link[rel='shortcut icon']");
  const iconUrl = favicon ? favicon.href : '';

  // Get the title of the website
  const { title } = document;

  // Get the description of the website
  const description = document.querySelector('meta[name="description"]');
  const descriptionContent = description
    ? description.getAttribute('content')
    : '';

  return {
    icon: iconUrl,
    title,
    description: descriptionContent,
  };
};

const DomFunctions = {
  getTextNodes,
  buildDOMFromJSON,
  getMetadata,
};

export default DomFunctions;
