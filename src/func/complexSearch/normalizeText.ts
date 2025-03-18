export function normalizeText(text: string): string {
	if (!text) {
		return '';
	}

	return text
	.toLowerCase()
	.normalize('NFD')
	.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
	.replace(/[^\w\s]/g, ' ')        // Replace non-alphanumeric with spaces
	.replace(/\s+/g, ' ')            // Replace multiple spaces with single space
	.trim();
}