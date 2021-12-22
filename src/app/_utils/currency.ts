export class Currency {
  static toBrasilianFormat(value: string) {
    const parsed = parseFloat(value);
    return parsed
      .toFixed(2)
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
}
