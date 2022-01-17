export default interface ShoppingListDocument {
  id: string;
  items: Record<string, Record<string, ShoppingListItem>>;
}

interface ShoppingListItem {
  amount: number;
  checked: boolean;
}
