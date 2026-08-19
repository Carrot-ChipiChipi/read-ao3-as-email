// content.js - AO3 → Outlook disguise (content script, runs on archiveofourown.org)
(function () {
  'use strict';

  const RAW_PARAM = 'view=raw';

  // ============================================================
  // Phase 0: document_start — anti-flash cover + raw mode check
  // ============================================================
  if (new URLSearchParams(location.search).get('view') === 'raw') return;
  // Login page is handled by login.js
  if (location.pathname === '/users/login' || location.pathname === '/users/login/') return;

  const cover = document.createElement('div');
  cover.id = 'outlook-cover';
  document.documentElement.appendChild(cover);

  // ============================================================
  // Build shell
  // ============================================================
  const ICONS = {
    inbox: '<svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="3,5 12,13 21,5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="14" height="14"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M22 2L11 13" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="1.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="11" cy="11" r="7" stroke="#616161" stroke-width="2" fill="none"/><line x1="16" y1="16" x2="22" y2="22" stroke="#616161" stroke-width="2"/></svg>',
    settings: '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" stroke-width="2"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" width="14" height="14"><polyline points="23,4 23,10 17,10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    filter: '<svg viewBox="0 0 24 24" width="14" height="14"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="48" height="48"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#666" stroke-width="1.5" fill="none"/><polyline points="3,5 12,13 21,5" stroke="#666" stroke-width="1.5" fill="none"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    kudos: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    external: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="1.5"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="16" height="16"><polyline points="15,18 9,12 15,6" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    forward: '<svg viewBox="0 0 24 24" width="16" height="16"><polyline points="9,18 15,12 9,6" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
  };

  function buildShell() {
    const root = document.createElement('div');
    root.id = 'outlook-app';
    root.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-left">
          <svg class="outlook-logo" viewBox="0 0 24 24" width="20" height="20">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="#0078d4"/>
            <text x="12" y="15.5" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Segoe UI,sans-serif">M</text>
          </svg>
          <span class="app-name">Marcohard Ourlock</span>
        </div>
        <div class="title-bar-center"></div>
        <div class="title-bar-right">
          <div class="search-container">
            <span class="search-icon">${ICONS.search}</span>
            <input type="text" id="search-input" placeholder="搜索邮件" autocomplete="off">
          </div>
          <button class="title-btn" id="btn-settings" title="设置">${ICONS.settings}</button>
        </div>
      </div>
      <div class="main-content">
        <div class="sidebar">
          <div class="compose-btn">
            <button class="btn-new-email" id="btn-compose">${ICONS.mail.replace('width="48" height="48"','width="16" height="16"').replace('#666','#fff')}<span>新建</span></button>
          </div>
          <nav class="folder-list">
            <button class="folder-item active" data-folder="inbox">${ICONS.inbox}<span class="folder-label">收件箱</span></button>
            <button class="folder-item" data-folder="starred">${ICONS.star}<span class="folder-label">已加星标</span></button>
            <button class="folder-item" data-folder="sent">${ICONS.send}<span class="folder-label">已发送</span></button>
            <button class="folder-item" data-folder="drafts">${ICONS.doc}<span class="folder-label">草稿</span></button>
            <div class="folder-divider"></div>
            <div class="folder-header">文件夹</div>
            <button class="folder-item subfolder" data-folder="fandom">${ICONS.doc}<span class="folder-label">收藏夹</span></button>
          </nav>
          <div class="sidebar-footer">
            <a href="https://archiveofourown.org/users/login" target="_blank" class="user-info" style="text-decoration:none;color:inherit;display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:4px;cursor:pointer;transition:background 0.15s;" id="btn-login">
              <div class="avatar">U</div>
              <span class="user-name">user@ourlock.com</span>
            </a>
          </div>
        </div>
        <div class="email-list-panel">
          <div class="list-header">
            <div class="list-tabs">
              <button class="tab active" data-tab="focused">重点</button>
              <button class="tab" data-tab="other">其他</button>
            </div>
            <div class="list-actions">
              <button class="action-btn" id="btn-filter" title="筛选">${ICONS.filter}</button>
              <button class="action-btn" id="btn-refresh" title="刷新">${ICONS.refresh}</button>
            </div>
          </div>
          <div class="list-info"><span id="result-count">收件箱</span></div>
          <div class="email-list" id="email-list"></div>
          <div class="list-pagination" id="list-pagination" style="display:none;">
            <button id="btn-prev-page" class="page-btn" disabled>上一页</button>
            <span id="page-info"></span>
            <button id="btn-next-page" class="page-btn" disabled>下一页</button>
          </div>
        </div>
        <div class="reading-pane">
          <div class="reading-placeholder" id="reading-placeholder">
            <div class="placeholder-bg" id="placeholder-bg"></div>
            <div class="placeholder-content">
              ${ICONS.mail}
              <p>选择一封邮件阅读</p>
            </div>
          </div>
          <div class="reading-content hidden" id="reading-content">
            <div class="reading-header">
              <h2 class="reading-title" id="reading-title"></h2>
              <div class="reading-meta">
                <div class="sender-info">
                  <div class="sender-avatar" id="reading-avatar">A</div>
                  <div class="sender-details">
                    <span class="sender-name" id="reading-author"></span>
                    <span class="sender-email" id="reading-fandom"></span>
                  </div>
                </div>
                <div class="reading-date" id="reading-date"></div>
              </div>
              <div class="reading-tags" id="reading-tags"></div>
              <div class="reading-stats" id="reading-stats"></div>
            </div>
            <div class="reading-body" id="reading-body"></div>
            <div class="reading-actions">
              <button class="reading-action-btn" id="btn-bookmark">${ICONS.bookmark} 收藏</button>
              <button class="reading-action-btn" id="btn-kudos">${ICONS.kudos} Kudos</button>
              <button class="reading-action-btn" id="btn-comments">评论</button>
              <button class="reading-action-btn" id="btn-open-ao3">${ICONS.external} 原文</button>
            </div>
          </div>
        </div>
      </div>
      <div style="height:0"></div>
    `;
    return root;
  }

  // ============================================================
  // State
  // ============================================================
  let shell = null;
  let els = {};
  let listWorks = [];
  let currentPage = 1;
  let lastPage = 1;
  let listKind = 'inbox'; // inbox | search | tag | fandom | browse
  let searchParams = '';  // base query string for pagination

  // ============================================================
  // Route: decide what to render based on current URL
  // ============================================================
  function route() {
    const path = location.pathname;
    const q = location.search;

    // Check for NSFW confirmation page first
    const adultWarning = document.querySelector('.adult-content-warning, #adult-content-warning, h2.heading');
    const isNSFWPage = adultWarning && adultWarning.textContent.includes('Adult Content');
    const yesLink = document.querySelector('a[href*="view_adult=true"]');

    if (isNSFWPage || (yesLink && !document.querySelector('#chapters'))) {
      renderNSFWConfirmation(yesLink);
    } else if (/^\/works\/\d+(\/chapters\/\d+)?$/.test(path)) {
      renderWorkPage();
    } else if (path.startsWith('/works/search')) {
      renderSearchList();
    } else if (/^\/tags\/.+(\/works)?$/.test(path)) {
      renderSearchList();
    } else if (path === '/media' || /^\/media\/.+/.test(path)) {
      renderMediaPage();
    } else if (path === '/' || path === '/works') {
      loadInbox();
    } else {
      // Unknown page — still show shell with a hint
      setListInfo('收件箱');
      renderListEmpty('没有可显示的邮件');
      setStatus('就绪');
    }
  }

  // ============================================================
  // Inbox: fetch latest works (same-origin fetch from content script)
  // ============================================================
  async function loadInbox() {
    setListInfo('收件箱');
    showListLoading('正在加载...');
    setStatus('正在同步邮件...');
    const url = '/works/search?work_search%5Bsort_column%5D=revised_at&work_search%5Bsort_direction%5D=desc';
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      const html = await res.text();
      const works = parseWorkList(html);
      listWorks = works;
      listKind = 'inbox';
      renderEmailList(works);
      setListInfo(`收件箱 · ${works.length} 封新邮件`);
      setStatus('已同步');
    } catch (e) {
      renderListError('无法连接服务器: ' + e.message);
    }
  }

  // ============================================================
  // Search result page / tag page
  // ============================================================
  function renderSearchList() {
    const works = parseWorkList(document.documentElement.outerHTML);
    listWorks = works;

    // Result count from "NNN Found"
    const heading = document.querySelector('h3.heading')?.textContent || '';
    const m = heading.match(/([\d,]+)\s*Found/);
    const found = m ? m[1] : '';

    // Pagination
    parsePagination();

    const query = new URLSearchParams(location.search).get('work_search[query]');
    listKind = query ? 'search' : 'tag';
    searchParams = location.search;

    if (query) {
      setListInfo(`搜索结果 · ${found || works.length} 封邮件`);
    } else {
      const tagName = decodeURIComponent(location.pathname.split('/')[2] || '');
      setListInfo(`标签: ${tagName} · ${found || works.length} 封邮件`);
    }
    renderEmailList(works);
    setStatus('就绪');
  }

  // ============================================================
  // Media / fandom browse page
  // ============================================================
  function renderMediaPage() {
    const items = [];
    const isMediaRoot = location.pathname === '/media';

    document.querySelectorAll(isMediaRoot ? 'ul.index.group > li' : '#inner ul.index.group > li, #main ul.index.group > li').forEach(li => {
      const a = li.querySelector('a');
      if (!a) return;
      const countEl = li.querySelector('.count');
      items.push({
        name: a.textContent.trim(),
        url: a.getAttribute('href') || a.href,
        count: countEl ? countEl.textContent.trim() : ''
      });
    });

    listKind = 'browse';
    listWorks = [];
    setListInfo(isMediaRoot ? '收藏夹 · 所有分类' : '收藏夹 · 子分类');
    renderFandomList(items);
    setStatus('就绪');
  }

  // ============================================================
  // NSFW Confirmation Page
  // ============================================================
  function renderNSFWConfirmation(yesLink) {
    els.readingPlaceholder.style.display = 'none';
    els.readingContent.classList.remove('hidden');

    const workTitle = document.querySelector('h2.title.heading')?.textContent?.trim() || '';
    const workAuthor = document.querySelector('h3.byline a')?.textContent?.trim() || '';
    const yesHref = yesLink ? yesLink.getAttribute('href') : '';
    const backHref = 'javascript:history.back()';

    els.readingTitle.textContent = workTitle || '成人内容提示';
    els.readingAuthor.textContent = workAuthor || '';
    els.readingFandom.textContent = '';
    els.readingDate.textContent = '';
    els.readingAvatar.textContent = workAuthor ? workAuthor.substring(0, 1).toUpperCase() : '!';
    els.readingAvatar.style.background = '#d83b01';
    els.readingTags.innerHTML = '<span class="reading-tag" style="background:#fde7e9;color:#d13438;">成人内容</span>';
    els.readingStats.innerHTML = '';

    els.readingBody.innerHTML = `
      <div style="max-width:480px;margin:40px auto;text-align:center;">
        <svg viewBox="0 0 24 24" width="64" height="64" style="margin-bottom:20px;opacity:0.6;">
          <path d="M12 2L1 21h22L12 2z" stroke="#d83b01" stroke-width="2" fill="none"/>
          <line x1="12" y1="9" x2="12" y2="14" stroke="#d83b01" stroke-width="2"/>
          <circle cx="12" cy="17" r="1" fill="#d83b01"/>
        </svg>
        <h3 style="font-size:20px;margin-bottom:12px;color:#323130;">成人内容提示</h3>
        <p style="font-size:14px;color:#605e5c;line-height:1.6;margin-bottom:32px;">
          本作品可能包含成人内容。如果您选择继续，即表示您同意查看此类内容。
        </p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <a href="${esc(yesHref)}" style="display:inline-block;padding:10px 32px;background:#0078d4;color:#fff;border-radius:4px;text-decoration:none;font-size:14px;font-weight:500;transition:background 0.15s;">是，继续</a>
          <a href="${esc(backHref)}" style="display:inline-block;padding:10px 32px;background:#fff;color:#323130;border:1px solid #edebe9;border-radius:4px;text-decoration:none;font-size:14px;font-weight:500;transition:background 0.15s;">不，返回</a>
        </div>
        <p style="font-size:12px;color:#a19f9d;margin-top:24px;">
          如果您接受我们的 Cookie 并选择"是，继续"，本次会话期间将不再询问。<br>
          登录后可以保存偏好设置，永久不再询问。
        </p>
      </div>
    `;

    // Hide action buttons for this page
    const actions = shell.querySelector('.reading-actions');
    if (actions) actions.style.display = 'none';

    setStatus('就绪');
  }

  // ============================================================
  // Work Page
  // ============================================================
  function renderWorkPage() {
    const workId = (location.pathname.match(/\/works\/(\d+)/) || [])[1];
    const work = parseWorkPage(document);

    // Show reading pane
    els.readingPlaceholder.style.display = 'none';
    els.readingContent.classList.remove('hidden');

    els.readingTitle.textContent = work.title;
    els.readingAuthor.textContent = work.author;
    els.readingFandom.textContent = work.fandom;
    els.readingDate.textContent = work.date;
    els.readingAvatar.textContent = (work.author || 'A').substring(0, 1).toUpperCase();

    els.readingTags.innerHTML = work.tags.map(t =>
      `<span class="reading-tag">${esc(t)}</span>`
    ).join('');

    els.readingStats.innerHTML = [
      work.words && `<span>${work.words} 字</span>`,
      work.chapters && `<span>${work.chapters} 章</span>`,
      work.kudos && `<span>${work.kudos} Kudos</span>`,
      work.hits && `<span>${work.hits} 阅读</span>`,
      work.comments && `<span>${work.comments} 评论</span>`
    ].filter(Boolean).join('');

    let body = '';
    if (work.chapterTitle) body += `<h3 class="chapter-title">${esc(work.chapterTitle)}</h3>`;
    if (work.notes) body += `<div class="notes"><strong>作者笔记:</strong> ${work.notes}</div>`;
    body += work.storyHtml;
    if (work.endnotes) body += `<div class="notes"><strong>后记:</strong> ${work.endnotes}</div>`;

    // Chapter navigation
    const prevLink = document.querySelector('ul.chapter.navigation li.previous a');
    const nextLink = document.querySelector('ul.chapter.navigation li.next a');
    if (prevLink || nextLink) {
      body += `<div class="chapter-nav">`;
      body += prevLink
        ? `<a class="reading-action-btn" href="${prevLink.href}">${ICONS.back} 上一章</a>`
        : `<span></span>`;
      body += nextLink
        ? `<a class="reading-action-btn" href="${nextLink.href}">下一章 ${ICONS.forward}</a>`
        : `<span></span>`;
      body += `</div>`;
    }

    els.readingBody.innerHTML = body;

    // Action buttons
    els.btnOpenA03.onclick = () => {
      const u = new URL(location.href);
      u.searchParams.set('view', 'raw');
      window.open(u.href, '_blank');
    };
    els.btnComments.onclick = () => {
      const u = new URL(location.href);
      u.searchParams.set('show_comments', 'true');
      u.hash = 'comments';
      location.href = u.href;
    };
    els.btnKudos.onclick = () => {
      const u = new URL(location.href);
      u.searchParams.set('view', 'raw');
      u.hash = 'kudos';
      window.open(u.href, '_blank');
    };
    els.btnBookmark.onclick = () => {
      window.open(`/works/${workId}/bookmarks/new`, '_blank');
    };

    setStatus('就绪');
  }

  // ============================================================
  // Parsers
  // ============================================================
  function parseWorkList(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const works = [];
    doc.querySelectorAll('li.work.blurb').forEach(item => {
      const titleEl = item.querySelector('h4.heading > a');
      const authorEl = item.querySelector('h4.heading a[rel="author"]');
      const fandomEl = item.querySelector('h5.fandoms a.tag');
      const dateEl = item.querySelector('p.datetime');
      const wordsEl = item.querySelector('dd.words');
      const chaptersEl = item.querySelector('dd.chapters');
      const kudosEl = item.querySelector('dd.kudos');
      const hitsEl = item.querySelector('dd.hits');
      const commentsEl = item.querySelector('dd.comments');
      const summaryEl = item.querySelector('blockquote.userstuff');
      const ratingEl = item.querySelector('span.rating span.text');
      const langEl = item.querySelector('dd.language');

      const idMatch = (item.id || '').match(/work_(\d+)/);

      works.push({
        id: idMatch ? idMatch[1] : '',
        title: titleEl ? titleEl.textContent.trim() : 'Untitled',
        author: authorEl ? authorEl.textContent.trim() : 'Anonymous',
        fandom: fandomEl ? fandomEl.textContent.trim() : '',
        date: dateEl ? dateEl.textContent.trim() : '',
        words: wordsEl ? wordsEl.textContent.trim() : '',
        chapters: chaptersEl ? chaptersEl.textContent.trim() : '',
        kudos: kudosEl ? kudosEl.textContent.trim() : '',
        hits: hitsEl ? hitsEl.textContent.trim() : '',
        comments: commentsEl ? commentsEl.textContent.trim() : '',
        language: langEl ? langEl.textContent.trim() : '',
        summary: summaryEl ? summaryEl.textContent.trim().substring(0, 160) : '',
        rating: ratingEl ? ratingEl.textContent.trim() : '',
        url: titleEl ? (titleEl.getAttribute('href') || '') : ''
      });
    });
    return works;
  }

  function parseWorkPage(doc) {
    const title = doc.querySelector('h2.title.heading')?.textContent?.trim() || '';
    const author = doc.querySelector('h3.byline a')?.textContent?.trim() || '';
    const date = doc.querySelector('dd.published')?.textContent?.trim() || '';
    const words = doc.querySelector('dd.words')?.textContent?.trim() || '';
    const chapters = doc.querySelector('dd.chapters')?.textContent?.trim() || '';
    const kudos = doc.querySelector('dd.kudos')?.textContent?.trim() || '';
    const hits = doc.querySelector('dd.hits')?.textContent?.trim() || '';
    const comments = doc.querySelector('dd.comments')?.textContent?.trim() || '';
    const fandomEl = doc.querySelector('dd.fandom a');
    const fandom = fandomEl ? fandomEl.textContent.trim() : '';

    const tags = [];
    doc.querySelectorAll('dd.tags a.tag, dd.relationship a.tag, dd.character a.tag, dd.freeform a.tag').forEach(t => {
      tags.push(t.textContent.trim());
    });

    // Story content: all chapters (try multiple selectors for robustness)
    let storyHtml = '';
    const chaptersContainer = doc.querySelector('#workskin') || doc.querySelector('#chapters') || doc.querySelector('.chapter');
    if (chaptersContainer) {
      const userstuff = chaptersContainer.querySelectorAll('.userstuff, .userstuff.module, #chapters > div.chapter > div.userstuff');
      storyHtml = Array.from(userstuff).map(u => u.innerHTML).join('');
    }
    // Fallback: grab any .userstuff inside .work
    if (!storyHtml) {
      const workDiv = doc.querySelector('.work') || doc.querySelector('#inner');
      if (workDiv) {
        const allStuff = workDiv.querySelectorAll('.userstuff.module, #chapters .userstuff');
        storyHtml = Array.from(allStuff).map(u => u.innerHTML).join('');
      }
    }
    // Last fallback: find the main content area
    if (!storyHtml) {
      const main = doc.querySelector('#main') || doc.querySelector('#workskin');
      if (main) {
        const ps = main.querySelectorAll('p');
        if (ps.length > 3) storyHtml = Array.from(ps).map(p => `<p>${p.innerHTML}</p>`).join('');
      }
    }

    // Chapter title (single chapter view)
    const chapterTitleEl = doc.querySelector('.chapter .title');
    const chapterTitle = chapterTitleEl ? chapterTitleEl.textContent.trim() : '';

    // Notes
    const notesEl = doc.querySelector('.notes.module .userstuff');
    const notes = notesEl ? notesEl.innerHTML : '';

    // Endnotes
    const endnotesEl = doc.querySelector('#work_endnotes .userstuff');
    const endnotes = endnotesEl ? endnotesEl.innerHTML : '';

    return { title, author, date, words, chapters, kudos, hits, comments, fandom, tags, storyHtml, notes, endnotes, chapterTitle };
  }

  function parsePagination() {
    const pageOl = document.querySelector('ol.pagination');
    currentPage = 1;
    lastPage = 1;
    if (!pageOl) return;
    // AO3 doesn't use li.current; current page is the li without an <a>
    pageOl.querySelectorAll('li').forEach(li => {
      if (!li.querySelector('a') && !li.classList.contains('gap')) {
        const num = parseInt(li.textContent.trim());
        if (!isNaN(num)) currentPage = num;
      }
    });
    pageOl.querySelectorAll('a').forEach(a => {
      const p = parseInt(new URL(a.href, location.href).searchParams.get('page') || '');
      if (!isNaN(p) && p > lastPage) lastPage = p;
    });
    if (lastPage < currentPage) lastPage = currentPage;
  }

  // ============================================================
  // Rendering
  // ============================================================
  const AVATAR_COLORS = ['#0078d4', '#107c10', '#d83b01', '#8764b8', '#008272', '#c239b3', '#e3008c', '#d13438'];

  function renderEmailList(works) {
    els.emailList.innerHTML = '';

    if (!works.length) {
      renderListEmpty('没有找到邮件');
      return;
    }

    works.forEach((work, i) => {
      const item = document.createElement('button');
      item.className = 'email-item unread';
      item.dataset.url = work.url || `/works/${work.id}`;
      item.dataset.id = work.id;

      const initials = (work.author || 'AN').substring(0, 2).toUpperCase();
      const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
      const ratingClass = ratingClassOf(work.rating);

      let preview = work.fandom || '';
      if (work.words) preview += (preview ? ' · ' : '') + work.words + ' 字';
      if (work.hits) preview += (preview ? ' · ' : '') + work.hits + ' 阅读';

      item.innerHTML = `
        <div class="email-avatar" style="background:${color}">${esc(initials)}</div>
        <div class="email-content">
          <div class="email-top-row">
            <span class="email-sender">${esc(work.author)}</span>
            <span class="email-time">${esc(work.date)}</span>
          </div>
          <div class="email-subject">${esc(work.title)}</div>
           <div class="email-preview">${esc(preview)}${work.rating ? ` · ${esc(work.rating)}` : ''}</div>
         </div>
      `;

      item.addEventListener('click', () => {
        els.emailList.querySelectorAll('.email-item').forEach(e => e.classList.remove('active'));
        item.classList.add('active');
        if (item.dataset.url) location.href = item.dataset.url;
      });

      els.emailList.appendChild(item);
    });

    updatePagination();
  }

  function renderFandomList(items) {
    els.emailList.innerHTML = '';

    if (!items.length) {
      renderListEmpty('没有找到分类');
      return;
    }

    items.forEach((f, i) => {
      const item = document.createElement('button');
      item.className = 'email-item unread';
      const initials = f.name.substring(0, 2).toUpperCase();
      const color = AVATAR_COLORS[i % AVATAR_COLORS.length];

      item.innerHTML = `
        <div class="email-avatar" style="background:${color}">${esc(initials)}</div>
        <div class="email-content">
          <div class="email-top-row">
            <span class="email-sender">${esc(f.name)}</span>
            ${f.count ? `<span class="email-time">${esc(f.count)}</span>` : ''}
          </div>
          <div class="email-subject" style="font-size:12px;color:#666">点击进入</div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (f.url) location.href = f.url;
      });

      els.emailList.appendChild(item);
    });

    els.listPagination.style.display = 'none';
  }

  function updatePagination() {
    if (lastPage > 1) {
      els.listPagination.style.display = 'flex';
      els.btnPrevPage.disabled = currentPage <= 1;
      els.btnNextPage.disabled = currentPage >= lastPage;
      els.pageInfo.textContent = `第 ${currentPage} / ${lastPage} 页`;
    } else {
      els.listPagination.style.display = 'none';
    }
  }

  function pageUrl(delta) {
    const target = currentPage + delta;
    const u = new URL(location.href);
    u.searchParams.set('page', target);
    return u.href;
  }

  function showListLoading(msg) {
    els.emailList.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <span>${esc(msg)}</span>
      </div>
    `;
  }

  function renderListEmpty(msg) {
    els.emailList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" style="opacity:0.3">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <polyline points="3,5 12,13 21,5" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
        <p>${esc(msg)}</p>
      </div>
    `;
  }

  function renderListError(msg) {
    els.emailList.innerHTML = `
      <div class="error-state">
        <svg viewBox="0 0 24 24" width="32" height="32">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        <p>${esc(msg)}</p>
      </div>
    `;
  }

  // ============================================================
  // Events
  // ============================================================
  function bindEvents() {
    // Search
    els.searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = els.searchInput.value.trim();
        if (q) {
          const u = new URL(location.origin + '/works/search');
          u.searchParams.set('work_search[query]', q);
          location.href = u.href;
        }
      }
    });

    // Folder navigation
    els.folderList.querySelectorAll('.folder-item').forEach(btn => {
      btn.addEventListener('click', () => {
        els.folderList.querySelectorAll('.folder-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const folder = btn.dataset.folder;
        let url = null;
        switch (folder) {
          case 'inbox':
            url = '/works/search?work_search%5Bsort_column%5D=revised_at&work_search%5Bsort_direction%5D=desc';
            break;
          case 'starred':
            url = '/works/search?work_search%5Bsort_column%5D=bookmarks_count&work_search%5Bsort_direction%5D=desc';
            break;
          case 'sent':
            url = '/works/search?work_search%5Bsort_column%5D=word_count&work_search%5Bsort_direction%5D=desc';
            break;
          case 'drafts':
            url = '/works/search?work_search%5Bsort_column%5D=kudos_count&work_search%5Bsort_direction%5D=desc';
            break;
          case 'fandom':
            url = '/media';
            break;
        }
        if (url) location.href = url;
      });
    });

    // Tabs
    els.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        els.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab === 'other') {
          location.href = '/works/search?work_search%5Bsort_column%5D=hits&work_search%5Bsort_direction%5D=desc';
        } else {
          location.href = '/works/search?work_search%5Bsort_column%5D=revised_at&work_search%5Bsort_direction%5D=desc';
        }
      });
    });

    // Refresh
    els.btnRefresh.addEventListener('click', () => location.reload());

    // Settings -> show raw AO3 page
    els.btnSettings.addEventListener('click', () => {
      const u = new URL(location.href);
      u.searchParams.set('view', 'raw');
      location.href = u.href;
    });

    // Compose -> back to inbox
    els.btnCompose.addEventListener('click', () => {
      location.href = '/works/search?work_search%5Bsort_column%5D=revised_at&work_search%5Bsort_direction%5D=desc';
    });

    // Pagination
    els.btnPrevPage.addEventListener('click', () => {
      if (currentPage > 1) location.href = pageUrl(-1);
    });
    els.btnNextPage.addEventListener('click', () => {
      if (currentPage < lastPage) location.href = pageUrl(1);
    });

    // Prevent middle-click / drag navigation issues inside shell
    shell.addEventListener('click', e => {
      if (e.target.closest('a') && e.button === 1) e.preventDefault();
    });
  }

  // ============================================================
  // Helpers
  // ============================================================
  function esc(s) {
    const div = document.createElement('div');
    div.textContent = s == null ? '' : String(s);
    return div.innerHTML;
  }

  function ratingClassOf(rating) {
    if (!rating) return '';
    const r = rating.toLowerCase();
    if (r.includes('general')) return 'rating-g';
    if (r.includes('teen')) return 'rating-t';
    if (r.includes('mature')) return 'rating-m';
    if (r.includes('explicit')) return 'rating-e';
    return '';
  }

  function setListInfo(text) {
    els.resultCount.textContent = text;
  }

  function setStatus(text) {
    // Status bar removed
  }

  // ============================================================
  // Boot
  // ============================================================
  // ============================================================
  // Phase 1: Immediate boot (build shell, show placeholder)
  // ============================================================
  function boot() {
    shell = buildShell();
    document.body.appendChild(shell);
    document.body.style.overflow = 'hidden';
    els = {
      searchInput: shell.querySelector('#search-input'),
      btnSettings: shell.querySelector('#btn-settings'),
      btnCompose: shell.querySelector('#btn-compose'),
      btnRefresh: shell.querySelector('#btn-refresh'),
      btnPrevPage: shell.querySelector('#btn-prev-page'),
      btnNextPage: shell.querySelector('#btn-next-page'),
      pageInfo: shell.querySelector('#page-info'),
      listPagination: shell.querySelector('#list-pagination'),
      folderList: shell.querySelector('.folder-list'),
      tabs: Array.from(shell.querySelectorAll('.list-tabs .tab')),
      emailList: shell.querySelector('#email-list'),
      resultCount: shell.querySelector('#result-count'),
      statusText: null,
      readingPlaceholder: shell.querySelector('#reading-placeholder'),
      readingContent: shell.querySelector('#reading-content'),
      readingTitle: shell.querySelector('#reading-title'),
      readingAuthor: shell.querySelector('#reading-author'),
      readingFandom: shell.querySelector('#reading-fandom'),
      readingDate: shell.querySelector('#reading-date'),
      readingAvatar: shell.querySelector('#reading-avatar'),
      readingTags: shell.querySelector('#reading-tags'),
      readingStats: shell.querySelector('#reading-stats'),
      readingBody: shell.querySelector('#reading-body'),
      btnBookmark: shell.querySelector('#btn-bookmark'),
      btnKudos: shell.querySelector('#btn-kudos'),
      btnComments: shell.querySelector('#btn-comments'),
      btnOpenA03: shell.querySelector('#btn-open-ao3')
    };

    // Background image (starry mountain)
    const bg = shell.querySelector('#placeholder-bg');
    try {
      bg.style.backgroundImage = `url("${chrome.runtime.getURL('bg.jpg')}")`;
    } catch (e) {
      /* non-extension context */
    }

    // Document title
    document.title = 'Marcohard Ourlock';

    bindEvents();
  }

  // ============================================================
  // Phase 2: Parse content when page is ready
  // ============================================================
  function parseAndRender() {
    try {
      route();
    } catch (e) {
      console.error('[Ourlock]', e);
      renderListError('页面解析失败: ' + e.message);
    }
    // Remove cover
    if (cover.parentNode) cover.parentNode.removeChild(cover);
  }

  // Boot as soon as body exists, parse after full load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Wait for page load (scripts, images) before parsing content
  if (document.readyState === 'complete') {
    parseAndRender();
  } else {
    window.addEventListener('load', parseAndRender);
  }

  // Safety net: if load event is slow/fails, parse after 3s anyway
  setTimeout(() => {
    if (cover.parentNode) parseAndRender();
  }, 3000);
})();
