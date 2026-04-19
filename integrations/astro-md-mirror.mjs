// integrations/astro-md-mirror.mjs
// Generates a .md mirror alongside every HTML page at build time.
// For "Markdown for Agents" (Cloudflare pattern) — content negotiation via Vercel rewrite.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const DECORATIVE_SELECTORS = [
  '.service-icon',
  '.problem-icon',
  '.step-number',
  '.hero-badge',
  '.badge-dot',
  '.visual-accent',
  '.visual-crescita',
  '.visual-label',
  '.process-arrow',
  '.case-dot',
  '.pillar-badge',
  '.back-link',
  '.visual-number',
  '.carousel-controls',      // ← 1/17 → navigation chrome
  '.affiliation-dot',         // separatori visuali tra loghi network
  '.affiliation-logos',       // loghi immagine network (info già nel testo)
  '.reviews-stars',           // ★★★★★ decorativo
];

/**
 * Preprocess decorative elements: add separators, format labels, compact TrustBar.
 */
function preprocessDecorations($, $main) {
  // TrustBar: trasforma blocco numeri+loghi in riga testuale pulita
  $main.find('.trust-bar').each((i, el) => {
    const $el = $(el);
    const stats = $el.find('.trust-stat').map((_, s) => {
      const $s = $(s);
      const number = $s.find('.stat-number').text().trim();
      const label = $s.find('.stat-label').text().trim();
      return `${number} ${label.toLowerCase()}`;
    }).get();

    if (stats.length > 0) {
        const line = `<strong>In sintesi</strong>: ${stats.join(' · ')}.`;
      $el.html(`<p>${line}</p>`);
    } else {
      $el.remove();
    }
  });

  // Service tags (pills) — add " · " separator between adjacent tags
  $main.find('.service-tag').each((i, el) => {
    const $el = $(el);
    const next = $el.next('.service-tag');
    if (next.length > 0) {
      $el.after(' · ');
    }
  });

  // Quick labels (chi-sono sidebar) — add ": " after label text
  $main.find('.quick-label').each((i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    $el.text(`${text}: `);
  });

  // Case services — generate "Servizi: Tag1 · Tag2 · Tag3"
  $main.find('.case-services').each((i, el) => {
    const $el = $(el);
    const tags = $el.find('.service-tag').map((_, t) => $(t).text().trim()).get();
    if (tags.length > 0) {
      $el.html(`<p>Servizi: ${tags.join(' · ')}</p>`);
    }
  });

  // Case meta (role + duration) — "Role — Duration"
  $main.find('.case-meta').each((i, el) => {
    const $el = $(el);
    const role = $el.find('.case-role').text().trim();
    const duration = $el.find('.case-duration').text().trim();
    if (role && duration) {
      $el.html(`<p>${role} — ${duration}</p>`);
    } else if (role) {
      $el.html(`<p>${role}</p>`);
    }
  });

  // Process mini — join steps with arrow
  $main.find('.process-mini').each((i, el) => {
    const $el = $(el);
    const steps = $el.find('.process-step').map((_, t) => $(t).text().trim()).get();
    if (steps.length > 0) {
      $el.html(`<p>${steps.join(' → ')}</p>`);
    }
  });
}

async function findHtmlFiles(dir, excludePaths = []) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (excludePaths.some((excl) => fullPath.includes(excl))) continue;
    if (entry.isDirectory()) {
      const subResults = await findHtmlFiles(fullPath, excludePaths);
      results.push(...subResults);
    } else if (entry.isFile() && entry.name === 'index.html') {
      results.push(fullPath);
    }
  }
  return results;
}

async function convertHtmlToMarkdown(htmlPath, distDir, siteUrl) {
  const html = await readFile(htmlPath, 'utf-8');
  const $ = cheerio.load(html);

  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';

  const $main = $('main#main');
  if ($main.length === 0) {
    console.warn(`[md-mirror] No <main id="main"> found in ${htmlPath} — skipping`);
    return null;
  }

  $main.find('script').remove();
  $main.find('style').remove();
  $main.find('noscript').remove();
  $main.find('[aria-hidden="true"]').remove();

  // IMPORTANTE: preprocessa PRIMA di rimuovere i selettori decorativi
  // (alcune trasformazioni usano elementi che potrebbero essere dentro blocchi decorativi)
  preprocessDecorations($, $main);

  // Poi rimuovi i decorativi residui
  for (const selector of DECORATIVE_SELECTORS) {
    $main.find(selector).remove();
  }

  const mainHtml = $main.html();

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    linkStyle: 'inlined',
  });

  turndown.addRule('removeEmptyElements', {
    filter: (node) => {
      return (
        node.nodeName === 'DIV' &&
        node.textContent.trim() === '' &&
        node.children.length === 0
      );
    },
    replacement: () => '',
  });

  const markdown = turndown.turndown(mainHtml);
  const cleanedMarkdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  const lastmod = new Date().toISOString().split('T')[0];
  const url = canonical || `${siteUrl}${relative(distDir, htmlPath).replace('/index.html', '/')}`;

  const frontMatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `url: ${JSON.stringify(url)}`,
    `lastmod: ${JSON.stringify(lastmod)}`,
    '---',
    '',
  ].join('\n');

  const mdPath = htmlPath.replace(/index\.html$/, 'index.md');
  const finalContent = frontMatter + cleanedMarkdown + '\n';

  await writeFile(mdPath, finalContent, 'utf-8');
  return mdPath;
}

export default function mdMirror(options = {}) {
  const {
    excludePaths = ['/legal/'],
    siteUrl = 'https://rossozingone.it',
  } = options;

  return {
    name: 'md-mirror',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        logger.info(`Scanning ${distDir}...`);

        const htmlFiles = await findHtmlFiles(distDir, excludePaths);
        logger.info(`Found ${htmlFiles.length} HTML pages to mirror`);

        let successCount = 0;
        let skipCount = 0;

        for (const htmlFile of htmlFiles) {
          try {
            const mdPath = await convertHtmlToMarkdown(htmlFile, distDir, siteUrl);
            if (mdPath) successCount++;
            else skipCount++;
          } catch (err) {
            logger.error(`Failed to convert ${htmlFile}: ${err.message}`);
            skipCount++;
          }
        }

        logger.info(`Done. Generated ${successCount} .md files, skipped ${skipCount}`);
      },
    },
  };
}