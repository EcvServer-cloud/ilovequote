// Tiny vector icon set for the cotización PDF, drawn with jsPDF's native
// shape primitives (circle/rect/line/triangle) — no icon fonts, so nothing
// depends on glyphs that might not embed/render consistently across PDF
// viewers. Kept local to cotización on purpose (see pdf.js for context).

const ICONS = {
	phone(doc, cx, cy, r, color) {
		doc.setFillColor(color);
		doc.roundedRect(cx - r * 0.35, cy - r, r * 0.7, r * 2, r * 0.3, r * 0.3, 'F');
	},
	mail(doc, cx, cy, r, color) {
		doc.setDrawColor(color);
		doc.setLineWidth(0.6);
		doc.rect(cx - r, cy - r * 0.6, r * 2, r * 1.2, 'S');
		doc.line(cx - r, cy - r * 0.6, cx, cy + r * 0.1);
		doc.line(cx + r, cy - r * 0.6, cx, cy + r * 0.1);
	},
	pin(doc, cx, cy, r, color) {
		doc.setFillColor(color);
		doc.circle(cx, cy - r * 0.2, r * 0.55, 'F');
		doc.triangle(cx - r * 0.4, cy, cx + r * 0.4, cy, cx, cy + r * 0.9, 'F');
	},
	idcard(doc, cx, cy, r, color) {
		doc.setDrawColor(color);
		doc.setLineWidth(0.6);
		doc.roundedRect(cx - r, cy - r * 0.65, r * 2, r * 1.3, r * 0.2, r * 0.2, 'S');
		doc.setFillColor(color);
		doc.circle(cx - r * 0.5, cy, r * 0.22, 'F');
		doc.line(cx - r * 0.1, cy - r * 0.25, cx + r * 0.7, cy - r * 0.25);
		doc.line(cx - r * 0.1, cy + r * 0.05, cx + r * 0.7, cy + r * 0.05);
		doc.line(cx - r * 0.1, cy + r * 0.3, cx + r * 0.4, cy + r * 0.3);
	},
	calendar(doc, cx, cy, r, color) {
		doc.setDrawColor(color);
		doc.setLineWidth(0.6);
		doc.roundedRect(cx - r, cy - r * 0.7, r * 2, r * 1.5, r * 0.15, r * 0.15, 'S');
		doc.line(cx - r, cy - r * 0.15, cx + r, cy - r * 0.15);
		doc.setFillColor(color);
		doc.rect(cx - r * 0.55, cy - r * 0.95, r * 0.18, r * 0.4, 'F');
		doc.rect(cx + r * 0.37, cy - r * 0.95, r * 0.18, r * 0.4, 'F');
	},
	clock(doc, cx, cy, r, color) {
		doc.setDrawColor(color);
		doc.setLineWidth(0.7);
		doc.circle(cx, cy, r * 0.85, 'S');
		doc.line(cx, cy, cx, cy - r * 0.55);
		doc.line(cx, cy, cx + r * 0.4, cy + r * 0.1);
	},
	person(doc, cx, cy, r, color) {
		doc.setFillColor(color);
		doc.circle(cx, cy - r * 0.35, r * 0.4, 'F');
		doc.ellipse(cx, cy + r * 0.45, r * 0.65, r * 0.5, 'F');
	},
	document(doc, cx, cy, r, color) {
		doc.setDrawColor(color);
		doc.setLineWidth(0.6);
		doc.rect(cx - r * 0.7, cy - r * 0.9, r * 1.4, r * 1.8, 'S');
		doc.line(cx - r * 0.4, cy - r * 0.35, cx + r * 0.4, cy - r * 0.35);
		doc.line(cx - r * 0.4, cy, cx + r * 0.4, cy);
		doc.line(cx - r * 0.4, cy + r * 0.35, cx + r * 0.1, cy + r * 0.35);
	},
	shield(doc, cx, cy, r, color) {
		doc.setFillColor(color);
		doc.rect(cx - r * 0.75, cy - r * 0.9, r * 1.5, r * 1.3, 'F');
		doc.triangle(cx - r * 0.75, cy + r * 0.4, cx + r * 0.75, cy + r * 0.4, cx, cy + r, 'F');
	},
	dollar(doc, cx, cy, r, color) {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(r * 1.6);
		doc.setTextColor(color);
		doc.text('$', cx, cy + r * 0.35, { align: 'center' });
	},
	pencil(doc, cx, cy, r, color) {
		doc.setDrawColor(color);
		doc.setLineWidth(1);
		doc.line(cx - r * 0.6, cy + r * 0.6, cx + r * 0.5, cy - r * 0.5);
		doc.setFillColor(color);
		doc.triangle(cx + r * 0.5, cy - r * 0.5, cx + r * 0.75, cy - r * 0.25, cx + r * 0.25, cy - r * 0.75, 'F');
	},
	bank(doc, cx, cy, r, color) {
		doc.setFillColor(color);
		doc.triangle(cx - r * 0.85, cy - r * 0.15, cx + r * 0.85, cy - r * 0.15, cx, cy - r * 0.9, 'F');
		doc.rect(cx - r * 0.75, cy - r * 0.15, r * 1.5, r * 0.15, 'F');
		doc.setDrawColor(color);
		doc.setLineWidth(0.6);
		doc.line(cx - r * 0.5, cy, cx - r * 0.5, cy + r * 0.6);
		doc.line(cx, cy, cx, cy + r * 0.6);
		doc.line(cx + r * 0.5, cy, cx + r * 0.5, cy + r * 0.6);
		doc.line(cx - r * 0.85, cy + r * 0.65, cx + r * 0.85, cy + r * 0.65);
	},
	check(doc, cx, cy, r, color) {
		doc.setDrawColor(color);
		doc.setLineWidth(1.1);
		doc.line(cx - r * 0.6, cy, cx - r * 0.15, cy + r * 0.5);
		doc.line(cx - r * 0.15, cy + r * 0.5, cx + r * 0.7, cy - r * 0.5);
	}
};

/**
 * Draws a colored circular badge with a small icon inside.
 * `icon` is one of: phone, mail, pin, idcard, calendar, clock, person,
 * document, shield, dollar, pencil, bank, check.
 */
export function drawIconBadge(doc, { x, y, size = 16, icon, badgeColor = '#FCE4E6', iconColor = '#E11D2E' }) {
	const cx = x + size / 2;
	const cy = y + size / 2;
	doc.setFillColor(badgeColor);
	doc.circle(cx, cy, size / 2, 'F');
	const draw = ICONS[icon];
	if (draw) draw(doc, cx, cy, size * 0.28, iconColor);
}
