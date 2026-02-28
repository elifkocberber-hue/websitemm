import { CeramicProduct } from '@/types/ceramic';
import ceramicData from './ceramics.json';

export const ceramicProducts: CeramicProduct[] = ceramicData as CeramicProduct[];

export const getCeramicProductById = (id: number): CeramicProduct | undefined => {
  return ceramicProducts.find(product => product.id === id);
};

export const getCeramicProductsByCategory = (category: string): CeramicProduct[] => {
  return ceramicProducts.filter(product => product.category === category);
};

export const getCeramicProductsByClayType = (clayType: CeramicProduct['clayType']): CeramicProduct[] => {
  return ceramicProducts.filter(product => product.clayType === clayType);
};

export const getHandmadeCeramics = (): CeramicProduct[] => {
  return ceramicProducts.filter(product => product.handmade);
};

export const getCeramicCategories = (): string[] => {
  return Array.from(new Set(ceramicProducts.map(product => product.category)));
};

export const getClayTypes = (): CeramicProduct['clayType'][] => {
  return Array.from(new Set(ceramicProducts.map(product => product.clayType))) as CeramicProduct['clayType'][];
};
