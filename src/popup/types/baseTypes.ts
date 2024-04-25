export type Modification = {
  id: string;
  text: string;
};

export type DOMTree = {
  tag: string;
  text: string | null;
  children: DOMTree[];

  id: string | null; // To keep track of unique IDs
};

export type DomTextNodes = Omit<DOMTree, 'children'> & {
  id: string;
};

export interface PredictionResponse {
  url: string;
  modifications: Modification[];
  images: Record<string, boolean>;
}

export interface PredictionRequest {
  dom: DomTextNodes[];
  images: string[];
}
