#!/usr/bin/env node
// Script para refatorar todos os componentes para usar useI18n()
// Rode: node scripts/fix-i18n.mjs

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const COMPONENTS_DIR = 'src/components';
const files = readdirSync(COMPONENTS_DIR).filter(f => f.endsWith('.tsx'));

let fixed = 0;
let skipped = 0;

for (const file of files) {
  const path = join(COMPONENTS_DIR, file);
  let content = readFileSync(path, 'utf-8');

  // Pula se ja usa useI18n
  if (content.includes('useI18n')) {
    console.log(`SKIP: ${file} (ja usa useI18n)`);
    skipped++;
    continue;
  }

  // Pula se nao usa i18n
  if (!content.includes('from "@/i18n"') && !content.includes("from '@/i18n'")) {
    console.log(`SKIP: ${file} (nao usa i18n)`);
    skipped++;
    continue;
  }

  console.log(`FIX: ${file}`);

  // Substitui import
  content = content.replace(
    /import \{ t(, getLocale)? \} from "@\/i18n";\n/,
    'import { useI18n } from "@/i18n/I18nContext";\n'
  );
  content = content.replace(
    /import \{ t, getLocale, subscribe \} from "@\/i18n";\n/,
    'import { useI18n } from "@/i18n/I18nContext";\n'
  );
  content = content.replace(
    /import \{ getLocale, subscribe, t \} from "@\/i18n";\n/,
    'import { useI18n } from "@/i18n/I18nContext";\n'
  );

  // Se usa getLocale(), substitui por const { locale, t } = useI18n()
  if (content.includes('getLocale()')) {
    content = content.replace(/const locale = getLocale\(\);\n/, '');
    content = content.replace(
      /export default function (\w+)/,
      `export default function $1\n  const { locale, t } = useI18n();`
    );
  } else {
    // So usa t()
    content = content.replace(
      /export default function (\w+)/,
      `export default function $1\n  const { t } = useI18n();`
    );
  }

  // Remove useEffect com subscribe
  content = content.replace(
    /\s*const \[, forceUpdate\] = useState\(0\);\n/,
    ''
  );
  content = content.replace(
    /\s*useEffect\(\(\) => \{ const unsub = subscribe\(\(\) => forceUpdate\(\(v\) => v \+ 1\)\); return \(\) => \{ unsub\(\); \}; \}, \[\]\);\n/,
    ''
  );
  content = content.replace(
    /\s*useEffect\(\(\) => \{ const unsub = subscribe\(\(\) => forceUpdate\(\(v\) => v \+ 1\)\); return \(\) => unsub\(\); \}, \[\]\);\n/,
    ''
  );
  // Remove unused import useState/useEffect se sobrar
  if (!content.includes('useState(') && content.includes('import { useState }')) {
    content = content.replace(/import \{ useState \} from "react";\n/, '');
  }
  if (!content.includes('useEffect(') && content.includes('import { useEffect }')) {
    content = content.replace(/import \{ useEffect \} from "react";\n/, '');
  }
  // Limpa imports duplicados ou vazios
  content = content.replace(/import \{\s*\} from "react";\n/, '');

  writeFileSync(path, content);
  fixed++;
}

console.log(`\n=== Resumo ===`);
console.log(`Corrigidos: ${fixed}`);
console.log(`Pulados: ${skipped}`);
console.log(`\nProximo passo: npm run build`);
