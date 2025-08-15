# Design Guide

This guide outlines the shared design tokens available in Tailwind for the FalconTrade frontend.

## Colors

The `brand` palette is available in both background and text utilities.

| Token | Class Examples | Hex |
|-------|----------------|-----|
| `brand` (default) | `text-brand`, `bg-brand` | `#1A56DB` |
| `brand-light` | `text-brand-light`, `bg-brand-light` | `#3B82F6` |
| `brand-dark` | `text-brand-dark`, `bg-brand-dark` | `#1E3A8A` |
| `brand-secondary` | `text-brand-secondary`, `bg-brand-secondary` | `#7E3AF2` |
| `brand-accent` | `text-brand-accent`, `bg-brand-accent` | `#16BDCA` |
| `brand-background` | `bg-brand-background` | `#F5F7FA` |
| `brand-foreground` | `text-brand-foreground` | `#1F2937` |

## Typography

- `font-sans` – applies the base font stack: **Inter**, **Roboto**, `sans-serif` fallback.
- `font-heading` – use for headings; stack of **Roboto**, **Inter**, `sans-serif`.

These utilities can be combined with standard Tailwind text size and weight classes to compose typography styles.
