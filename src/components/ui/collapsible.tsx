/**
 * @file Shadcn Collapsible component
 * @module components/ui/collapsible
 * @description Wraps @radix-ui/react-collapsible to provide an accessible
 *   collapsible panel. Replaces Headless UI Disclosure.
 */

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

/**
 * Collapsible — root Radix collapsible primitive
 */
const Collapsible = CollapsiblePrimitive.Root;

/**
 * CollapsibleTrigger — element that toggles the collapsible open/closed
 */
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

/**
 * CollapsibleContent — the collapsible panel content
 */
const CollapsibleContent = CollapsiblePrimitive.Content;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
