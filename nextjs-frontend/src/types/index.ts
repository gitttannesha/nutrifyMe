export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  sugarLevel: number;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  barcode: string;
  name: string;
  sugar: number;
  sodium: number;
  ingredients: string;
}

export interface HealthScore {
  id: string;
  userId: string;
  productBarcode: string;
  score: number;
  createdAt: Date;
  product: Product;
}

export interface HealthProfileFormData {
  age: number;
  weight: number;
  height: number;
  sugarLevel: number;
  hasDiabetes: boolean;
  hasHypertension: boolean;
} 