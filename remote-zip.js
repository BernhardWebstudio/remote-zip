//#region \0vite/modulepreload-polyfill.js
(function() {
	let e = document.createElement("link").relList;
	if (e && e.supports && e.supports("modulepreload")) return;
	for (let e of document.querySelectorAll("link[rel=\"modulepreload\"]")) n(e);
	new MutationObserver((e) => {
		for (let t of e) if (t.type === "childList") for (let e of t.addedNodes) e.tagName === "LINK" && e.rel === "modulepreload" && n(e);
	}).observe(document, {
		childList: !0,
		subtree: !0
	});
	function t(e) {
		let t = {};
		return e.integrity && (t.integrity = e.integrity), e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy), t.credentials = e.crossOrigin === "use-credentials" ? "include" : e.crossOrigin === "anonymous" ? "omit" : "same-origin", t;
	}
	function n(e) {
		if (e.ep) return;
		e.ep = !0;
		let n = t(e);
		fetch(e.href, n);
	}
})();
//#endregion
//#region node_modules/pako/dist/pako.mjs
var e = 4, t = 0, n = 1, r = 2;
function i(e) {
	let t = e.length;
	for (; --t >= 0;) e[t] = 0;
}
var a = 29, o = 256, s = 286, c = 30, l = 19, u = 573, d = 15, f = 16, p = 256, m = 16, h = 17, g = 18, _ = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0
]), v = new Uint8Array([
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13
]);
new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	2,
	3,
	7
]);
var y = new Uint8Array([
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
]), b = 512, x = Array(576);
i(x);
var S = Array(c * 2);
i(S);
var C = Array(b);
i(C);
var w = Array(256);
i(w);
var T = Array(a);
i(T);
var E = Array(c);
i(E);
var D = (e) => e < 256 ? C[e] : C[256 + (e >>> 7)], O = (e, t) => {
	e.pending_buf[e.pending++] = t & 255, e.pending_buf[e.pending++] = t >>> 8 & 255;
}, k = (e, t, n) => {
	e.bi_valid > f - n ? (e.bi_buf |= t << e.bi_valid & 65535, O(e, e.bi_buf), e.bi_buf = t >> f - e.bi_valid, e.bi_valid += n - f) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
}, A = (e, t, n) => {
	k(e, n[t * 2], n[t * 2 + 1]);
}, j = (e, t) => {
	let n = 0;
	do
		n |= e & 1, e >>>= 1, n <<= 1;
	while (--t > 0);
	return n >>> 1;
}, ee = (e, t) => {
	let n = t.dyn_tree, r = t.max_code, i = t.stat_desc.static_tree, a = t.stat_desc.has_stree, o = t.stat_desc.extra_bits, s = t.stat_desc.extra_base, c = t.stat_desc.max_length, l, f, p, m, h, g, _ = 0;
	for (m = 0; m <= d; m++) e.bl_count[m] = 0;
	for (n[e.heap[e.heap_max] * 2 + 1] = 0, l = e.heap_max + 1; l < u; l++) f = e.heap[l], m = n[n[f * 2 + 1] * 2 + 1] + 1, m > c && (m = c, _++), n[f * 2 + 1] = m, !(f > r) && (e.bl_count[m]++, h = 0, f >= s && (h = o[f - s]), g = n[f * 2], e.opt_len += g * (m + h), a && (e.static_len += g * (i[f * 2 + 1] + h)));
	if (_ !== 0) {
		do {
			for (m = c - 1; e.bl_count[m] === 0;) m--;
			e.bl_count[m]--, e.bl_count[m + 1] += 2, e.bl_count[c]--, _ -= 2;
		} while (_ > 0);
		for (m = c; m !== 0; m--) for (f = e.bl_count[m]; f !== 0;) p = e.heap[--l], !(p > r) && (n[p * 2 + 1] !== m && (e.opt_len += (m - n[p * 2 + 1]) * n[p * 2], n[p * 2 + 1] = m), f--);
	}
}, te = (e, t, n) => {
	let r = Array(16), i = 0, a, o;
	for (a = 1; a <= d; a++) i = i + n[a - 1] << 1, r[a] = i;
	for (o = 0; o <= t; o++) {
		let t = e[o * 2 + 1];
		t !== 0 && (e[o * 2] = j(r[t]++, t));
	}
}, ne = (e) => {
	let t = 0;
	for (; t < s; t++) e.dyn_ltree[t * 2] = 0;
	for (t = 0; t < c; t++) e.dyn_dtree[t * 2] = 0;
	for (t = 0; t < l; t++) e.bl_tree[t * 2] = 0;
	e.dyn_ltree[p * 2] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0;
}, re = (e) => {
	e.bi_valid > 8 ? O(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
}, ie = (e, t, n, r) => {
	let i = t * 2, a = n * 2;
	return e[i] < e[a] || e[i] === e[a] && r[t] <= r[n];
}, ae = (e, t, n) => {
	let r = e.heap[n], i = n << 1;
	for (; i <= e.heap_len && (i < e.heap_len && ie(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !ie(t, r, e.heap[i], e.depth));) e.heap[n] = e.heap[i], n = i, i <<= 1;
	e.heap[n] = r;
}, oe = (e, t, n) => {
	let r, i, a = 0, s, c;
	if (e.sym_next !== 0) do
		r = e.pending_buf[e.sym_buf + a++] & 255, r += (e.pending_buf[e.sym_buf + a++] & 255) << 8, i = e.pending_buf[e.sym_buf + a++], r === 0 ? A(e, i, t) : (s = w[i], A(e, s + o + 1, t), c = _[s], c !== 0 && (i -= T[s], k(e, i, c)), r--, s = D(r), A(e, s, n), c = v[s], c !== 0 && (r -= E[s], k(e, r, c)));
	while (a < e.sym_next);
	A(e, p, t);
}, se = (e, t) => {
	let n = t.dyn_tree, r = t.stat_desc.static_tree, i = t.stat_desc.has_stree, a = t.stat_desc.elems, o, s, c = -1, l;
	for (e.heap_len = 0, e.heap_max = u, o = 0; o < a; o++) n[o * 2] === 0 ? n[o * 2 + 1] = 0 : (e.heap[++e.heap_len] = c = o, e.depth[o] = 0);
	for (; e.heap_len < 2;) l = e.heap[++e.heap_len] = c < 2 ? ++c : 0, n[l * 2] = 1, e.depth[l] = 0, e.opt_len--, i && (e.static_len -= r[l * 2 + 1]);
	for (t.max_code = c, o = e.heap_len >> 1; o >= 1; o--) ae(e, n, o);
	l = a;
	do
		o = e.heap[1], e.heap[1] = e.heap[e.heap_len--], ae(e, n, 1), s = e.heap[1], e.heap[--e.heap_max] = o, e.heap[--e.heap_max] = s, n[l * 2] = n[o * 2] + n[s * 2], e.depth[l] = (e.depth[o] >= e.depth[s] ? e.depth[o] : e.depth[s]) + 1, n[o * 2 + 1] = n[s * 2 + 1] = l, e.heap[1] = l++, ae(e, n, 1);
	while (e.heap_len >= 2);
	e.heap[--e.heap_max] = e.heap[1], ee(e, t), te(n, c, e.bl_count);
}, ce = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), t[(n + 1) * 2 + 1] = 65535, r = 0; r <= n; r++) a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o) && (s < l ? e.bl_tree[a * 2] += s : a === 0 ? s <= 10 ? e.bl_tree[34]++ : e.bl_tree[36]++ : (a !== i && e.bl_tree[a * 2]++, e.bl_tree[32]++), s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4));
}, le = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), r = 0; r <= n; r++) if (a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o)) {
		if (s < l) do
			A(e, a, e.bl_tree);
		while (--s !== 0);
		else a === 0 ? s <= 10 ? (A(e, h, e.bl_tree), k(e, s - 3, 3)) : (A(e, g, e.bl_tree), k(e, s - 11, 7)) : (a !== i && (A(e, a, e.bl_tree), s--), A(e, m, e.bl_tree), k(e, s - 3, 2));
		s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4);
	}
}, ue = (e) => {
	let t;
	for (ce(e, e.dyn_ltree, e.l_desc.max_code), ce(e, e.dyn_dtree, e.d_desc.max_code), se(e, e.bl_desc), t = 18; t >= 3 && e.bl_tree[y[t] * 2 + 1] === 0; t--);
	return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
}, de = (e, t, n, r) => {
	let i;
	for (k(e, t - 257, 5), k(e, n - 1, 5), k(e, r - 4, 4), i = 0; i < r; i++) k(e, e.bl_tree[y[i] * 2 + 1], 3);
	le(e, e.dyn_ltree, t - 1), le(e, e.dyn_dtree, n - 1);
}, fe = (e) => {
	let r = 4093624447, i = 0;
	for (; i <= 31; i++, r >>>= 1) if (r & 1 && e.dyn_ltree[i * 2] !== 0) return t;
	if (e.dyn_ltree[18] !== 0 || e.dyn_ltree[20] !== 0 || e.dyn_ltree[26] !== 0) return n;
	for (i = 32; i < o; i++) if (e.dyn_ltree[i * 2] !== 0) return n;
	return t;
}, pe = (e, t, n, r) => {
	k(e, 0 + +!!r, 3), re(e), O(e, n), O(e, ~n), n && e.pending_buf.set(e.window.subarray(t, t + n), e.pending), e.pending += n;
}, me = (t, n, i, a) => {
	let o, s, c = 0;
	t.level > 0 ? (t.strm.data_type === r && (t.strm.data_type = fe(t)), se(t, t.l_desc), se(t, t.d_desc), c = ue(t), o = t.opt_len + 3 + 7 >>> 3, s = t.static_len + 3 + 7 >>> 3, (s <= o || t.strategy === e) && (o = s)) : o = s = i + 5, i + 4 <= o && n !== -1 ? pe(t, n, i, a) : t.strategy === e || s === o ? (k(t, 2 + +!!a, 3), oe(t, x, S)) : (k(t, 4 + +!!a, 3), de(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, c + 1), oe(t, t.dyn_ltree, t.dyn_dtree)), ne(t), a && re(t);
}, M = (e, t, n) => (e.pending_buf[e.sym_buf + e.sym_next++] = t, e.pending_buf[e.sym_buf + e.sym_next++] = t >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = n, t === 0 ? e.dyn_ltree[n * 2]++ : (e.matches++, t--, e.dyn_ltree[(w[n] + o + 1) * 2]++, e.dyn_dtree[D(t) * 2]++), e.sym_next === e.sym_end), N = (e, t, n, r) => {
	let i = e & 65535, a = e >>> 16 & 65535, o = 0;
	for (; n !== 0;) {
		o = n > 2e3 ? 2e3 : n, n -= o;
		do
			i = i + t[r++] | 0, a = a + i | 0;
		while (--o);
		i %= 65521, a %= 65521;
	}
	return i | a << 16;
}, he = new Uint32Array((() => {
	let e, t = [];
	for (var n = 0; n < 256; n++) {
		e = n;
		for (var r = 0; r < 8; r++) e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
		t[n] = e;
	}
	return t;
})()), P = (e, t, n, r) => {
	let i = he, a = r + n;
	e ^= -1;
	for (let n = r; n < a; n++) e = e >>> 8 ^ i[(e ^ t[n]) & 255];
	return e ^ -1;
}, ge = {
	2: "need dictionary",
	1: "stream end",
	0: "",
	"-1": "file error",
	"-2": "stream error",
	"-3": "data error",
	"-4": "insufficient memory",
	"-5": "buffer error",
	"-6": "incompatible version"
}, F = 3, _e = 258, I = 262, L = 1, ve = 2, ye = 3, be = 4, xe = (e) => {
	let t, n, r, i = e.w_size;
	t = e.hash_size, r = t;
	do
		n = e.head[--r], e.head[r] = n >= i ? n - i : 0;
	while (--t);
	t = i, r = t;
	do
		n = e.prev[--r], e.prev[r] = n >= i ? n - i : 0;
	while (--t);
}, Se = (e, t, n) => (t << e.hash_shift ^ n) & e.hash_mask, R = (e, t) => {
	let n;
	if (e.legacy_hash) n = e.ins_h = Se(e, e.ins_h, e.window[t + F - 1]);
	else {
		let r = e.window, i = r[t] | r[t + 1] << 8 | r[t + 2] << 16 | r[t + 3] << 24;
		n = e.ins_h = Math.imul(i, 66521) + 66521 >>> 16 & e.hash_mask;
	}
	let r = e.prev[t & e.w_mask] = e.head[n];
	return e.head[n] = t, r;
}, Ce = (e) => {
	let t = e.state, n = t.pending;
	n > e.avail_out && (n = e.avail_out), n !== 0 && (e.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + n), e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, t.pending === 0 && (t.pending_out = 0));
}, z = (e, t) => {
	me(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, Ce(e.strm);
}, we = (e, t, n, r) => {
	let i = e.avail_in;
	return i > r && (i = r), i === 0 ? 0 : (e.avail_in -= i, t.set(e.input.subarray(e.next_in, e.next_in + i), n), e.state.wrap === 1 ? e.adler = N(e.adler, t, i, n) : e.state.wrap === 2 && (e.adler = P(e.adler, t, i, n)), e.next_in += i, e.total_in += i, i);
}, Te = (e, t) => {
	let n = e.max_chain_length, r = e.strstart, i, a, o = e.prev_length, s = e.nice_match, c = e.strstart > e.w_size - I ? e.strstart - (e.w_size - I) : 0, l = e.window, u = e.w_mask, d = e.prev, f = e.strstart + _e, p = l[r + o - 1], m = l[r + o];
	e.prev_length >= e.good_match && (n >>= 2), s > e.lookahead && (s = e.lookahead);
	do
		if (i = t, l[i + o] === m && l[i + o - 1] === p && l[i] === l[r] && l[++i] === l[r + 1]) {
			r += 2, i++;
			do;
			while (l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && r < f);
			if (a = _e - (f - r), r = f - _e, a > o) {
				if (e.match_start = t, o = a, a >= s) break;
				p = l[r + o - 1], m = l[r + o];
			}
		}
	while ((t = d[t & u]) > c && --n !== 0);
	return o <= e.lookahead ? o : e.lookahead;
}, Ee = (e) => {
	let t = e.w_size, n, r, i;
	do {
		if (r = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - I) && (e.window.set(e.window.subarray(t, t + t - r), 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, e.insert > e.strstart && (e.insert = e.strstart), xe(e), r += t), e.strm.avail_in === 0) break;
		if (n = we(e.strm, e.window, e.strstart + e.lookahead, r), e.lookahead += n, !e.legacy_hash) {
			if (e.lookahead + e.insert > F) for (i = e.strstart - e.insert; e.insert && (R(e, i), i++, e.insert--, !(e.lookahead + e.insert <= F)););
		} else if (e.lookahead + e.insert >= F) for (i = e.strstart - e.insert, e.ins_h = e.window[i], e.ins_h = Se(e, e.ins_h, e.window[i + 1]); e.insert && (R(e, i), i++, e.insert--, !(e.lookahead + e.insert < F)););
	} while (e.lookahead < I && e.strm.avail_in !== 0);
}, De = (e, t) => {
	let n = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, r, i, a, o = 0, s = e.strm.avail_in;
	do {
		if (r = 65535, a = e.bi_valid + 42 >> 3, e.strm.avail_out < a || (a = e.strm.avail_out - a, i = e.strstart - e.block_start, r > i + e.strm.avail_in && (r = i + e.strm.avail_in), r > a && (r = a), r < n && (r === 0 && t !== 4 || t === 0 || r !== i + e.strm.avail_in))) break;
		o = +(t === 4 && r === i + e.strm.avail_in), pe(e, 0, 0, o), e.pending_buf[e.pending - 4] = r, e.pending_buf[e.pending - 3] = r >> 8, e.pending_buf[e.pending - 2] = ~r, e.pending_buf[e.pending - 1] = ~r >> 8, Ce(e.strm), i && (i > r && (i = r), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + i), e.strm.next_out), e.strm.next_out += i, e.strm.avail_out -= i, e.strm.total_out += i, e.block_start += i, r -= i), r && (we(e.strm, e.strm.output, e.strm.next_out, r), e.strm.next_out += r, e.strm.avail_out -= r, e.strm.total_out += r);
	} while (o === 0);
	return s -= e.strm.avail_in, s && (s >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= s && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - s, e.strm.next_in), e.strstart), e.strstart += s, e.insert += s > e.w_size - e.insert ? e.w_size - e.insert : s), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), o ? be : t !== 0 && t !== 4 && e.strm.avail_in === 0 && e.strstart === e.block_start ? ve : (a = e.window_size - e.strstart, e.strm.avail_in > a && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, a += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), a > e.strm.avail_in && (a = e.strm.avail_in), a && (we(e.strm, e.window, e.strstart, a), e.strstart += a, e.insert += a > e.w_size - e.insert ? e.w_size - e.insert : a), e.high_water < e.strstart && (e.high_water = e.strstart), a = e.bi_valid + 42 >> 3, a = e.pending_buf_size - a > 65535 ? 65535 : e.pending_buf_size - a, n = a > e.w_size ? e.w_size : a, i = e.strstart - e.block_start, (i >= n || (i || t === 4) && t !== 0 && e.strm.avail_in === 0 && i <= a) && (r = i > a ? a : i, o = +(t === 4 && e.strm.avail_in === 0 && r === i), pe(e, e.block_start, r, o), e.block_start += r, Ce(e.strm)), o ? ye : L);
}, Oe = (e, t) => {
	let n, r;
	for (;;) {
		if (e.lookahead < I) {
			if (Ee(e), e.lookahead < I && t === 0) return L;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= F && (n = R(e, e.strstart)), n !== 0 && e.strstart - n <= e.w_size - I && (e.match_length = Te(e, n)), e.match_length >= F) {
			if (r = M(e, e.strstart - e.match_start, e.match_length - F), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= F) {
				e.match_length--;
				do
					e.strstart++, n = R(e, e.strstart);
				while (--e.match_length !== 0);
				e.strstart++;
			} else e.strstart += e.match_length, e.match_length = 0, e.legacy_hash && (e.ins_h = e.window[e.strstart], e.ins_h = Se(e, e.ins_h, e.window[e.strstart + 1]));
		} else r = M(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
		if (r && (z(e, !1), e.strm.avail_out === 0)) return L;
	}
	return e.insert = e.strstart < F - 1 ? e.strstart : F - 1, t === 4 ? (z(e, !0), e.strm.avail_out === 0 ? ye : be) : e.sym_next && (z(e, !1), e.strm.avail_out === 0) ? L : ve;
}, B = (e, t) => {
	let n, r, i;
	for (;;) {
		if (e.lookahead < I) {
			if (Ee(e), e.lookahead < I && t === 0) return L;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= F && (n = R(e, e.strstart)), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = F - 1, n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - I && (e.match_length = Te(e, n), e.match_length <= 5 && (e.strategy === 1 || e.match_length === F && e.strstart - e.match_start > 4096) && (e.match_length = F - 1)), e.prev_length >= F && e.match_length <= e.prev_length) {
			i = e.strstart + e.lookahead - F, r = M(e, e.strstart - 1 - e.prev_match, e.prev_length - F), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
			do
				++e.strstart <= i && (n = R(e, e.strstart));
			while (--e.prev_length !== 0);
			if (e.match_available = 0, e.match_length = F - 1, e.strstart++, r && (z(e, !1), e.strm.avail_out === 0)) return L;
		} else if (e.match_available) {
			if (r = M(e, 0, e.window[e.strstart - 1]), r && z(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return L;
		} else e.match_available = 1, e.strstart++, e.lookahead--;
	}
	return e.match_available &&= (r = M(e, 0, e.window[e.strstart - 1]), 0), e.insert = e.strstart < F - 1 ? e.strstart : F - 1, t === 4 ? (z(e, !0), e.strm.avail_out === 0 ? ye : be) : e.sym_next && (z(e, !1), e.strm.avail_out === 0) ? L : ve;
}, V = class {
	constructor(e, t, n, r, i) {
		this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = i;
	}
};
new V(0, 0, 0, 0, De), new V(4, 4, 8, 4, Oe), new V(4, 5, 16, 8, Oe), new V(4, 6, 32, 32, Oe), new V(4, 4, 16, 16, B), new V(8, 16, 32, 32, B), new V(8, 16, 128, 128, B), new V(8, 32, 128, 256, B), new V(32, 128, 258, 1024, B), new V(32, 258, 258, 4096, B);
var H = 16209, ke = 16191;
function Ae(e, t) {
	let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, E = e.state;
	n = e.next_in, w = e.input, r = n + (e.avail_in - 5), i = e.next_out, T = e.output, a = i - (t - e.avail_out), o = i + (e.avail_out - 257), s = E.dmax, c = E.wsize, l = E.whave, u = E.wnext, d = E.window, f = E.hold, p = E.bits, m = E.lencode, h = E.distcode, g = (1 << E.lenbits) - 1, _ = (1 << E.distbits) - 1;
	top: do {
		p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = m[f & g];
		dolen: for (;;) {
			if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y === 0) T[i++] = v & 65535;
			else if (y & 16) {
				b = v & 65535, y &= 15, y && (p < y && (f += w[n++] << p, p += 8), b += f & (1 << y) - 1, f >>>= y, p -= y), p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = h[f & _];
				dodist: for (;;) {
					if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y & 16) {
						if (x = v & 65535, y &= 15, p < y && (f += w[n++] << p, p += 8, p < y && (f += w[n++] << p, p += 8)), x += f & (1 << y) - 1, x > s) {
							e.msg = "invalid distance too far back", E.mode = H;
							break top;
						}
						if (f >>>= y, p -= y, y = i - a, x > y) {
							if (y = x - y, y > l && E.sane) {
								e.msg = "invalid distance too far back", E.mode = H;
								break top;
							}
							if (S = 0, C = d, u === 0) {
								if (S += c - y, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									S = i - x, C = T;
								}
							} else if (u < y) {
								if (S += c + u - y, y -= u, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									if (S = 0, u < b) {
										y = u, b -= y;
										do
											T[i++] = d[S++];
										while (--y);
										S = i - x, C = T;
									}
								}
							} else if (S += u - y, y < b) {
								b -= y;
								do
									T[i++] = d[S++];
								while (--y);
								S = i - x, C = T;
							}
							for (; b > 2;) T[i++] = C[S++], T[i++] = C[S++], T[i++] = C[S++], b -= 3;
							b && (T[i++] = C[S++], b > 1 && (T[i++] = C[S++]));
						} else {
							S = i - x;
							do
								T[i++] = T[S++], T[i++] = T[S++], T[i++] = T[S++], b -= 3;
							while (b > 2);
							b && (T[i++] = T[S++], b > 1 && (T[i++] = T[S++]));
						}
					} else if (y & 64) {
						e.msg = "invalid distance code", E.mode = H;
						break top;
					} else {
						v = h[(v & 65535) + (f & (1 << y) - 1)];
						continue dodist;
					}
					break;
				}
			} else if (!(y & 64)) {
				v = m[(v & 65535) + (f & (1 << y) - 1)];
				continue dolen;
			} else if (y & 32) {
				E.mode = ke;
				break top;
			} else {
				e.msg = "invalid literal/length code", E.mode = H;
				break top;
			}
			break;
		}
	} while (n < r && i < o);
	b = p >> 3, n -= b, p -= b << 3, f &= (1 << p) - 1, e.next_in = n, e.next_out = i, e.avail_in = n < r ? 5 + (r - n) : 5 - (n - r), e.avail_out = i < o ? 257 + (o - i) : 257 - (i - o), E.hold = f, E.bits = p;
}
var U = 15, je = 852, Me = 592, Ne = 0, Pe = 1, Fe = 2, Ie = new Uint16Array([
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	13,
	15,
	17,
	19,
	23,
	27,
	31,
	35,
	43,
	51,
	59,
	67,
	83,
	99,
	115,
	131,
	163,
	195,
	227,
	258,
	0,
	0
]), Le = new Uint8Array([
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	17,
	17,
	17,
	17,
	18,
	18,
	18,
	18,
	19,
	19,
	19,
	19,
	20,
	20,
	20,
	20,
	21,
	21,
	21,
	21,
	16,
	199,
	75
]), Re = new Uint16Array([
	1,
	2,
	3,
	4,
	5,
	7,
	9,
	13,
	17,
	25,
	33,
	49,
	65,
	97,
	129,
	193,
	257,
	385,
	513,
	769,
	1025,
	1537,
	2049,
	3073,
	4097,
	6145,
	8193,
	12289,
	16385,
	24577,
	0,
	0
]), ze = new Uint8Array([
	16,
	16,
	16,
	16,
	17,
	17,
	18,
	18,
	19,
	19,
	20,
	20,
	21,
	21,
	22,
	22,
	23,
	23,
	24,
	24,
	25,
	25,
	26,
	26,
	27,
	27,
	28,
	28,
	29,
	29,
	64,
	64
]), W = (e, t, n, r, i, a, o, s) => {
	let c = s.bits, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y, b, x, S, C, w = null, T, E = /* @__PURE__ */ new Uint16Array(16), D = /* @__PURE__ */ new Uint16Array(16), O = null, k, A, j;
	for (l = 0; l <= U; l++) E[l] = 0;
	for (u = 0; u < r; u++) E[t[n + u]]++;
	for (p = c, f = U; f >= 1 && E[f] === 0; f--);
	if (p > f && (p = f), f === 0) return i[a++] = 20971520, i[a++] = 20971520, s.bits = 1, 0;
	for (d = 1; d < f && E[d] === 0; d++);
	for (p < d && (p = d), g = 1, l = 1; l <= U; l++) if (g <<= 1, g -= E[l], g < 0) return -1;
	if (g > 0 && (e === Ne || f !== 1)) return -1;
	for (D[1] = 0, l = 1; l < U; l++) D[l + 1] = D[l] + E[l];
	for (u = 0; u < r; u++) t[n + u] !== 0 && (o[D[t[n + u]]++] = u);
	if (e === Ne ? (w = O = o, T = 20) : e === Pe ? (w = Ie, O = Le, T = 257) : (w = Re, O = ze, T = 0), v = 0, u = 0, l = d, C = a, m = p, h = 0, x = -1, _ = 1 << p, S = _ - 1, e === Pe && _ > je || e === Fe && _ > Me) return 1;
	for (;;) {
		k = l - h, o[u] + 1 < T ? (A = 0, j = o[u]) : o[u] >= T ? (A = O[o[u] - T], j = w[o[u] - T]) : (A = 96, j = 0), y = 1 << l - h, b = 1 << m, d = b;
		do
			b -= y, i[C + (v >> h) + b] = k << 24 | A << 16 | j;
		while (b !== 0);
		for (y = 1 << l - 1; v & y;) y >>= 1;
		if (y === 0 ? v = 0 : (v &= y - 1, v += y), u++, --E[l] === 0) {
			if (l === f) break;
			l = t[n + o[u]];
		}
		if (l > p && (v & S) !== x) {
			for (h === 0 && (h = p), C += d, m = l - h, g = 1 << m; m + h < f && (g -= E[m + h], !(g <= 0));) m++, g <<= 1;
			if (_ += 1 << m, e === Pe && _ > je || e === Fe && _ > Me) return 1;
			x = v & S, i[x] = p << 24 | m << 16 | C - a;
		}
	}
	return v !== 0 && (i[C + v] = l - h << 24 | 4194304), s.bits = p, 0;
}, Be = 0, Ve = 1, He = 2, G = 16180, Ue = 16181, We = 16182, Ge = 16183, Ke = 16184, qe = 16185, Je = 16186, Ye = 16187, Xe = 16188, Ze = 16189, K = 16190, q = 16191, Qe = 16192, $e = 16193, J = 16194, et = 16195, tt = 16196, nt = 16197, rt = 16198, Y = 16199, X = 16200, it = 16201, at = 16202, ot = 16203, st = 16204, ct = 16205, lt = 16206, ut = 16207, dt = 16208, Z = 16209, ft = 16210, pt = 16211, mt = 852, ht = 592, gt = (e) => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24), _t = class {
	constructor() {
		this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = /* @__PURE__ */ new Uint16Array(320), this.work = /* @__PURE__ */ new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
	}
}, Q = (e) => {
	if (!e) return 1;
	let t = e.state;
	return +(!t || t.strm !== e || t.mode < G || t.mode > pt);
}, vt = (e) => {
	if (Q(e)) return -2;
	let t = e.state;
	return e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = t.wrap & 1), t.mode = G, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(mt), t.distcode = t.distdyn = new Int32Array(ht), t.sane = 1, t.back = -1, 0;
}, yt = (e) => {
	if (Q(e)) return -2;
	let t = e.state;
	return t.wsize = 0, t.whave = 0, t.wnext = 0, vt(e);
}, bt = (e, t) => {
	let n;
	if (Q(e)) return -2;
	let r = e.state;
	return t < 0 ? (n = 0, t = -t) : (n = (t >> 4) + 5, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? -2 : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, yt(e));
}, xt = (e, t) => {
	if (!e) return -2;
	let n = new _t();
	e.state = n, n.strm = e, n.window = null, n.mode = G;
	let r = bt(e, t);
	return r !== 0 && (e.state = null), r;
}, St = !0, Ct, wt, Tt = (e) => {
	if (St) {
		Ct = /* @__PURE__ */ new Int32Array(512), wt = /* @__PURE__ */ new Int32Array(32);
		let t = 0;
		for (; t < 144;) e.lens[t++] = 8;
		for (; t < 256;) e.lens[t++] = 9;
		for (; t < 280;) e.lens[t++] = 7;
		for (; t < 288;) e.lens[t++] = 8;
		for (W(Ve, e.lens, 0, 288, Ct, 0, e.work, { bits: 9 }), t = 0; t < 32;) e.lens[t++] = 5;
		W(He, e.lens, 0, 32, wt, 0, e.work, { bits: 5 }), St = !1;
	}
	e.lencode = Ct, e.lenbits = 9, e.distcode = wt, e.distbits = 5;
}, Et = (e, t, n, r) => {
	let i, a = e.state;
	return a.window === null && (a.window = new Uint8Array(1 << a.wbits)), a.wsize === 0 && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0), r >= a.wsize ? (a.window.set(t.subarray(n - a.wsize, n), 0), a.wnext = 0, a.whave = a.wsize) : (i = a.wsize - a.wnext, i > r && (i = r), a.window.set(t.subarray(n - r, n - r + i), a.wnext), r -= i, r ? (a.window.set(t.subarray(n - r, n), 0), a.wnext = r, a.whave = a.wsize) : (a.wnext += i, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += i))), 0;
}, Dt = (e, t) => {
	let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g = 0, _, v, y, b, x, S, C, w, T = /* @__PURE__ */ new Uint8Array(4), E, D, O = new Uint8Array([
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	]);
	if (Q(e) || !e.output || !e.input && e.avail_in !== 0) return -2;
	n = e.state, n.mode === q && (n.mode = Qe), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, d = s, f = c, w = 0;
	inf_leave: for (;;) switch (n.mode) {
		case G:
			if (n.wrap === 0) {
				n.mode = Qe;
				break;
			}
			for (; u < 16;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			if (n.wrap & 2 && l === 35615) {
				n.wbits === 0 && (n.wbits = 15), n.check = 0, T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = P(n.check, T, 2, 0), l = 0, u = 0, n.mode = Ue;
				break;
			}
			if (n.head && (n.head.done = !1), !(n.wrap & 1) || (((l & 255) << 8) + (l >> 8)) % 31) {
				e.msg = "incorrect header check", n.mode = Z;
				break;
			}
			if ((l & 15) != 8) {
				e.msg = "unknown compression method", n.mode = Z;
				break;
			}
			if (l >>>= 4, u -= 4, C = (l & 15) + 8, n.wbits === 0 && (n.wbits = C), C > 15 || C > n.wbits) {
				e.msg = "invalid window size", n.mode = Z;
				break;
			}
			n.dmax = 1 << n.wbits, n.flags = 0, e.adler = n.check = 1, n.mode = l & 512 ? Ze : q, l = 0, u = 0;
			break;
		case Ue:
			for (; u < 16;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			if (n.flags = l, (n.flags & 255) != 8) {
				e.msg = "unknown compression method", n.mode = Z;
				break;
			}
			if (n.flags & 57344) {
				e.msg = "unknown header flags set", n.mode = Z;
				break;
			}
			n.head && (n.head.text = l >> 8 & 1), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = P(n.check, T, 2, 0)), l = 0, u = 0, n.mode = We;
		case We:
			for (; u < 32;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			n.head && (n.head.time = l >>> 0), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, T[2] = l >>> 16 & 255, T[3] = l >>> 24 & 255, n.check = P(n.check, T, 4, 0)), l = 0, u = 0, n.mode = Ge;
		case Ge:
			for (; u < 16;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			n.head && (n.head.xflags = l & 255, n.head.os = l >> 8), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = P(n.check, T, 2, 0)), l = 0, u = 0, n.mode = Ke;
		case Ke:
			if (n.flags & 1024) {
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.length = l, n.head && (n.head.extra_len = l), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = P(n.check, T, 2, 0)), l = 0, u = 0;
			} else n.head && (n.head.extra = null);
			n.mode = qe;
		case qe:
			if (n.flags & 1024 && (p = n.length, p > s && (p = s), p && (n.head && (C = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Uint8Array(n.head.extra_len)), n.head.extra.set(r.subarray(a, a + p), C)), n.flags & 512 && n.wrap & 4 && (n.check = P(n.check, r, p, a)), s -= p, a += p, n.length -= p), n.length)) break inf_leave;
			n.length = 0, n.mode = Je;
		case Je:
			if (n.flags & 2048) {
				if (s === 0) break inf_leave;
				p = 0;
				do
					C = r[a + p++], n.head && C && n.length < 65536 && (n.head.name += String.fromCharCode(C));
				while (C && p < s);
				if (n.flags & 512 && n.wrap & 4 && (n.check = P(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
			} else n.head && (n.head.name = null);
			n.length = 0, n.mode = Ye;
		case Ye:
			if (n.flags & 4096) {
				if (s === 0) break inf_leave;
				p = 0;
				do
					C = r[a + p++], n.head && C && n.length < 65536 && (n.head.comment += String.fromCharCode(C));
				while (C && p < s);
				if (n.flags & 512 && n.wrap & 4 && (n.check = P(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
			} else n.head && (n.head.comment = null);
			n.mode = Xe;
		case Xe:
			if (n.flags & 512) {
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.wrap & 4 && l !== (n.check & 65535)) {
					e.msg = "header crc mismatch", n.mode = Z;
					break;
				}
				l = 0, u = 0;
			}
			n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = q;
			break;
		case Ze:
			for (; u < 32;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			e.adler = n.check = gt(l), l = 0, u = 0, n.mode = K;
		case K:
			if (n.havedict === 0) return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, 2;
			e.adler = n.check = 1, n.mode = q;
		case q: if (t === 5 || t === 6) break inf_leave;
		case Qe:
			if (n.last) {
				l >>>= u & 7, u -= u & 7, n.mode = lt;
				break;
			}
			for (; u < 3;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			switch (n.last = l & 1, l >>>= 1, --u, l & 3) {
				case 0:
					n.mode = $e;
					break;
				case 1:
					if (Tt(n), n.mode = Y, t === 6) {
						l >>>= 2, u -= 2;
						break inf_leave;
					}
					break;
				case 2:
					n.mode = tt;
					break;
				case 3: e.msg = "invalid block type", n.mode = Z;
			}
			l >>>= 2, u -= 2;
			break;
		case $e:
			for (l >>>= u & 7, u -= u & 7; u < 32;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			if ((l & 65535) != (l >>> 16 ^ 65535)) {
				e.msg = "invalid stored block lengths", n.mode = Z;
				break;
			}
			if (n.length = l & 65535, l = 0, u = 0, n.mode = J, t === 6) break inf_leave;
		case J: n.mode = et;
		case et:
			if (p = n.length, p) {
				if (p > s && (p = s), p > c && (p = c), p === 0) break inf_leave;
				i.set(r.subarray(a, a + p), o), s -= p, a += p, c -= p, o += p, n.length -= p;
				break;
			}
			n.mode = q;
			break;
		case tt:
			for (; u < 14;) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			if (n.nlen = (l & 31) + 257, l >>>= 5, u -= 5, n.ndist = (l & 31) + 1, l >>>= 5, u -= 5, n.ncode = (l & 15) + 4, l >>>= 4, u -= 4, n.nlen > 286 || n.ndist > 30) {
				e.msg = "too many length or distance symbols", n.mode = Z;
				break;
			}
			n.have = 0, n.mode = nt;
		case nt:
			for (; n.have < n.ncode;) {
				for (; u < 3;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.lens[O[n.have++]] = l & 7, l >>>= 3, u -= 3;
			}
			for (; n.have < 19;) n.lens[O[n.have++]] = 0;
			if (n.lencode = n.lendyn, n.lenbits = 7, E = { bits: n.lenbits }, w = W(Be, n.lens, 0, 19, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
				e.msg = "invalid code lengths set", n.mode = Z;
				break;
			}
			n.have = 0, n.mode = rt;
		case rt:
			for (; n.have < n.nlen + n.ndist;) {
				for (; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (y < 16) l >>>= _, u -= _, n.lens[n.have++] = y;
				else {
					if (y === 16) {
						for (D = _ + 2; u < D;) {
							if (s === 0) break inf_leave;
							s--, l += r[a++] << u, u += 8;
						}
						if (l >>>= _, u -= _, n.have === 0) {
							e.msg = "invalid bit length repeat", n.mode = Z;
							break;
						}
						C = n.lens[n.have - 1], p = 3 + (l & 3), l >>>= 2, u -= 2;
					} else if (y === 17) {
						for (D = _ + 3; u < D;) {
							if (s === 0) break inf_leave;
							s--, l += r[a++] << u, u += 8;
						}
						l >>>= _, u -= _, C = 0, p = 3 + (l & 7), l >>>= 3, u -= 3;
					} else {
						for (D = _ + 7; u < D;) {
							if (s === 0) break inf_leave;
							s--, l += r[a++] << u, u += 8;
						}
						l >>>= _, u -= _, C = 0, p = 11 + (l & 127), l >>>= 7, u -= 7;
					}
					if (n.have + p > n.nlen + n.ndist) {
						e.msg = "invalid bit length repeat", n.mode = Z;
						break;
					}
					for (; p--;) n.lens[n.have++] = C;
				}
			}
			if (n.mode === Z) break;
			if (n.lens[256] === 0) {
				e.msg = "invalid code -- missing end-of-block", n.mode = Z;
				break;
			}
			if (n.lenbits = 9, E = { bits: n.lenbits }, w = W(Ve, n.lens, 0, n.nlen, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
				e.msg = "invalid literal/lengths set", n.mode = Z;
				break;
			}
			if (n.distbits = 6, n.distcode = n.distdyn, E = { bits: n.distbits }, w = W(He, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, E), n.distbits = E.bits, w) {
				e.msg = "invalid distances set", n.mode = Z;
				break;
			}
			if (n.mode = Y, t === 6) break inf_leave;
		case Y: n.mode = X;
		case X:
			if (s >= 6 && c >= 258) {
				e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, Ae(e, f), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, n.mode === q && (n.back = -1);
				break;
			}
			for (n.back = 0; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			if (v && !(v & 240)) {
				for (b = _, x = v, S = y; g = n.lencode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				l >>>= b, u -= b, n.back += b;
			}
			if (l >>>= _, u -= _, n.back += _, n.length = y, v === 0) {
				n.mode = ct;
				break;
			}
			if (v & 32) {
				n.back = -1, n.mode = q;
				break;
			}
			if (v & 64) {
				e.msg = "invalid literal/length code", n.mode = Z;
				break;
			}
			n.extra = v & 15, n.mode = it;
		case it:
			if (n.extra) {
				for (D = n.extra; u < D;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.length += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
			}
			n.was = n.length, n.mode = at;
		case at:
			for (; g = n.distcode[l & (1 << n.distbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
				if (s === 0) break inf_leave;
				s--, l += r[a++] << u, u += 8;
			}
			if (!(v & 240)) {
				for (b = _, x = v, S = y; g = n.distcode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				l >>>= b, u -= b, n.back += b;
			}
			if (l >>>= _, u -= _, n.back += _, v & 64) {
				e.msg = "invalid distance code", n.mode = Z;
				break;
			}
			n.offset = y, n.extra = v & 15, n.mode = ot;
		case ot:
			if (n.extra) {
				for (D = n.extra; u < D;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.offset += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
			}
			if (n.offset > n.dmax) {
				e.msg = "invalid distance too far back", n.mode = Z;
				break;
			}
			n.mode = st;
		case st:
			if (c === 0) break inf_leave;
			if (p = f - c, n.offset > p) {
				if (p = n.offset - p, p > n.whave && n.sane) {
					e.msg = "invalid distance too far back", n.mode = Z;
					break;
				}
				p > n.wnext ? (p -= n.wnext, m = n.wsize - p) : m = n.wnext - p, p > n.length && (p = n.length), h = n.window;
			} else h = i, m = o - n.offset, p = n.length;
			p > c && (p = c), c -= p, n.length -= p;
			do
				i[o++] = h[m++];
			while (--p);
			n.length === 0 && (n.mode = X);
			break;
		case ct:
			if (c === 0) break inf_leave;
			i[o++] = n.length, c--, n.mode = X;
			break;
		case lt:
			if (n.wrap) {
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l |= r[a++] << u, u += 8;
				}
				if (f -= c, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? P(n.check, i, f, o - f) : N(n.check, i, f, o - f)), f = c, n.wrap & 4 && (n.flags ? l : gt(l)) !== n.check) {
					e.msg = "incorrect data check", n.mode = Z;
					break;
				}
				l = 0, u = 0;
			}
			n.mode = ut;
		case ut:
			if (n.wrap && n.flags) {
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.wrap & 4 && l !== (n.total | 0)) {
					e.msg = "incorrect length check", n.mode = Z;
					break;
				}
				l = 0, u = 0;
			}
			n.mode = dt;
		case dt:
			w = 1;
			break inf_leave;
		case Z:
			w = -3;
			break inf_leave;
		case ft: return -4;
		case pt:
		default: return -2;
	}
	return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, (n.wsize || f !== e.avail_out && n.mode < Z && (n.mode < lt || t !== 4)) && Et(e, e.output, e.next_out, f - e.avail_out) ? (n.mode = ft, -4) : (d -= e.avail_in, f -= e.avail_out, e.total_in += d, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? P(n.check, i, f, e.next_out - f) : N(n.check, i, f, e.next_out - f)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === q ? 128 : 0) + (n.mode === Y || n.mode === J ? 256 : 0), (d === 0 && f === 0 || t === 4) && w === 0 && (w = -5), w);
}, Ot = (e) => {
	if (Q(e)) return -2;
	let t = e.state;
	return t.window &&= null, e.state = null, 0;
}, kt = (e, t) => {
	let n = t.length, r, i, a;
	return Q(e) || (r = e.state, r.wrap !== 0 && r.mode !== K) ? -2 : r.mode === K && (i = 1, i = N(i, t, n, 0), i !== r.check) ? -3 : (a = Et(e, t, n, n), a ? (r.mode = ft, -4) : (r.havedict = 1, 0));
}, At = class {
	constructor() {
		this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
	}
}, jt = (e) => {
	let t = new Uint8Array(e.reduce((e, t) => e + t.length, 0)), n = 0;
	for (let r of e) t.set(r, n), n += r.length;
	return t;
}, Mt = Object.prototype.toString, Nt = {
	chunkSize: 65536,
	windowBits: 15,
	raw: !1,
	dictionary: /* @__PURE__ */ new Uint8Array()
}, Pt = class {
	options;
	err;
	msg;
	ended;
	started;
	chunks;
	strm;
	result;
	constructor(e = {}) {
		this.options = Object.assign({}, Nt, e);
		let t = this.options;
		t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), t.windowBits >= 0 && t.windowBits < 16 && !e.windowBits && (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (t.windowBits & 15 || (t.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.started = !1, this.chunks = [], this.result = /* @__PURE__ */ new Uint8Array(), this.strm = new At(), this.strm.avail_out = 0;
		let n = xt(this.strm, t.windowBits);
		if (n !== 0) throw Error(ge[n]);
		Mt.call(t.dictionary) === "[object ArrayBuffer]" && (t.dictionary = new Uint8Array(t.dictionary));
		let r = t.dictionary;
		if (t.raw && r.length && (n = kt(this.strm, r), n !== 0)) throw Error(ge[n]);
	}
	push(e, t = !1) {
		let n = this.strm, r = this.options.chunkSize, i, a, o;
		if (this.ended) return this.err === 0;
		for (a = typeof t == "number" ? t : t === !0 ? 4 : 0, n.input = Mt.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, n.next_in = 0, n.avail_in = n.input.length, this.started || (this.started = !0, this.onStart(n));;) {
			if (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), i = Dt(n, a), i === 2) {
				let e = this.options.dictionary;
				e.length && (i = kt(n, e), i === 0 ? i = Dt(n, a) : i === -3 && (i = 2));
			}
			for (; n.avail_in > 0 && i === 1 && n.state.wrap & 2 && n.state.flags !== 0 && n.input[n.next_in] !== 0;) yt(n), i = Dt(n, a);
			if (i === -2 || i === -3 || i === 2 || i === -4) break;
			if (o = n.avail_out, n.next_out && (n.avail_out === 0 || i === 1 || a > 0) && (this.onData(n.output.length === n.next_out ? n.output : n.output.subarray(0, n.next_out)), n.avail_out = 0, n.next_out = 0), i !== 0 && i !== -5 || o !== 0) {
				if (i === 1) {
					i = Ot(this.strm);
					break;
				}
				if (n.avail_in === 0) {
					if (a === 4) {
						i = Ot(this.strm), i === 0 && (i = -5);
						break;
					}
					return !0;
				}
			}
		}
		return this.err = i, this.msg = n.msg || ge[i], this.ended = !0, this.onEnd(i), i === 0;
	}
	onStart(e) {}
	onData(e) {
		this.chunks.push(e);
	}
	onEnd(e) {
		e === 0 && (this.result = jt(this.chunks)), this.chunks = [];
	}
};
function Ft(e, t = {}) {
	let n = new Pt(t);
	if (n.push(e, !0), n.err) throw Error(n.msg);
	let r = n.result;
	return t.toText ? new TextDecoder().decode(r) : r;
}
function It(e, t = {}) {
	return Ft(e, {
		...t,
		raw: !0
	});
}
//#endregion
//#region node_modules/@foxglove/crc/dist/esm/src/index.js
function Lt({ polynomial: e, numTables: t }) {
	let n = new Uint32Array(256 * t);
	for (let t = 0; t < 256; t++) {
		let r = t;
		r = (r & 1) * e ^ r >>> 1, r = (r & 1) * e ^ r >>> 1, r = (r & 1) * e ^ r >>> 1, r = (r & 1) * e ^ r >>> 1, r = (r & 1) * e ^ r >>> 1, r = (r & 1) * e ^ r >>> 1, r = (r & 1) * e ^ r >>> 1, r = (r & 1) * e ^ r >>> 1, n[t] = r;
	}
	for (let e = 256; e < n.length; e++) {
		let t = n[e - 256];
		n[e] = n[t & 255] ^ t >>> 8;
	}
	return n;
}
var $ = Lt({
	polynomial: 3988292384,
	numTables: 8
});
function Rt() {
	return -1;
}
function zt(e, t) {
	let n = t.byteLength, r = new DataView(t.buffer, t.byteOffset, n), i = e, a = 0, o = -r.byteOffset & 3;
	for (; a < o && a < n; a++) i = $[(i ^ r.getUint8(a)) & 255] ^ i >>> 8;
	if (a === n) return i;
	a = o;
	let s = n - a;
	for (; s >= 8; a += 8, s -= 8) {
		i ^= r.getUint32(a, !0);
		let e = r.getUint32(a + 4, !0);
		i = $[0 + (e >>> 24 & 255)] ^ $[256 + (e >>> 16 & 255)] ^ $[512 + (e >>> 8 & 255)] ^ $[768 + (e >>> 0 & 255)] ^ $[1024 + (i >>> 24 & 255)] ^ $[1280 + (i >>> 16 & 255)] ^ $[1536 + (i >>> 8 & 255)] ^ $[1792 + (i >>> 0 & 255)];
	}
	for (let e = a; e < n; e++) i = $[(i ^ r.getUint8(e)) & 255] ^ i >>> 8;
	return i;
}
function Bt(e) {
	return (e ^ -1) >>> 0;
}
function Vt(e) {
	return Bt(zt(Rt(), e));
}
//#endregion
//#region lib/mime-types.ts
var Ht = {
	".3g2": "video/3gpp2",
	".3gp": "video/3gpp",
	".7z": "application/x-7z-compressed",
	".aac": "audio/aac",
	".abw": "application/x-abiword",
	".arc": "application/x-freearc",
	".avi": "video/x-msvideo",
	".avif": "image/avif",
	".azw": "application/vnd.amazon.ebook",
	".bin": "application/octet-stream",
	".bmp": "image/bmp",
	".bz": "application/x-bzip",
	".bz2": "application/x-bzip2",
	".cjs": "text/javascript",
	".csh": "application/x-csh",
	".css": "text/css",
	".csv": "text/csv",
	".doc": "application/msword",
	".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".eot": "application/vnd.ms-fontobject",
	".epub": "application/epub+zip",
	".gif": "image/gif",
	".glb": "model/gltf-binary",
	".gltf": "model/gltf+json",
	".gz": "application/gzip",
	".htm": "text/html",
	".html": "text/html",
	".ico": "image/vnd.microsoft.icon",
	".ics": "text/calendar",
	".jar": "application/java-archive",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".js": "text/javascript",
	".json": "application/json",
	".jsonld": "application/ld+json",
	".mid": "audio/midi",
	".mjs": "text/javascript",
	".mp3": "audio/mpeg",
	".mp4": "video/mp4",
	".mpeg": "video/mpeg",
	".mpkg": "application/vnd.apple.installer+xml",
	".mtl": "model/mtl",
	".obj": "model/obj",
	".odp": "application/vnd.oasis.opendocument.presentation",
	".ods": "application/vnd.oasis.opendocument.spreadsheet",
	".odt": "application/vnd.oasis.opendocument.text",
	".oga": "audio/ogg",
	".ogv": "video/ogg",
	".ogx": "application/ogg",
	".opus": "audio/opus",
	".otf": "font/otf",
	".pdf": "application/pdf",
	".php": "application/php",
	".png": "image/png",
	".ppt": "application/vnd.ms-powerpoint",
	".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".rar": "application/vnd.rar",
	".rtf": "application/rtf",
	".sh": "application/x-sh",
	".stl": "model/stl",
	".svg": "image/svg+xml",
	".swf": "application/x-shockwave-flash",
	".tar": "application/x-tar",
	".tif": "image/tiff",
	".tiff": "image/tiff",
	".ts": "video/mp2t",
	".ttf": "font/ttf",
	".txt": "text/plain",
	".vsd": "application/vnd.visio",
	".wasm": "application/wasm",
	".wav": "audio/wav",
	".weba": "audio/webm",
	".webm": "video/webm",
	".webp": "image/webp",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".xhtml": "application/xhtml+xml",
	".xls": "application/vnd.ms-excel",
	".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	".xml": "application/xml",
	".xul": "application/vnd.mozilla.xul+xml",
	".zip": "application/zip"
}, Ut = class {
	url;
	options;
	zipSize = 0;
	files = /* @__PURE__ */ new Map();
	loaded = !1;
	loadPromise = null;
	magic_eocd = new Uint8Array([
		80,
		75,
		5,
		6
	]);
	magic_eocd64 = new Uint8Array([
		80,
		75,
		6,
		6
	]);
	magic_eocd64_locator = new Uint8Array([
		80,
		75,
		6,
		7
	]);
	constructor(e, t = {}) {
		this.url = e, this.options = {
			strictCrc: t.strictCrc ?? !0,
			debug: t.debug ?? !1,
			headers: t.headers,
			fetch: t.fetch,
			signal: t.signal
		};
	}
	async getRange(e, t) {
		let n = this.options.fetch || globalThis.fetch, r = new Headers(this.options.headers);
		r.set("Range", `bytes=${e}-${e + t - 1}`);
		let i = await n(this.url, {
			method: "GET",
			headers: r,
			signal: this.options.signal
		});
		if (!i.ok) throw Error(`Failed to fetch range: ${i.status} ${i.statusText}`);
		let a = await i.arrayBuffer();
		return i.status === 200 && (this.options.debug && console.warn("Server returned 200 OK instead of 206 Partial Content. Slicing requested range from response body."), a.byteLength > t) ? a.slice(e, e + t) : a;
	}
	async infoiter() {
		let e = this.options.fetch || globalThis.fetch, t = new Headers(this.options.headers), n = await e(this.url, {
			method: "HEAD",
			headers: t,
			signal: this.options.signal
		});
		if (!n.ok) throw Error(`Failed to fetch zip metadata: ${n.status} ${n.statusText}`);
		let r = n.headers.get("Accept-Ranges") || "";
		if (r !== "bytes" && this.options.debug) {
			let e = new URL(this.url).hostname;
			console.warn(`${e} Accept-Ranges header ('${r}') is not 'bytes'--trying anyway`);
		}
		if (this.zipSize = parseInt(n.headers.get("Content-Length") || "0", 10), !this.zipSize || this.zipSize <= 0) throw Error("Invalid or missing Content-Length header");
		let i = Math.min(this.zipSize, 65536), a = this.zipSize - i, o = await this.getRange(a, i), s = new Uint8Array(o), c = -1, l = 0, u = this.findLastIndex(s, this.magic_eocd);
		if (u >= 0) {
			let e = new DataView(o, u);
			l = e.getUint32(12, !0), c = e.getUint32(16, !0);
			let t = e.getUint16(10, !0);
			if (c === 4294967295 || l === 4294967295 || t === 65535) {
				let e = !1, t = -1;
				if (u >= 20 && s[u - 20] === 80 && s[u - 19] === 75 && s[u - 18] === 6 && s[u - 17] === 7 && (t = u - 20), t < 0 && (t = this.findLastIndex(s.subarray(0, u), this.magic_eocd64_locator)), t >= 0) {
					let n = new DataView(o, t), r = Number(n.getBigUint64(8, !0));
					if (r >= a && r + 56 <= this.zipSize) {
						let t = new DataView(o, r - a);
						t.getUint32(0, !0) === 101075792 && (l = Number(t.getBigUint64(40, !0)), c = Number(t.getBigUint64(48, !0)), e = !0);
					} else if (r >= 0 && r + 56 <= this.zipSize) {
						let t = await this.getRange(r, 56), n = new DataView(t);
						n.getUint32(0, !0) === 101075792 && (l = Number(n.getBigUint64(40, !0)), c = Number(n.getBigUint64(48, !0)), e = !0);
					}
				}
				if (!e) {
					let e = this.findLastIndex(s, this.magic_eocd64);
					if (e >= 0 && e + 56 <= s.length) {
						let t = new DataView(o, e);
						t.getUint32(0, !0) === 101075792 && (l = Number(t.getBigUint64(40, !0)), c = Number(t.getBigUint64(48, !0)));
					}
				}
			}
		} else {
			let e = this.findLastIndex(s, this.magic_eocd64);
			if (e >= 0 && e + 56 <= s.length) {
				let t = new DataView(o, e);
				t.getUint32(0, !0) === 101075792 && (l = Number(t.getBigUint64(40, !0)), c = Number(t.getBigUint64(48, !0)));
			}
		}
		if (c < 0 || c > this.zipSize || l < 0 || c + l > this.zipSize) throw Error("Cannot find central directory");
		if (l === 0) return [];
		o = await this.getRange(c, l), s = new Uint8Array(o);
		let d = [], f = 0;
		for (; f + 46 <= l;) {
			let e = new DataView(o, f);
			if (e.getUint32(0, !0) !== 33639248) break;
			let t = e.getUint16(10, !0), n = e.getUint32(12, !0), r = e.getUint32(16, !0), i = e.getUint32(20, !0), a = e.getUint32(24, !0), c = e.getUint16(28, !0), u = e.getUint16(30, !0), p = e.getUint16(32, !0), m = e.getUint32(42, !0);
			if (f += 46, f + c > l) break;
			let h = new TextDecoder().decode(s.subarray(f, f + c));
			if (f += c, f + u > l) break;
			let g = s.subarray(f, f + u);
			f += u, f += p;
			let _ = new Wt(h, n, m, t, i, a, r);
			_.parseExtra(g), d.push(_);
		}
		return d;
	}
	findLastIndex(e, t) {
		for (let n = e.length - t.length; n >= 0; n--) {
			let r = !0;
			for (let i = 0; i < t.length; i++) if (e[n + i] !== t[i]) {
				r = !1;
				break;
			}
			if (r) return n;
		}
		return -1;
	}
	async ensureLoaded() {
		this.loaded || (this.loadPromise ||= (async () => {
			let e = await this.infoiter();
			this.files = new Map(e.map((e) => [e.filename, e])), this.loaded = !0;
		})(), await this.loadPromise);
	}
	async getFileList() {
		return await this.ensureLoaded(), Array.from(this.files.keys());
	}
	async getEntries() {
		return await this.ensureLoaded(), Array.from(this.files.values()).map((e) => e.toEntry());
	}
	async getEntry(e) {
		await this.ensureLoaded();
		let t = this.files.get(e);
		return t ? t.toEntry() : void 0;
	}
	async hasFile(e) {
		return await this.ensureLoaded(), this.files.has(e);
	}
	async getFile(e) {
		await this.ensureLoaded();
		let t = this.files.get(e);
		if (!t) throw Error(`File not found: ${e}`);
		this.options.debug && console.log("File info:", t);
		let n = await this.getRange(t.headerOffset, 30), r = new DataView(n), i = r.getUint32(0, !0);
		if (i !== 67324752) throw Error("Invalid local file header signature");
		let a = r.getUint16(26, !0), o = r.getUint16(28, !0);
		this.options.debug && console.log("Local header info:", {
			signature: i.toString(16),
			filenameLength: a,
			extraFieldLength: o
		});
		let s = t.headerOffset + 30 + a + o;
		this.options.debug && console.log("File data offset:", s);
		let c;
		if (t.compressSize === 0) c = /* @__PURE__ */ new Uint8Array();
		else {
			let e = await this.getRange(s, t.compressSize);
			if (this.options.debug && console.log("Compressed data size:", e.byteLength), t.compressType === 0) c = new Uint8Array(e);
			else if (t.compressType === 8) try {
				c = It(new Uint8Array(e));
			} catch (t) {
				throw this.options.debug && (console.error("Decompression error:", t), console.error("Compressed data (first 50 bytes):", new Uint8Array(e).slice(0, 50))), Error("Failed to decompress file data");
			}
			else throw Error(`Unsupported compression method: ${t.compressType}`);
		}
		if (this.options.debug && console.log("Decompressed data size:", c.length), c.length !== t.fileSize) {
			let e = `Decompressed size (${c.length}) doesn't match expected size (${t.fileSize})`;
			if (this.options.strictCrc) throw Error(e);
			this.options.debug && console.warn(e);
		}
		let l = this.calculateCRC32(c), u = t.crc32 >>> 0;
		if (l !== u) {
			let e = `Calculated CRC32 (${l}) doesn't match expected CRC32 (${u})`;
			if (this.options.strictCrc) throw Error(e);
			this.options.debug && console.warn(e);
		}
		return c;
	}
	async getFileAsText(e, t = "utf-8") {
		let n = await this.getFile(e);
		return new TextDecoder(t).decode(n);
	}
	async getFileAsBlob(e, t = "") {
		let n = await this.getFile(e);
		if (!t) {
			let n = "." + (e.split(".").pop() || "").toLowerCase();
			n in Ht && (t = Ht[n]);
		}
		return new Blob([n], { type: t || "application/octet-stream" });
	}
	async getFileAsObjectURL(e, t = "") {
		let n = await this.getFileAsBlob(e, t);
		return URL.createObjectURL(n);
	}
	calculateCRC32(e) {
		return Vt(e) >>> 0;
	}
}, Wt = class {
	filename;
	dateTime;
	headerOffset;
	compressType;
	compressSize;
	fileSize;
	crc32;
	constructor(e, t, n, r, i, a, o) {
		this.filename = e, this.dateTime = t, this.headerOffset = n, this.compressType = r, this.compressSize = i, this.fileSize = a, this.crc32 = o;
	}
	parseExtra(e) {
		let t = 0, n = new DataView(e.buffer, e.byteOffset, e.byteLength);
		for (; t + 4 <= e.length;) {
			let r = n.getUint16(t, !0), i = n.getUint16(t + 2, !0), a = t + 4 + i;
			if (a > e.length) break;
			if (r === 1) {
				let e = t + 4;
				this.fileSize === 4294967295 && e + 8 <= a && (this.fileSize = Number(n.getBigUint64(e, !0)), e += 8), this.compressSize === 4294967295 && e + 8 <= a && (this.compressSize = Number(n.getBigUint64(e, !0)), e += 8), this.headerOffset === 4294967295 && e + 8 <= a && (this.headerOffset = Number(n.getBigUint64(e, !0)), e += 8);
			}
			t = a;
		}
	}
	toEntry() {
		let e = this.dateTime & 65535, t = this.dateTime >>> 16 & 65535, n = (e & 31) * 2, r = e >>> 5 & 63, i = e >>> 11 & 31, a = Math.max(1, t & 31), o = Math.max(0, (t >>> 5 & 15) - 1), s = (t >>> 9 & 127) + 1980;
		return {
			filename: this.filename,
			dateTime: new Date(s, o, a, i, r, n),
			headerOffset: this.headerOffset,
			compressType: this.compressType,
			compressSize: this.compressSize,
			fileSize: this.fileSize,
			crc32: this.crc32,
			isDirectory: this.filename.endsWith("/")
		};
	}
}, Gt = document.querySelector("#output");
document.querySelector("#load-zip-listing").addEventListener("click", () => {
	let e = document.querySelector("#link-to-zip").value;
	Gt.textContent = e ? "Loading ZIP listing..." : "Please enter a valid ZIP URL";
	let t = new Ut(e);
	t.getFileList().then((e) => {
		Gt.innerHTML = "<ul>" + e.map((e) => `<li>${e} <button class="download-button" type="button" data-file="${e}">Download</button></li>`).join("\n") + "</ul>", document.querySelectorAll(".download-button").forEach((e) => {
			e.addEventListener("click", async (e) => {
				let n = e.target.getAttribute("data-file"), r = await t.getFileAsObjectURL(n), i = document.createElement("a");
				i.href = r, i.download = n.split("/").pop() || n, i.click(), setTimeout(() => {
					i.remove(), URL.revokeObjectURL(r);
				}, 5e3);
			});
		});
	});
});
//#endregion
