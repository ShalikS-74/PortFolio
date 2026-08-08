import { memo, useMemo } from 'react';
import MorphChar from '@/components/MorphChar';

const BUNGEE_FONT = "'Bungee Inline', 'Anton', sans-serif";
const PIXEL_FONT = "'Press Start 2P', 'Courier New', monospace";
const BUNGEE_SIZE = 'clamp(2.15rem, 6.1vw, 5.25rem)';
const PIXEL_SIZE = 'clamp(1.6rem, 4.5vw, 3.85rem)';

interface MorphingRoleTextProps {
  from: string;
  to: string;
  active: boolean;
  slotCount: number;
  pixelFont: boolean;
}

const MorphingRoleText = memo(function MorphingRoleText({
  from,
  to,
  active,
  slotCount,
  pixelFont,
}: MorphingRoleTextProps) {
  const chars = useMemo(() => {
    const arr = Array.from({ length: slotCount }, (_, index) => {
      const fromChar = from[index] ?? '';
      const toChar = to[index] ?? '';
      if (fromChar === '' && toChar === '') return null;
      return { fromChar, toChar, index };
    });
    // Trim trailing slots with empty toChar so the flex row is tight to the
    // visible text and justify-center centers on glyphs — not on invisible slots.
    while (arr.length > 0) {
      const last = arr[arr.length - 1];
      if (!last || last.toChar === '') arr.pop();
      else break;
    }
    return arr;
  }, [from, slotCount, to]);

  return (
    <div className="relative flex min-h-[7rem] w-full items-center justify-center overflow-hidden text-center sm:min-h-[8rem] md:min-h-[8.5rem] lg:min-h-[11.5rem]">
      <div
        className="flex max-w-[18ch] flex-wrap justify-center text-balance uppercase leading-[0.9] tracking-normal text-[color:var(--ink)]"
        style={{
          fontFamily: pixelFont ? PIXEL_FONT : BUNGEE_FONT,
          fontSize: pixelFont ? PIXEL_SIZE : BUNGEE_SIZE,
          fontWeight: 400,
        }}
      >
        {chars.map((char) =>
          char ? (
            <MorphChar
              key={char.index}
              fromChar={char.fromChar}
              toChar={char.toChar}
              index={char.index}
              active={active}
              pixelFont={pixelFont}
            />
          ) : null,
        )}
      </div>
    </div>
  );
});

export default MorphingRoleText;
