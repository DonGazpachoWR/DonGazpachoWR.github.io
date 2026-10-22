/*
 * intro.js
 *
 * Looping hero animation. Sequencing reads appear, align against a
 * reference, are encoded as bits, collapse into a network and finally
 * settle into result charts (a bar chart and a survival curve). The same
 * particles travel through every stage so each step morphs into the next.
 *
 * Add ?t=<seconds> to the URL to freeze the animation at a given time.
 *
 * Version: 1.0
 * Author: Adrian Berenguer-Agustí (I2SysBio-CSIC)
 * Date: 2026-10-18
 */
(() => {
  "use strict";

  const canvas = document.getElementById("intro-canvas");
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero");
  const phase_label = document.getElementById("intro-phase");

  // Length of the reference sequence, in bases.
  const REF_LEN = 40;
  // Number of sequencing reads in the pileup.
  const N_READS = 8;
  // Number of nodes in the network stage.
  const N_NODES = 18;
  // Number of bars in the bar chart (the remaining nodes form the curve).
  const N_BARS = 8;
  // Rows of the binary matrix.
  const BIT_ROWS = 8;
  // Full loop duration, in seconds.
  const CYCLE = 17;
  // Maximum per-particle delay inside a transition, in seconds.
  const STAGGER = 0.7;

  // Keyframes: [start, end, from_state, to_state]. Equal states = hold.
  const STATES = ["scatter", "reads", "aligned", "bits", "graph", "chart"];
  const TIMELINE = [
    [0.0, 1.8, 0, 1],
    [1.8, 2.8, 1, 1],
    [2.8, 4.4, 1, 2],
    [4.4, 5.8, 2, 2],
    [5.8, 7.2, 2, 3],
    [7.2, 8.2, 3, 3],
    [8.2, 10.0, 3, 4],
    [10.0, 11.0, 4, 4],
    [11.0, 12.8, 4, 5],
    [12.8, 16.2, 5, 5],
    [16.2, 17.0, 5, 5],
  ];
  // Time at which the whole scene fades out before looping.
  const FADE_OUT = 16.2;

  const COLORS = {
    A: [126, 224, 138],
    C: [90, 169, 255],
    G: [245, 196, 81],
    T: [255, 107, 107],
    muted: [86, 98, 108],
    accent: [92, 225, 198],
    amber: [245, 196, 81],
    axis: [120, 130, 138],
  };

  const LABELS = {
    en: ["01 — raw reads", "02 — alignment", "03 — encoding",
         "04 — network", "05 — results"],
    es: ["01 — lecturas", "02 — alineamiento", "03 — codificación",
         "04 — red", "05 — resultados"],
  };
  const AXIS_LABELS = {
    en: ["isoform expression", "survival"],
    es: ["expresión de isoformas", "supervivencia"],
  };

  /**
   * Deterministic pseudo-random generator, so every visit looks the same.
   * @param {number} seed Integer seed.
   * @returns {function(): number} Generator of floats in [0, 1).
   */
  function mulberry32(seed) {
    let a = seed;
    const generator = () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return generator;
  }

  const rand = mulberry32(20261018);
  const BASES = "ACGT";

  /* ---------------------------------------------------------------- */
  /* Scene data (independent of screen size)                          */
  /* ---------------------------------------------------------------- */

  const reference = Array.from({ length: REF_LEN },
    () => BASES[Math.floor(rand() * 4)]);

  // Each glyph keeps its identity through every state.
  const glyphs = [];
  reference.forEach((base, col) => {
    glyphs.push({ base, is_ref: true, row: 0, col, read_col: col,
                  mismatch: false });
  });
  for (let r = 0; r < N_READS; r++) {
    const length = 22 + Math.floor(rand() * 6);
    const start = Math.floor(rand() * (REF_LEN - length + 1));
    const mismatch_at = Math.floor(rand() * length);
    for (let i = 0; i < length; i++) {
      let base = reference[start + i];
      const mismatch = i === mismatch_at;
      if (mismatch) {
        base = BASES[(BASES.indexOf(base) + 1 + Math.floor(rand() * 3)) % 4];
      }
      glyphs.push({ base, is_ref: false, row: r + 1, col: start + i,
                    read_col: i, mismatch });
    }
  }
  glyphs.forEach((g, k) => {
    g.bit = rand() < 0.5 ? "0" : "1";
    g.scatter = [rand() * 1.3 - 0.15, rand() * 1.3 - 0.15];
    g.node = k % N_NODES;
    g.delay = rand() * STAGGER;
  });

  // Network: positions relaxed with a few force-directed iterations.
  const nodes = Array.from({ length: N_NODES }, () => ({
    u: 0.15 + rand() * 0.7, v: 0.1 + rand() * 0.8, delay: rand() * 0.4,
  }));
  const edges = [];
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => [j, (a.u - b.u) ** 2 + (a.v - b.v) ** 2])
      .filter(([j]) => j !== i)
      .sort((x, y) => x[1] - y[1])
      .slice(0, 2);
    nearest.forEach(([j]) => {
      if (!edges.some(([p, q]) => (p === j && q === i))) {
        edges.push([i, j]);
      }
    });
  });
  // A few long-range links so the network is not a chain of neighbours.
  for (let k = 0; k < 4; k++) {
    const i = Math.floor(rand() * N_NODES);
    const j = (i + 1 + Math.floor(rand() * (N_NODES - 1))) % N_NODES;
    edges.push([i, j]);
  }
  // Repulsion between all nodes, springs along edges and a weak pull to
  // the centre keep the network compact instead of pinned to the edges.
  const REST = 0.2;
  for (let it = 0; it < 300; it++) {
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i !== j) {
          const du = a.u - b.u;
          const dv = a.v - b.v;
          const d2 = Math.max(du * du + dv * dv, 1e-3);
          a.u += (du / d2) * 0.00012;
          a.v += (dv / d2) * 0.00012;
        }
      });
    });
    edges.forEach(([i, j]) => {
      const a = nodes[i];
      const b = nodes[j];
      const du = b.u - a.u;
      const dv = b.v - a.v;
      const d = Math.max(Math.hypot(du, dv), 1e-3);
      const f = (d - REST) * 0.05 / d;
      a.u += du * f;
      a.v += dv * f;
      b.u -= du * f;
      b.v -= dv * f;
    });
    nodes.forEach((a) => {
      a.u += (0.5 - a.u) * 0.01;
      a.v += (0.5 - a.v) * 0.01;
    });
  }
  // Rescale the final layout to fill the stage with a margin.
  const span_u = [Math.min(...nodes.map((n) => n.u)),
                  Math.max(...nodes.map((n) => n.u))];
  const span_v = [Math.min(...nodes.map((n) => n.v)),
                  Math.max(...nodes.map((n) => n.v))];
  nodes.forEach((n) => {
    n.u = 0.1 + 0.8 * (n.u - span_u[0]) / (span_u[1] - span_u[0]);
    n.v = 0.08 + 0.84 * (n.v - span_v[0]) / (span_v[1] - span_v[0]);
  });
  const degree = new Array(N_NODES).fill(0);
  edges.forEach(([i, j]) => {
    degree[i] += 1;
    degree[j] += 1;
  });

  // Chart values: bar heights and a decreasing survival curve.
  const bar_values = Array.from({ length: N_BARS }, () => 0.25 + rand() * 0.7);
  const n_curve = N_NODES - N_BARS;
  const curve_values = [1];
  for (let k = 1; k < n_curve; k++) {
    curve_values.push(curve_values[k - 1] * (0.8 + rand() * 0.16));
  }

  /* ---------------------------------------------------------------- */
  /* Layout (recomputed on resize)                                    */
  /* ---------------------------------------------------------------- */

  let width = 0;
  let height = 0;
  let stage = { x: 0, y: 0, w: 0, h: 0 };
  let cell = 10;
  let font_size = 10;

  /**
   * Compute the stage rectangle and every per-state position in pixels.
   * @returns {void}
   */
  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const wide = width >= 900;
    stage = wide
      ? { x: width * 0.44, y: height * 0.2, w: width * 0.5,
          h: height * 0.56 }
      : { x: width * 0.06, y: height * 0.13, w: width * 0.88,
          h: height * 0.38 };
    cell = stage.w / REF_LEN;
    font_size = Math.max(7, Math.min(18, cell * 0.95));
    const row_h = Math.min(cell * 1.6, stage.h / (N_READS + 1.5));
    const pile_h = row_h * (N_READS + 1);
    const top = stage.y + (stage.h - pile_h) / 2 + row_h / 2;

    const n_bit_cols = Math.ceil(glyphs.length / BIT_ROWS);
    const bit_w = Math.min(cell * 1.15, stage.w / n_bit_cols);
    const bit_left = stage.x + (stage.w - n_bit_cols * bit_w) / 2 + bit_w / 2;
    const bit_top = stage.y + (stage.h - BIT_ROWS * row_h) / 2 + row_h / 2;

    glyphs.forEach((g, k) => {
      const ref_gap = g.is_ref ? 0 : row_h * 0.35;
      g.pos = {
        scatter: [stage.x + g.scatter[0] * stage.w,
                  stage.y + g.scatter[1] * stage.h],
        reads: [stage.x + (g.read_col + 0.5) * cell,
                top + g.row * row_h + ref_gap],
        aligned: [stage.x + (g.col + 0.5) * cell,
                  top + g.row * row_h + ref_gap],
        bits: [bit_left + Math.floor(k / BIT_ROWS) * bit_w,
               bit_top + (k % BIT_ROWS) * row_h],
      };
    });

    nodes.forEach((n, i) => {
      n.graph = [stage.x + n.u * stage.w, stage.y + n.v * stage.h];
    });

    // Two chart panels side by side inside the stage.
    const gap = stage.w * 0.1;
    const panel_w = (stage.w - gap) / 2;
    const base_y = stage.y + stage.h * 0.92;
    const chart_h = stage.h * 0.8;
    const bars_x = stage.x;
    const curve_x = stage.x + panel_w + gap;
    const bar_step = panel_w / N_BARS;
    const curve_step = (panel_w * 0.92) / (n_curve - 1);
    nodes.forEach((n, i) => {
      if (i < N_BARS) {
        n.chart = [bars_x + bar_step * (i + 0.5),
                   base_y - bar_values[i] * chart_h];
      } else {
        const k = i - N_BARS;
        n.chart = [curve_x + panel_w * 0.04 + k * curve_step,
                   base_y - curve_values[k] * chart_h];
      }
    });
    stage.chart = { base_y, chart_h, bars_x, curve_x, panel_w, bar_step };
    stage.row_h = row_h;
  }

  /* ---------------------------------------------------------------- */
  /* Drawing helpers                                                  */
  /* ---------------------------------------------------------------- */

  /**
   * Smooth ease-in-out curve.
   * @param {number} x Progress in [0, 1].
   * @returns {number} Eased progress in [0, 1].
   */
  function ease(x) {
    const result = x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
    return result;
  }

  /**
   * Clamp a value to [0, 1].
   * @param {number} x Any number.
   * @returns {number} Clamped value.
   */
  function clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }

  /**
   * Linear interpolation between two numbers or two arrays.
   * @param {number|number[]} a Start value.
   * @param {number|number[]} b End value.
   * @param {number} p Progress in [0, 1].
   * @returns {number|number[]} Interpolated value.
   */
  function mix(a, b, p) {
    const result = Array.isArray(a)
      ? a.map((v, i) => v + (b[i] - v) * p)
      : a + (b - a) * p;
    return result;
  }

  /**
   * Format an RGB triple and alpha as a CSS colour.
   * @param {number[]} rgb Red, green and blue in [0, 255].
   * @param {number} alpha Opacity in [0, 1].
   * @returns {string} CSS rgba() string.
   */
  function rgba(rgb, alpha) {
    return `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${alpha})`;
  }

  /**
   * Visual properties of a glyph in a given state.
   * @param {object} g Glyph.
   * @param {string} state One of STATES.
   * @returns {{pos: number[], alpha: number, color: number[], ch: string}}
   */
  function glyph_state(g, state) {
    let result;
    if (state === "scatter") {
      result = { pos: g.pos.scatter, alpha: 0, color: COLORS[g.base],
                 ch: g.base };
    } else if (state === "reads") {
      result = { pos: g.pos.reads, alpha: g.is_ref ? 0 : 0.95,
                 color: COLORS[g.base], ch: g.base };
    } else if (state === "aligned") {
      const highlight = g.is_ref || g.mismatch;
      result = { pos: g.pos.aligned, alpha: highlight ? 1 : 0.75,
                 color: highlight ? COLORS[g.base] : COLORS.muted,
                 ch: g.base };
    } else if (state === "bits") {
      result = { pos: g.pos.bits, alpha: g.bit === "1" ? 0.95 : 0.4,
                 color: COLORS.accent, ch: g.bit };
    } else {
      const target = nodes[g.node][state === "graph" ? "graph" : "chart"];
      result = { pos: target, alpha: 0, color: COLORS.accent, ch: g.bit };
    }
    return result;
  }

  /**
   * Locate the current timeline segment.
   * @param {number} t Time within the loop, in seconds.
   * @returns {{from: number, to: number, t0: number, t1: number}}
   */
  function segment_at(t) {
    const seg = TIMELINE.find(([t0, t1]) => t >= t0 && t < t1)
      || TIMELINE[TIMELINE.length - 1];
    return { t0: seg[0], t1: seg[1], from: seg[2], to: seg[3] };
  }

  /**
   * Progress of a staggered transition for one particle.
   * @param {number} t Current time.
   * @param {object} seg Current segment.
   * @param {number} delay Particle delay in seconds.
   * @returns {number} Eased progress in [0, 1].
   */
  function progress(t, seg, delay) {
    const span = seg.t1 - seg.t0 - STAGGER;
    return ease(clamp01((t - seg.t0 - delay) / span));
  }

  /**
   * Draw the glyphs (bases and bits).
   * @param {number} t Current time.
   * @param {object} seg Current segment.
   * @returns {void}
   */
  function draw_glyphs(t, seg) {
    ctx.font = `500 ${font_size}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const from_name = STATES[seg.from];
    const to_name = STATES[seg.to];
    const scramble_tick = Math.floor(t * 18);
    glyphs.forEach((g, k) => {
      const a = glyph_state(g, from_name);
      const b = glyph_state(g, to_name);
      const p = seg.from === seg.to ? 1 : progress(t, seg, g.delay);
      const alpha = mix(a.alpha, b.alpha, p);
      if (alpha > 0.01) {
        const [x, y] = mix(a.pos, b.pos, p);
        let ch = p < 0.5 ? a.ch : b.ch;
        // Bases flicker through random symbols while being encoded.
        if (a.ch !== b.ch && p > 0.15 && p < 0.85) {
          ch = "01ACGT"[(scramble_tick + k * 7) % 6];
        }
        ctx.fillStyle = rgba(mix(a.color, b.color, p), alpha);
        ctx.fillText(ch, x, y);
      }
    });
  }

  /**
   * Draw the reference guide line under the reference row.
   * @param {number} t Current time.
   * @returns {void}
   */
  function draw_reference_rule(t) {
    const appear = clamp01((t - 3.4) / 0.8);
    const vanish = clamp01((t - 5.8) / 0.5);
    const alpha = 0.35 * appear * (1 - vanish);
    if (alpha > 0) {
      const y = glyphs[0].pos.aligned[1] + stage.row_h * 0.55;
      ctx.strokeStyle = rgba(COLORS.axis, alpha);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(stage.x, y);
      ctx.lineTo(stage.x + stage.w * appear, y);
      ctx.stroke();
    }
  }

  /**
   * Draw network nodes and edges, and the result charts.
   * @param {number} t Current time.
   * @returns {void}
   */
  function draw_network_and_charts(t) {
    const node_in = clamp01((t - 9.0) / 1.0);
    if (node_in > 0) {
      const to_chart = (i) => ease(clamp01((t - 11.0 - nodes[i].delay) / 1.4));
      const pos = (i) => mix(nodes[i].graph, nodes[i].chart, to_chart(i));

      // Edges fade in with the nodes and dissolve as charts take over.
      const edge_alpha = 0.32 * ease(node_in) * (1 - ease(clamp01((t - 11.0)
        / 0.9)));
      if (edge_alpha > 0.005) {
        ctx.strokeStyle = rgba(COLORS.accent, edge_alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        edges.forEach(([i, j]) => {
          const [x1, y1] = pos(i);
          const [x2, y2] = pos(j);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        });
        ctx.stroke();
      }

      draw_charts(t);

      nodes.forEach((n, i) => {
        const [x, y] = pos(i);
        const graph_r = Math.max(2.5, cell * (0.18 + degree[i] * 0.05));
        const chart_r = Math.max(2.5, cell * 0.2);
        const r = mix(graph_r, chart_r, to_chart(i)) * ease(node_in);
        const color = i < N_BARS ? COLORS.accent
          : mix(COLORS.accent, COLORS.amber, to_chart(i));
        ctx.fillStyle = rgba(color, 0.95);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        // A soft halo makes the nodes read as glowing data points.
        ctx.fillStyle = rgba(color, 0.12 * ease(node_in));
        ctx.beginPath();
        ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  /**
   * Draw chart axes, bars and the survival step curve.
   * @param {number} t Current time.
   * @returns {void}
   */
  function draw_charts(t) {
    const c = stage.chart;
    const axes = ease(clamp01((t - 11.6) / 0.8));
    const bars = ease(clamp01((t - 12.3) / 1.0));
    const curve = ease(clamp01((t - 12.5) / 1.4));
    if (axes > 0) {
      ctx.strokeStyle = rgba(COLORS.axis, 0.5 * axes);
      ctx.lineWidth = 1;
      ctx.beginPath();
      [c.bars_x, c.curve_x].forEach((x0) => {
        ctx.moveTo(x0, c.base_y - c.chart_h * 1.08 * axes);
        ctx.lineTo(x0, c.base_y);
        ctx.lineTo(x0 + c.panel_w * axes, c.base_y);
      });
      ctx.stroke();

      const lang = document.documentElement.lang === "es" ? "es" : "en";
      ctx.font = `400 ${Math.max(9, font_size * 0.75)}px "IBM Plex Mono",`
        + " ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = rgba(COLORS.axis, 0.8 * axes);
      ctx.fillText(AXIS_LABELS[lang][0], c.bars_x, c.base_y + 8);
      ctx.fillText(AXIS_LABELS[lang][1], c.curve_x, c.base_y + 8);
    }
    if (bars > 0) {
      const bar_w = c.bar_step * 0.56;
      for (let i = 0; i < N_BARS; i++) {
        const [x, y] = nodes[i].chart;
        const h = (c.base_y - y) * bars;
        const grad = ctx.createLinearGradient(0, c.base_y - h, 0, c.base_y);
        grad.addColorStop(0, rgba(COLORS.accent, 0.85));
        grad.addColorStop(1, rgba(COLORS.accent, 0.15));
        ctx.fillStyle = grad;
        ctx.fillRect(x - bar_w / 2, c.base_y - h, bar_w, h);
      }
    }
    if (curve > 0) {
      const pts = nodes.slice(N_BARS).map((n) => n.chart);
      const total = pts.length - 1;
      const reach = curve * total;
      ctx.strokeStyle = rgba(COLORS.amber, 0.9);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(c.curve_x, pts[0][1]);
      ctx.lineTo(pts[0][0], pts[0][1]);
      for (let k = 1; k <= Math.ceil(reach); k++) {
        const f = Math.min(1, reach - (k - 1));
        const [x0, y0] = pts[k - 1];
        const [x1, y1] = pts[k];
        // Kaplan-Meier style: horizontal step, then vertical drop.
        const xm = x0 + (x1 - x0) * Math.min(1, f * 2);
        ctx.lineTo(xm, y0);
        if (f > 0.5) {
          ctx.lineTo(x1, y0 + (y1 - y0) * (f - 0.5) * 2);
        }
      }
      ctx.stroke();
    }
  }

  /**
   * Update the phase caption and the hero data attribute.
   * @param {number} t Current time.
   * @returns {void}
   */
  function update_phase(t) {
    const index = t < 2.8 ? 0 : t < 5.8 ? 1 : t < 8.2 ? 2 : t < 11.0 ? 3 : 4;
    const lang = document.documentElement.lang === "es" ? "es" : "en";
    const text = LABELS[lang][index];
    if (phase_label && phase_label.textContent !== text) {
      phase_label.textContent = text;
    }
    if (hero) {
      hero.dataset.phase = String(index + 1);
    }
  }

  /**
   * Render one frame of the loop.
   * @param {number} t Time within the loop, in seconds.
   * @returns {void}
   */
  function render(t) {
    ctx.clearRect(0, 0, width, height);
    const fade = 1 - ease(clamp01((t - FADE_OUT) / (CYCLE - FADE_OUT)));
    ctx.globalAlpha = fade;
    const seg = segment_at(t);
    draw_reference_rule(t);
    draw_glyphs(t, seg);
    draw_network_and_charts(t);
    ctx.globalAlpha = 1;
    update_phase(t);
  }

  /* ---------------------------------------------------------------- */
  /* Main loop                                                        */
  /* ---------------------------------------------------------------- */

  const params = new URLSearchParams(window.location.search);
  const frozen_param = params.get("t");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  let frozen_t = null;
  if (frozen_param !== null && !Number.isNaN(Number(frozen_param))) {
    frozen_t = Number(frozen_param) % CYCLE;
  } else if (reduced) {
    frozen_t = 15.0;
  }

  let visible = true;
  let start = performance.now();
  let paused_at = null;

  /**
   * requestAnimationFrame callback.
   * @param {number} now High-resolution timestamp.
   * @returns {void}
   */
  function tick(now) {
    if (visible) {
      const t = frozen_t !== null ? frozen_t : ((now - start) / 1000) % CYCLE;
      render(t);
    }
    if (frozen_t === null) {
      requestAnimationFrame(tick);
    }
  }

  // Pause while the hero is off-screen so it costs nothing.
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(([entry]) => {
      const now = performance.now();
      if (!entry.isIntersecting && visible) {
        paused_at = now;
      } else if (entry.isIntersecting && !visible && paused_at !== null) {
        start += now - paused_at;
      }
      visible = entry.isIntersecting;
    }).observe(hero);
  }

  window.addEventListener("resize", () => {
    layout();
    if (frozen_t !== null) {
      render(frozen_t);
    }
  });
  document.addEventListener("langchange", () => {
    if (frozen_t !== null) {
      render(frozen_t);
    }
  });

  const begin = () => {
    layout();
    start = performance.now();
    requestAnimationFrame(tick);
  };
  // Wait for the monospace font so glyph metrics are right from frame one.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(begin);
  } else {
    begin();
  }
})();
