import markdownit from "markdown-it";

export function FormatDollar(input: number | undefined, decimalCount = 2, decimal = ".", thousands = ",") {
  if (input) {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = input < 0 ? "-" : "";

    let i = parseInt(((input as any) = Math.abs(Number(input) || 0).toFixed(decimalCount))).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      "$" +
      (j ? i.substring(0, j) + thousands : "") +
      i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(input - parseFloat(i))
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  }

  return "$0.00";
}

export function RenderMarkdown(input: string): { output: string; isMarkdown: boolean } {
  let containsNewlines = RegExp(/.*\n/g).test(input);
  let containsHash = input.includes("#");

  if (containsNewlines || containsHash) {
    return {
      output: markdownit({
        html: true,
        linkify: true,
        typographer: true,
      }).render(input),
      isMarkdown: true,
    };
  }

  return { output: input, isMarkdown: false };
}
