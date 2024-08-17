type ShowErrorOptions = {
  message: string;
  faster?: boolean;
}

type ShowInfoOptions = {
  message: string;
}

type ShowSnackbarOptions = {
  message: string;
  timeout?: number | null;
}

declare module "svelte-icons/md/*.svelte";

declare type Item = import('svelte-dnd-action').Item;
declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
	}
}
