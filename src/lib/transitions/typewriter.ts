/**
 * Optimized Typewriter Transition
 * @param {HTMLElement} node
 * @param {{ speed?: number }} options - Speed in milliseconds per character
 */
export default function(node:HTMLElement, { speed = 50 }:{ speed?: number }) {
    // 1. Cache the text and clear node once to avoid layout thrashing in the loop
    const text = node.textContent ?? "";
    const duration = text.length * speed;

    // 2. Accessibility: Ensure screen readers see the full text immediately
    // or at least handle the live update gracefully.
    node.setAttribute('aria-label', text);

    return {
        duration,
        tick: (t:number) => {
            // t goes from 0 to 1
            const i = Math.trunc(text.length * t);
            node.textContent = text.slice(0, i);
        }
    };
}