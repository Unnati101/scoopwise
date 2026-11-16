'use client';

import { CornerDownLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState, type KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useI18n } from '@/i18n/provider';
import { searchItems, type SearchItem } from '@/lib/searchIndex';
import { cn } from '@/lib/utils';

interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
}

function PaletteContent({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const router = useRouter();
  const { t, m } = useI18n();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = searchItems(items, query);
  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  const choose = (item: SearchItem) => {
    router.push(item.href);
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((activeIndex + 1) % Math.max(1, results.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((activeIndex - 1 + results.length) % Math.max(1, results.length));
    } else if (event.key === 'Enter') {
      const item = results[activeIndex];
      if (item) choose(item);
    }
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          autoFocus
          type="search"
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-activedescendant={results[activeIndex] ? `${listId}-${results[activeIndex].id}` : undefined}
          aria-label={t('search.label')}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t('search.placeholder')}
          className="h-12 w-full rounded-xl border-2 border-border bg-surface pl-10 pr-4 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0"
        />
      </div>

      <ul id={listId} role="listbox" aria-label={t('search.results')} className="mt-3 max-h-72 space-y-1 overflow-y-auto">
        {results.map((item, index) => (
          <li
            key={item.id}
            id={`${listId}-${item.id}`}
            role="option"
            aria-selected={index === activeIndex}
            onMouseMove={() => setActive(index)}
            onClick={() => choose(item)}
            className={cn('flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5', index === activeIndex ? 'bg-blush' : 'hover:bg-muted')}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{item.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
            </span>
            <Badge variant={item.kind === 'Page' ? 'muted' : item.kind === 'Flavor' ? 'primary' : 'secondary'}>{m.search.kinds[item.kind]}</Badge>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground" role="status">
          {t('search.none', { query })}
        </p>
      )}
      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <CornerDownLeft className="h-3 w-3" aria-hidden /> {t('search.hint')}
      </p>
    </div>
  );
}

export function SearchPalette({ open, onClose, items }: SearchPaletteProps) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onClose={onClose} title={t('search.title')}>
      <PaletteContent items={items} onClose={onClose} />
    </Dialog>
  );
}
