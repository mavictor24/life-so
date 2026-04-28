export interface Movie {
  id: string;
  title: string;
  genre?: string;
  rating?: number;
  url?: string;
  watched?: boolean;
  thumbnail?: string;
}
