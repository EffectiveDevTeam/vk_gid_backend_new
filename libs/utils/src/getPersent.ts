export const getPersent = (
  full_number: number,
  part_number: number,
  round = true,
): number => {
  const persent = Math.min((part_number / full_number) * 100, 100);
  if (round) return Math.floor(persent);
  return persent;
};
