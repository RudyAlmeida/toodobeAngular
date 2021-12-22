export interface Subscriptions {
  id?: string;
  payment_gateway_subscription_id?: string;
  user_id: string;
  project_id?: string;
  payment_gateway_customer_id?: string;
  billing_type: string;
  next_due_date: string;
  value: string;
  cycle?: string;
  description: string;
  status?: string;
  credit_card?: string;
}

export interface SubscriptionsList {
  total: number;
  recordsFiltered: number;
  data: [];
}
