import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { HTMLAttributes } from "svelte/elements";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Type utilities for Svelte components
export type WithElementRef<T> = T & {
	ref?: HTMLElement | null;
};

export type WithoutChildren<T> = Omit<T, 'children'>;

export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;

export type WithoutChild<T> = Omit<T, 'child'>;

// Additional utility types
export type HTMLElementProps<T extends HTMLElement = HTMLElement> = HTMLAttributes<T> & {
	ref?: T | null;
};
