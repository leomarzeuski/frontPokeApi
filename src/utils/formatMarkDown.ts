export function formatMarkdown(markdown: string): string {
  return markdown
    .replace(/# (.*?)\n/g, "<h1>$1</h1>")
    .replace(/## (.*?)\n/g, "<h2>$1</h2>")
    .replace(/### (.*?)\n/g, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/- (.*?)\n/g, "<li>$1</li>");
}
