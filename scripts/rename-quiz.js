#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const quizDir = path.resolve(__dirname, '..', 'content', 'quiz');

function slugify(text) {
	return String(text)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase()
		.slice(0, 80);
}

function parseFrontMatter(text) {
	const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*/);
	if (!match) return {}; 
	try {
		return yaml.load(match[1]) || {};
	} catch (e) {
		return {};
	}
}

function formatDate(dateStr) {
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return null;
	const yyyy = d.getUTCFullYear();
	const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
	const dd = String(d.getUTCDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

(async () => {
	const files = fs.readdirSync(quizDir).filter((f) => f.endsWith('.md'));
	for (const file of files) {
		const abs = path.join(quizDir, file);
		const text = fs.readFileSync(abs, 'utf8');
		const fm = parseFrontMatter(text);
		const titleBase = fm.question ? slugify(fm.question) : path.parse(file).name.slice(0, 60);
		const dateBase = formatDate(fm.date) || 'unknown-date';
		let base = `${dateBase}-${titleBase}`.replace(/-+/g, '-').replace(/^-|-$/g, '');
		if (!base) base = `renamed-${Date.now()}`;
		let newName = `${base}.md`;
		let i = 1;
		while (fs.existsSync(path.join(quizDir, newName)) && newName !== file) {
			newName = `${base}-${i++}.md`;
		}
		if (newName !== file) {
			fs.renameSync(abs, path.join(quizDir, newName));
			console.log(`${file} -> ${newName}`);
		} else {
			console.log(`${file} unchanged`);
		}
	}
})();