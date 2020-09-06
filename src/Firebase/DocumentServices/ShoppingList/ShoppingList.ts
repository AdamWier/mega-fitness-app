export default interface Day {
  createShoppingList(
    start: Date,
    end: Date,
    list: { [key: string]: any },
    uid: string
  ): Promise<string | null>;

  updateShoppingList(list: { [key: string]: any }, uid: string): Promise<void>;

  findDocument(
    start: Date,
    end: Date,
    uid: string
  ): Promise<{ id: string; items: { [key: string]: any } }>;
}
