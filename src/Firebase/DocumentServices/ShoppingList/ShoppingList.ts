export default interface Day {
  createShoppingList(
    beginningOfWeek: Date,
    list: { [key: string]: any },
    uid: string
  ): Promise<string | null>;

  updateShoppingList(
    beginningOfWeek: Date,
    list: { [key: string]: any },
    uid: string
  ): Promise<void>;

  findDocument(
    start: Date,
    end: Date,
    uid: string
  ): Promise<{ id: string; items: { [key: string]: any } }>;
}
