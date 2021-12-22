export interface Profile {
  id: string;
  name: string;
  role: string;
  user_image: string;
  password: string;
  password_confirmation: string;
  affiliate_code: string;
  affiliate_type: string;
  referred_code: string;
  mobile: string;
  birthday: string;
  address_city: string;
  address_state: string;
  address_country: string;
  payment_gateway_id: string;
  registry_code: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  status: string;
  photo: string | ArrayBuffer;
  age: number;
}
