export default interface ShoppingListDocument {
  id: string;
  items: Record<string, Record<string, ShoppingListItem>>;
  start: Date;
  end: Date;
}

interface ShoppingListItem {
  amount: number;
  checked: boolean;
}
