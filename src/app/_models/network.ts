interface UserStatistics {
  active: number;
  pending: number;
  total: number;
}

export interface Network {
  user_statistics: UserStatistics;
}
