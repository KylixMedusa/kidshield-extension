/* eslint-disable no-param-reassign */

import { FilterEffect } from 'popup/types/baseTypes';

export type IImageFilter = {
  analyzeImage: (image: HTMLImageElement, srcAttribute: boolean) => void;
  previewImage: (image: HTMLImageElement, isNSFW: boolean) => void;
};

export class ImageFilter implements IImageFilter {
  private readonly MIN_IMAGE_SIZE: number;

  private filterEffect: FilterEffect;

  constructor({ filterEffect }: { filterEffect: FilterEffect }) {
    this.MIN_IMAGE_SIZE = 41;
    this.filterEffect = filterEffect;
  }

  public analyzeImage(
    image: HTMLImageElement,
    srcAttribute: boolean = false,
  ): void {
    if (
      (srcAttribute || image.dataset.nsfwFilterStatus === undefined) &&
      image.src.length > 0 &&
      ((image.width > this.MIN_IMAGE_SIZE &&
        image.height > this.MIN_IMAGE_SIZE) ||
        image.height === 0 ||
        image.width === 0)
    ) {
      image.dataset.nsfwFilterStatus = 'processing';

      this.hideImage(image);
    }
  }

  public previewImage(image: HTMLImageElement, isNSFW: boolean): void {
    if (isNSFW) {
      if (this.filterEffect === 'blur') {
        image.style.filter = 'blur(25px)';
        this.showImage(image, image.src);
      } else if (this.filterEffect === 'grayscale') {
        image.style.filter = 'grayscale(1)';
        this.showImage(image, image.src);
      }
      image.dataset.nsfwFilterStatus = 'nsfw';
    } else {
      this.showImage(image, image.src);
    }
  }

  private hideImage(image: HTMLImageElement): void {
    if (image.parentNode?.nodeName === 'BODY') image.hidden = true;

    image.style.visibility = 'hidden';
  }

  private showImage(image: HTMLImageElement, url: string): void {
    if (image.src === url) {
      if (image.parentNode?.nodeName === 'BODY') image.hidden = false;

      image.dataset.nsfwFilterStatus = 'sfw';
      image.style.visibility = 'visible';
    }
  }
}
