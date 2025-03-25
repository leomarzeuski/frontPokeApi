export function formatStatValue(stat: string, value: number): string {
  switch (stat) {
    case "height":
      return `${value / 10}m`;
    case "weight":
      return `${value / 10}kg`;
    case "baseExperience":
      return `${value}`;
    default:
      return `${value}`;
  }
}
