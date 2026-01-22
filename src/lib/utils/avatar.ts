// src/utils/avatar.ts
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

// escolha 1 estilo:
const STYLE = botttsNeutral; // <- bem cartoon e consistente
// outras boas: micah, lorelei, avataaars

export function avatarDataUrl(seed: string) {
  const avatar = createAvatar(STYLE, {
    seed,
    // tamanho do png
    size: 96,
  });

  // PNG data url (bom pra <Image/>)
  return avatar.toDataUri();
}
