/**
 * Order Types for MyStoreStory
 *
 * DEPRECATED: Use src/types/domain.ts instead.
 * This file re-exports types from the unified domain model for backward compatibility.
 */

export type {
  CreateOrderRequest, GetOrderRequest, Order, OrderAddress, OrderCustomer, OrderItem, OrderPayment, OrderStatus, PublicOrder, SetOrderStatusRequest,
  SetOrderStatusResponse
} from './domain';
