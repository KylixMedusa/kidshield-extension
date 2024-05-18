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

// stripDOM removes unwanted elements from a DOM tree based on specific criteria,
// preserving only the elements and their children that meet the conditions.
export const stripDOM = (DOM: DOMTree, depth: number = 0): DOMTree | null => {
  // Return null if the element's tag is not in the list of included tags.
  if (!includedTags.includes(DOM.tag)) return null;

  // Recursively process child nodes, increasing the depth by one each time.
  const children: DOMTree[] = DOM.children
    .map(child => stripDOM(child, depth + 1)) // Process each child
    .filter(child => child !== null) as DOMTree[]; // Remove null entries

  // Clear text content for non-leaf nodes which shouldn't have text.
  if (children.length > 0 && !textTags.includes(DOM.tag)) {
    DOM.text = null;
  }

  // Exclude non-root nodes that are neither text containers nor have children.
  if (depth > 1 && children.length === 0 && !DOM.text) return null;

  // Assign the filtered children back to the DOM node.
  DOM.children = children;

  return DOM;
};

// buildDOMTree constructs a DOM tree from an HTML element.
export const buildDOMTree = (element: Element): DOMTree => {
  let nodeId: string | null = null;

  // Assign or reassign a unique node ID if the element is a text node.
  if (textTags.includes(element.tagName) && element.textContent?.trim()) {
    nodeId = `tn_${idGenerator.next().value}`; // Generate new node ID.
    const prevNodeId = element.getAttribute(NODE_ATTRIBUTE);
    if (prevNodeId) {
      nodeId = prevNodeId; // Use existing ID if available.
    }
    element.setAttribute(NODE_ATTRIBUTE, nodeId);
  }

  // Construct the basic structure of the DOM tree node.
  const nodeData: DOMTree = {
    tag: element.tagName,
    text: element.textContent?.trim() || null,
    children: [],
    id: nodeId,
  };

  // Recursively build the tree for all child nodes.
  element.childNodes.forEach(childNode => {
    nodeData.children.push(buildDOMTree(childNode as Element));
  });

  return nodeData;
};

// removeUnnecessaryNodes filters out and simplifies nodes in a DOM tree to those containing text.
export const removeUnnecessaryNodes = (DOM: DOMTree): DomTextNodes[] => {
  const nodes: DOMTree[] = [];

  // Traverse the DOM tree and collect nodes with IDs.
  const traverseAmongNodes = (node: DOMTree) => {
    if (node.id) {
      nodes.push(node);
    } else {
      node.children.forEach(child => traverseAmongNodes(child));
    }
  };

  traverseAmongNodes(DOM);

  // Filter for nodes with text and a defined ID, stripping children for simplicity.
  const textNodes = nodes
    .filter(node => node.text && node.id)
    .map(node => {
      const { children, ...textNode } = node;
      return textNode as DomTextNodes;
    });

  return textNodes;
};

// getTextNodes extracts text nodes from an HTML element's DOM.
export const getTextNodes = (element: Element): DomTextNodes[] => {
  const bodyDOM = buildDOMTree(element); // Construct the initial DOM tree.
  const strippedDOM = stripDOM(bodyDOM, 0); // Strip down the DOM to relevant nodes.
  if (strippedDOM) {
    return removeUnnecessaryNodes(strippedDOM); // Extract text nodes from the stripped DOM.
  }
  return [];
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
