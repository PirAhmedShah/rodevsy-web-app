/**
 * Optimized Typewriter Transition
 * @param {HTMLElement} node = Target node
 * @param {{ speed?: number }} options - Speed in ms
 */
export default function (node: HTMLElement, { speed = 50 }: { speed?: number }) {
	const text = node.textContent ?? '';
	const duration = text.length * speed;
	node.setAttribute('aria-label', text);

	return {
		duration,
		tick: (t: number) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}
