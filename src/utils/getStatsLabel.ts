export function getStatLabel(stat: string): string {
  switch (stat) {
    case "height":
      return "Height";
    case "weight":
      return "Weight";
    case "baseExperience":
      return "Base Exp";
    default:
      return stat;
  }
}
