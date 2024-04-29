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
  modifications: Modification[];
  images: string[];
}

export interface PredictionRequest {
  url: string;
  dom: DomTextNodes[];
  images: string[];
}

export type FilterEffect = 'hide' | 'blur' | 'grayscale';

export interface User {
  isExtensionEnabled: boolean;
  filterStrictness: number;
  imageFilterMode: FilterEffect;
}
