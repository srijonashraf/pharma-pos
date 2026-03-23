// src/app/core/models/customer.model.ts

export interface CustomerDto {
  id: string;
  name: string;
  displayName?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: string;
  isWalking?: boolean;
}

export interface CreateCustomerDto {
  name: string;
  displayName?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: string;
  isWalking?: boolean;
}
