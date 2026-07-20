"use client";

import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { PromoCard, PROMO_CARD_COLORS } from "@/lib/siteContent";

/* ---------------- Single-value fields ---------------- */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 bg-brand-light-gray/30 border border-brand-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
      />
      {hint && <p className="text-[10px] text-brand-gray">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 bg-brand-light-gray/30 border border-brand-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all resize-none"
      />
      {hint && <p className="text-[10px] text-brand-gray">{hint}</p>}
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">{label}</label>
      <ImageUploader
        images={value ? [value] : []}
        onChange={(imgs) => onChange(imgs[0] || "")}
        multiple={false}
        label={label}
      />
      {hint && <p className="text-[10px] text-brand-gray">{hint}</p>}
    </div>
  );
}

/* ---------------- CRUD list editor ----------------
 * Handles two shapes:
 *  - a list of plain strings         (fields = ["value"] shorthand -> pass `stringField`)
 *  - a list of objects with fields    (e.g. {label, href} or {title, desc})
 */

export interface ListFieldDef {
  key: string;
  label: string;
  placeholder?: string;
}

export function ListEditor<T>({
  label,
  items,
  onChange,
  fields,
  addLabel = "Add item",
  hint,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  /** Field definitions for object rows. Omit for a list of plain strings. */
  fields?: ListFieldDef[];
  addLabel?: string;
  hint?: string;
}) {
  const isStringList = !fields || fields.length === 0;

  const blankItem = (): T =>
    (isStringList ? "" : Object.fromEntries(fields!.map((f) => [f.key, ""]))) as T;

  const update = (index: number, next: T) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, blankItem()]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">{label}</label>
        <span className="text-[10px] font-semibold text-brand-gray">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 bg-brand-light-gray/30 border border-brand-border rounded-xl"
          >
            <div className="flex flex-col gap-1 pt-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="p-1 text-brand-gray hover:text-brand-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="p-1 text-brand-gray hover:text-brand-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowDown size={13} />
              </button>
            </div>

            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {isStringList ? (
                <input
                  type="text"
                  value={item as string}
                  onChange={(e) => update(index, e.target.value as T)}
                  placeholder={hint}
                  className="sm:col-span-2 w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                />
              ) : (
                fields!.map((f) => (
                  <input
                    key={f.key}
                    type="text"
                    value={(item as Record<string, string>)[f.key] || ""}
                    onChange={(e) =>
                      update(index, { ...(item as Record<string, string>), [f.key]: e.target.value } as T)
                    }
                    placeholder={f.placeholder || f.label}
                    className="w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                  />
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="Remove item"
              className="shrink-0 p-1.5 mt-0.5 text-brand-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-xs text-brand-gray italic px-1 py-2">No items yet — add one below.</p>
        )}
      </div>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-goat-primary hover:text-goat-hover border border-dashed border-goat-primary/40 hover:border-goat-primary rounded-lg px-3 py-2 transition-colors"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

/* ---------------- Promo Showcase card list editor ---------------- */

export function PromoCardListEditor({
  items,
  onChange,
}: {
  items: PromoCard[];
  onChange: (items: PromoCard[]) => void;
}) {
  const blankItem = (): PromoCard => ({
    imageUrl: "",
    title: "",
    buttonText: "Buy Now",
    buttonLink: "",
    bgColor: PROMO_CARD_COLORS[0].key,
  });

  const update = (index: number, next: PromoCard) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, blankItem()]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
          Promo Cards
        </label>
        <span className="text-[10px] font-semibold text-brand-gray">
          {items.length} {items.length === 1 ? "card" : "cards"}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 bg-brand-light-gray/30 border border-brand-border rounded-xl"
          >
            <div className="flex flex-col gap-1 pt-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="p-1 text-brand-gray hover:text-brand-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="p-1 text-brand-gray hover:text-brand-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowDown size={13} />
              </button>
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <ImageUploader
                images={item.imageUrl ? [item.imageUrl] : []}
                onChange={(imgs) => update(index, { ...item, imageUrl: imgs[0] || "" })}
                multiple={false}
                label="Card Image"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => update(index, { ...item, title: e.target.value })}
                  placeholder="Card title, e.g. Crochet Flower Bouquets"
                  className="w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                />
                <input
                  type="text"
                  value={item.buttonText}
                  onChange={(e) => update(index, { ...item, buttonText: e.target.value })}
                  placeholder="Button text, e.g. Buy Now"
                  className="w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                />
                <input
                  type="text"
                  value={item.buttonLink}
                  onChange={(e) => update(index, { ...item, buttonLink: e.target.value })}
                  placeholder="Button link, e.g. /shop?category=bouquets"
                  className="sm:col-span-2 w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
                  Background
                </span>
                {PROMO_CARD_COLORS.map((color) => (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => update(index, { ...item, bgColor: color.key })}
                    aria-label={color.label}
                    title={color.label}
                    className={`w-7 h-7 rounded-full ${color.className} border-2 transition-all ${
                      item.bgColor === color.key ? "border-brand-black scale-110" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="Remove card"
              className="shrink-0 p-1.5 mt-0.5 text-brand-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-xs text-brand-gray italic px-1 py-2">No promo cards yet — add one below.</p>
        )}
      </div>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-goat-primary hover:text-goat-hover border border-dashed border-goat-primary/40 hover:border-goat-primary rounded-lg px-3 py-2 transition-colors"
      >
        <Plus size={14} /> Add promo card
      </button>
    </div>
  );
}
