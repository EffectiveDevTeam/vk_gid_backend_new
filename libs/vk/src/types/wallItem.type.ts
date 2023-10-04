export type WallItem = {
  date: number;
  id: number;
  from_id: number;
  created_by?: number;
  views: {
    count: number;
  };
};
