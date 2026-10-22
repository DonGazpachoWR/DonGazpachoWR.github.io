/*
 * approach.js
 *
 * Winding line of the "From raw reads to results" section. The curve
 * passes through the dot of every step, is drawn as the section scrolls
 * through the viewport, and each dot lights up when the line reaches it.
 *
 * Version: 1.0
 * Author: Adrian Berenguer-Agustí (I2SysBio-CSIC)
 * Date: 2026-10-18
 */
(() => {
  "use strict";

  // Height of the line's tip, as a fraction of the viewport height.
  const HEAD = 0.62;
  // How far the control points of each curve reach, as a fraction of
  // the vertical distance between two dots.
  const BEND = 0.55;

  /**
   * Cubic segment from one point to the next, leaving and arriving
   * vertically so that consecutive segments join smoothly.
   * @param {{x: number, y: number}} from Start point.
   * @param {{x: number, y: number}} to End point.
   * @returns {string} SVG path command.
   */
  function curve(from, to) {
    const reach = (to.y - from.y) * BEND;
    return ` C ${from.x} ${from.y + reach} ${to.x} ${to.y - reach}`
      + ` ${to.x} ${to.y}`;
  }

  /**
   * Set up the line of one path container.
   * @param {HTMLElement} root Element with class "path".
   * @returns {void}
   */
  function init(root) {
    const svg = root.querySelector(".path__svg");
    const base = svg.querySelector(".path__base");
    const line = svg.querySelector(".path__line");
    const gradient = svg.querySelector("linearGradient");
    const dots = Array.from(root.querySelectorAll(".step__dot"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    // Length of the path at the height of each dot, top to bottom.
    let stops = [];
    let total = 0;
    let height = 0;
    let frame = 0;

    /**
     * Path length reached when the tip of the line is at height y.
     * The path only moves downwards, so the length grows with y and
     * can be interpolated between the dots.
     * @param {number} y Height inside the container, in pixels.
     * @returns {number} Length along the path.
     */
    function length_at(y) {
      let result = 0;
      if (y >= height) {
        result = total;
      } else if (y > 0) {
        let i = 1;
        while (i < stops.length - 1 && stops[i].y < y) {
          i += 1;
        }
        const a = stops[i - 1];
        const b = stops[i];
        const t = b.y > a.y ? (y - a.y) / (b.y - a.y) : 1;
        result = a.len + (b.len - a.len) * t;
      }
      return result;
    }

    /**
     * Draw the line up to the current scroll position.
     * @returns {void}
     */
    function update() {
      frame = 0;
      const top = root.getBoundingClientRect().top;
      const head = reduce ? height : window.innerHeight * HEAD - top;
      line.style.strokeDashoffset = String(total - length_at(head));
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-on", stops[i + 1].y <= head);
      });
    }

    /**
     * Rebuild the path from the current position of the dots.
     * @returns {void}
     */
    function layout() {
      const box = root.getBoundingClientRect();
      height = box.height;
      const points = dots.map((dot) => {
        const r = dot.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - box.left,
          y: r.top + r.height / 2 - box.top,
        };
      });
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      gradient.setAttribute("y2", String(box.height));

      // The base path is grown one segment at a time to measure the
      // length at which each dot is reached.
      let d = `M ${points[0].x} 0`;
      let previous = { x: points[0].x, y: 0 };
      stops = [{ y: 0, len: 0 }];
      points.forEach((point) => {
        d += curve(previous, point);
        base.setAttribute("d", d);
        stops.push({ y: point.y, len: base.getTotalLength() });
        previous = point;
      });
      d += ` L ${previous.x} ${box.height}`;
      base.setAttribute("d", d);
      line.setAttribute("d", d);
      total = base.getTotalLength();
      stops.push({ y: box.height, len: total });
      line.style.strokeDasharray = `${total} ${total}`;
      update();
    }

    /**
     * Schedule one update per animation frame while scrolling.
     * @returns {void}
     */
    function request_update() {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    }

    layout();
    window.addEventListener("scroll", request_update, { passive: true });
    if ("ResizeObserver" in window) {
      new ResizeObserver(layout).observe(root);
    } else {
      window.addEventListener("resize", layout);
    }
    document.addEventListener("langchange", layout);
    if (document.fonts) {
      document.fonts.ready.then(layout);
    }
  }

  document.querySelectorAll(".path").forEach(init);
})();
