#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const siteDir = path.join(root, '_site');

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function read(file) {
	return fs.readFileSync(file, 'utf8');
}

function parseFrontMatter(text) {
	const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*/);
	let front = {};
	let content = text;
	if (match) {
		try {
			front = yaml.load(match[1]) || {};
		} catch (_) {
			front = {};
		}
		content = text.slice(match[0].length).trim();
	}
	return { front, content };
}

function toHtml(md) {
	return md
		.replace(/^### (.*$)/gim, '<h3>$1</h3>')
		.replace(/^## (.*$)/gim, '<h2>$1</h2>')
		.replace(/^# (.*$)/gim, '<h1>$1</h1>')
		.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
		.replace(/\*(.*)\*/gim, '<em>$1</em>')
		.replace(/\n\n/gim, '</p><p>')
		.replace(/\n/gim, '<br>');
}

function slugify(text) {
	return String(text)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
}

function loadCollection(dir) {
	const absDir = path.join(root, 'content', dir);
	if (!fs.existsSync(absDir)) return [];
	return fs
		.readdirSync(absDir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => {
			const text = read(path.join(absDir, f));
			const { front, content } = parseFrontMatter(text);
			return { file: f, front, content };
		});
}

function formatMonthYear(dateStr) {
	const d = new Date(dateStr);
	if (isNaN(d)) return '';
	return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function buildStaticData() {
	const blog = loadCollection('blog')
		.map(({ file, front, content }) => ({
			file,
			title: front.title || '',
			date: front.date || '',
			author: front.author || '',
			slug: path.basename(file, '.md'),
			html: toHtml(content || ''),
			monthYear: formatMonthYear(front.date),
		}))
		.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

	const quiz = loadCollection('quiz')
		.map(({ file, front }) => ({
			question: front.question,
			correct_answer: front.correct_answer,
			alternative_answers: front.alternative_answers || [],
			active: front.active !== false,
			points: front.points || 10,
		}))
		.filter((q) => q && q.question && q.correct_answer && q.active);

	return { blog, quiz };
}

function injectStaticData(template, data) {
	const inject = `<script>window.STATIC_DATA = ${JSON.stringify(data)};</script>`;
	return template.replace(/\<\/body\>/i, `${inject}\n</body>`);
}

function copyDir(from, to) {
	if (!fs.existsSync(from)) return;
	ensureDir(to);
	for (const entry of fs.readdirSync(from)) {
		const src = path.join(from, entry);
		const dst = path.join(to, entry);
		const stat = fs.statSync(src);
		if (stat.isDirectory()) copyDir(src, dst);
		else fs.copyFileSync(src, dst);
	}
}

function build() {
	ensureDir(siteDir);
	const indexTpl = read(path.join(root, 'index.html'));
	const data = buildStaticData();
	const out = injectStaticData(indexTpl, data);
	fs.writeFileSync(path.join(siteDir, 'index.html'), out);
	copyDir(path.join(root, 'assets'), path.join(siteDir, 'assets'));
}

build();