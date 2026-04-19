export interface Images {
  medium: string;
  large: string;
  __typename: string;
}

export interface Prices {
  country: string;
  price: number;
  currency: string;
  inCampaign: string | null;
  url: string;
  __typename: string;
}

export interface ProductItem {
  id: string;
  title: string;
  brand: string;
  tags: string[];
  related_items: any[];
  prices: Prices[];
  all_images: Images[];
  __typename: string;
}

export interface SearchCursor {
  country: string;
  page: number;
  __typename: string;
}

export interface SearchProducts {
  products: ProductItem[];
  next: SearchCursor;
  __typename: string;
}

export interface Data {
  searchProducts: SearchProducts;
}

export interface ApiResponse {
  data: Data;
}
