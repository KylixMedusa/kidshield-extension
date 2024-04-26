import { ChromeMessageType } from '../../popup/types/background';
import { DomTextNodes, PredictionResponse } from '../../popup/types/baseTypes';
import { ImageFilter } from '../Filter/ImageFilter';
import Loader from '../loader';
import DomFunctions from './domFunctions';

export type IDOMWatcher = {
  watch: () => void;
};

export class DOMWatcher implements IDOMWatcher {
  private readonly observer: MutationObserver;

  private readonly imageFilter: ImageFilter;

  constructor() {
    this.observer = new MutationObserver(this.callback.bind(this));
    this.imageFilter = new ImageFilter();

    // on init
    const textNodes = DomFunctions.getTextNodes(document.body);
    const images = this.getImages();
    this.analyzeData(textNodes, images, ChromeMessageType.PREDICTION_REQUEST);
  }

  public watch(): void {
    this.observer.observe(document, DOMWatcher.getConfig());
  }

  public unwatch(): void {
    this.observer.disconnect();
  }

  private callback(mutationsList: MutationRecord[]): void {
    let textNodes: DomTextNodes[] = [];
    let images: string[] = [];
    mutationsList.forEach(mutation => {
      if (mutation.type === 'characterData') {
        textNodes = DomFunctions.getTextNodes(mutation.target as Element);
      } else if (mutation.type === 'attributes') {
        images = this.checkAttributeMutation(mutation);
      } else if (mutation.type === 'childList') {
        const target = mutation.target as Element;
        textNodes = DomFunctions.getTextNodes(target);
        images = this.getImages(target);
      }
    });
    this.analyzeData(
      textNodes,
      images,
      ChromeMessageType.PREDICTION_REQUEST_MODIFICATION,
    );
  }

  private static getConfig(): MutationObserverInit {
    return {
      characterData: true,
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src'],
    };
  }

  private getImages = (element?: Element): string[] => {
    const images: string[] = [];
    const imgElements = (element ?? document.body).querySelectorAll('img');
    imgElements.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        this.imageFilter.analyzeImage(img, true);
        images.push(src);
      }
    });
    return images;
  };

  private checkAttributeMutation(mutation: MutationRecord): string[] {
    if ((mutation.target as HTMLImageElement).nodeName === 'IMG') {
      const src = (mutation.target as HTMLImageElement).getAttribute('src');
      if (src) {
        this.imageFilter.analyzeImage(
          mutation.target as HTMLImageElement,
          mutation.attributeName === 'src',
        );
        return [src];
      }
    }
    return [];
  }

  private analyzeData(
    textNodes: DomTextNodes[],
    images: string[],
    type: ChromeMessageType,
  ): void {
    if (images.length || textNodes.length) {
      chrome.runtime.sendMessage(
        {
          type,
          payload: {
            dom: textNodes,
            images,
          },
        },
        (response: PredictionResponse) => {
          if (
            chrome.runtime.lastError !== null &&
            chrome.runtime.lastError !== undefined
          ) {
            // this._handleBackgroundErrors(
            //   request,
            //   resolve,
            //   chrome.runtime.lastError.message,
            // );
          }
          const { modifications, images: responseImages } = response;
          DomFunctions.buildDOMFromJSON(modifications);
          images.forEach(src => {
            const imgElements = document.querySelectorAll(`img[src="${src}"]`);
            if (imgElements.length) {
              imgElements.forEach(img => {
                this.imageFilter.previewImage(
                  img as HTMLImageElement,
                  responseImages.includes(src),
                );
              });
            }
          });
          Loader.removeLoader();
        },
      );
    }
  }
}
