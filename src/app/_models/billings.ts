export interface Billings {
  id?: string;
  user_id: string;
  payment_gateway_customer_id?: string;
  payment_gateway_billing_id?: string;
  due_date: string;
  original_due_date?: string;
  client_payment_date?: null;
  value: string;
  billing_type: string;
  status?: string;
  description: string;
  invoice_url?: string;
  bankslip_url?: string;
}

export interface BillingsList {
  total: number;
  recordsFiltered: number;
  data: [];
}
