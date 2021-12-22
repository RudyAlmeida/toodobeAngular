export interface Documents {
  id?: string;
  user_id: string;
  document_name: string;
  document_status: string;
  user_file?: any;
}

export interface DocumentsList {
  total: number;
  recordsFiltered: number;
  data: [];
}
