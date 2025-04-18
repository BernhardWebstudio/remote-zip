var ot = Object.defineProperty;
var st = (t, i, e) => i in t ? ot(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var T = (t, i, e) => st(t, typeof i != "symbol" ? i + "" : i, e);
(function() {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload"))
    return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
    a(r);
  new MutationObserver((r) => {
    for (const n of r)
      if (n.type === "childList")
        for (const c of n.addedNodes)
          c.tagName === "LINK" && c.rel === "modulepreload" && a(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(r) {
    const n = {};
    return r.integrity && (n.integrity = r.integrity), r.referrerPolicy && (n.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? n.credentials = "include" : r.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
  }
  function a(r) {
    if (r.ep)
      return;
    r.ep = !0;
    const n = e(r);
    fetch(r.href, n);
  }
})();
function M(t) {
  let i = t.length;
  for (; --i >= 0; )
    t[i] = 0;
}
const rt = 3, ft = 258, He = 29, lt = 256, ct = lt + 1 + He, Fe = 30, dt = 512, ht = new Array((ct + 2) * 2);
M(ht);
const ut = new Array(Fe * 2);
M(ut);
const wt = new Array(dt);
M(wt);
const pt = new Array(ft - rt + 1);
M(pt);
const gt = new Array(He);
M(gt);
const xt = new Array(Fe);
M(xt);
const bt = (t, i, e, a) => {
  let r = t & 65535 | 0, n = t >>> 16 & 65535 | 0, c = 0;
  for (; e !== 0; ) {
    c = e > 2e3 ? 2e3 : e, e -= c;
    do
      r = r + i[a++] | 0, n = n + r | 0;
    while (--c);
    r %= 65521, n %= 65521;
  }
  return r | n << 16 | 0;
};
var re = bt;
const _t = () => {
  let t, i = [];
  for (var e = 0; e < 256; e++) {
    t = e;
    for (var a = 0; a < 8; a++)
      t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    i[e] = t;
  }
  return i;
}, mt = new Uint32Array(_t()), vt = (t, i, e, a) => {
  const r = mt, n = a + e;
  t ^= -1;
  for (let c = a; c < n; c++)
    t = t >>> 8 ^ r[(t ^ i[c]) & 255];
  return t ^ -1;
};
var z = vt, fe = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, Pe = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const kt = (t, i) => Object.prototype.hasOwnProperty.call(t, i);
var yt = function(t) {
  const i = Array.prototype.slice.call(arguments, 1);
  for (; i.length; ) {
    const e = i.shift();
    if (e) {
      if (typeof e != "object")
        throw new TypeError(e + "must be non-object");
      for (const a in e)
        kt(e, a) && (t[a] = e[a]);
    }
  }
  return t;
}, Et = (t) => {
  let i = 0;
  for (let a = 0, r = t.length; a < r; a++)
    i += t[a].length;
  const e = new Uint8Array(i);
  for (let a = 0, r = 0, n = t.length; a < n; a++) {
    let c = t[a];
    e.set(c, r), r += c.length;
  }
  return e;
}, Ge = {
  assign: yt,
  flattenChunks: Et
};
let Ke = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Ke = !1;
}
const B = new Uint8Array(256);
for (let t = 0; t < 256; t++)
  B[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
B[254] = B[254] = 1;
var Rt = (t) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(t);
  let i, e, a, r, n, c = t.length, f = 0;
  for (r = 0; r < c; r++)
    e = t.charCodeAt(r), (e & 64512) === 55296 && r + 1 < c && (a = t.charCodeAt(r + 1), (a & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (a - 56320), r++)), f += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
  for (i = new Uint8Array(f), n = 0, r = 0; n < f; r++)
    e = t.charCodeAt(r), (e & 64512) === 55296 && r + 1 < c && (a = t.charCodeAt(r + 1), (a & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (a - 56320), r++)), e < 128 ? i[n++] = e : e < 2048 ? (i[n++] = 192 | e >>> 6, i[n++] = 128 | e & 63) : e < 65536 ? (i[n++] = 224 | e >>> 12, i[n++] = 128 | e >>> 6 & 63, i[n++] = 128 | e & 63) : (i[n++] = 240 | e >>> 18, i[n++] = 128 | e >>> 12 & 63, i[n++] = 128 | e >>> 6 & 63, i[n++] = 128 | e & 63);
  return i;
};
const At = (t, i) => {
  if (i < 65534 && t.subarray && Ke)
    return String.fromCharCode.apply(null, t.length === i ? t : t.subarray(0, i));
  let e = "";
  for (let a = 0; a < i; a++)
    e += String.fromCharCode(t[a]);
  return e;
};
var St = (t, i) => {
  const e = i || t.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(t.subarray(0, i));
  let a, r;
  const n = new Array(e * 2);
  for (r = 0, a = 0; a < e; ) {
    let c = t[a++];
    if (c < 128) {
      n[r++] = c;
      continue;
    }
    let f = B[c];
    if (f > 4) {
      n[r++] = 65533, a += f - 1;
      continue;
    }
    for (c &= f === 2 ? 31 : f === 3 ? 15 : 7; f > 1 && a < e; )
      c = c << 6 | t[a++] & 63, f--;
    if (f > 1) {
      n[r++] = 65533;
      continue;
    }
    c < 65536 ? n[r++] = c : (c -= 65536, n[r++] = 55296 | c >> 10 & 1023, n[r++] = 56320 | c & 1023);
  }
  return At(n, r);
}, Dt = (t, i) => {
  i = i || t.length, i > t.length && (i = t.length);
  let e = i - 1;
  for (; e >= 0 && (t[e] & 192) === 128; )
    e--;
  return e < 0 || e === 0 ? i : e + B[t[e]] > i ? e : i;
}, le = {
  string2buf: Rt,
  buf2string: St,
  utf8border: Dt
};
function Tt() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Ut = Tt;
const G = 16209, zt = 16191;
var Ct = function(i, e) {
  let a, r, n, c, f, u, o, s, E, w, l, p, S, b, x, y, _, d, k, D, h, R, v, g;
  const m = i.state;
  a = i.next_in, v = i.input, r = a + (i.avail_in - 5), n = i.next_out, g = i.output, c = n - (e - i.avail_out), f = n + (i.avail_out - 257), u = m.dmax, o = m.wsize, s = m.whave, E = m.wnext, w = m.window, l = m.hold, p = m.bits, S = m.lencode, b = m.distcode, x = (1 << m.lenbits) - 1, y = (1 << m.distbits) - 1;
  e:
    do {
      p < 15 && (l += v[a++] << p, p += 8, l += v[a++] << p, p += 8), _ = S[l & x];
      t:
        for (; ; ) {
          if (d = _ >>> 24, l >>>= d, p -= d, d = _ >>> 16 & 255, d === 0)
            g[n++] = _ & 65535;
          else if (d & 16) {
            k = _ & 65535, d &= 15, d && (p < d && (l += v[a++] << p, p += 8), k += l & (1 << d) - 1, l >>>= d, p -= d), p < 15 && (l += v[a++] << p, p += 8, l += v[a++] << p, p += 8), _ = b[l & y];
            i:
              for (; ; ) {
                if (d = _ >>> 24, l >>>= d, p -= d, d = _ >>> 16 & 255, d & 16) {
                  if (D = _ & 65535, d &= 15, p < d && (l += v[a++] << p, p += 8, p < d && (l += v[a++] << p, p += 8)), D += l & (1 << d) - 1, D > u) {
                    i.msg = "invalid distance too far back", m.mode = G;
                    break e;
                  }
                  if (l >>>= d, p -= d, d = n - c, D > d) {
                    if (d = D - d, d > s && m.sane) {
                      i.msg = "invalid distance too far back", m.mode = G;
                      break e;
                    }
                    if (h = 0, R = w, E === 0) {
                      if (h += o - d, d < k) {
                        k -= d;
                        do
                          g[n++] = w[h++];
                        while (--d);
                        h = n - D, R = g;
                      }
                    } else if (E < d) {
                      if (h += o + E - d, d -= E, d < k) {
                        k -= d;
                        do
                          g[n++] = w[h++];
                        while (--d);
                        if (h = 0, E < k) {
                          d = E, k -= d;
                          do
                            g[n++] = w[h++];
                          while (--d);
                          h = n - D, R = g;
                        }
                      }
                    } else if (h += E - d, d < k) {
                      k -= d;
                      do
                        g[n++] = w[h++];
                      while (--d);
                      h = n - D, R = g;
                    }
                    for (; k > 2; )
                      g[n++] = R[h++], g[n++] = R[h++], g[n++] = R[h++], k -= 3;
                    k && (g[n++] = R[h++], k > 1 && (g[n++] = R[h++]));
                  } else {
                    h = n - D;
                    do
                      g[n++] = g[h++], g[n++] = g[h++], g[n++] = g[h++], k -= 3;
                    while (k > 2);
                    k && (g[n++] = g[h++], k > 1 && (g[n++] = g[h++]));
                  }
                } else if ((d & 64) === 0) {
                  _ = b[(_ & 65535) + (l & (1 << d) - 1)];
                  continue i;
                } else {
                  i.msg = "invalid distance code", m.mode = G;
                  break e;
                }
                break;
              }
          } else if ((d & 64) === 0) {
            _ = S[(_ & 65535) + (l & (1 << d) - 1)];
            continue t;
          } else if (d & 32) {
            m.mode = zt;
            break e;
          } else {
            i.msg = "invalid literal/length code", m.mode = G;
            break e;
          }
          break;
        }
    } while (a < r && n < f);
  k = p >> 3, a -= k, p -= k << 3, l &= (1 << p) - 1, i.next_in = a, i.next_out = n, i.avail_in = a < r ? 5 + (r - a) : 5 - (a - r), i.avail_out = n < f ? 257 + (f - n) : 257 - (n - f), m.hold = l, m.bits = p;
};
const $ = 15, de = 852, he = 592, ue = 0, J = 1, we = 2, Ot = new Uint16Array([
  /* Length codes 257..285 base */
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
]), Lt = new Uint8Array([
  /* Length codes 257..285 extra */
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
  72,
  78
]), It = new Uint16Array([
  /* Distance codes 0..29 base */
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
]), Nt = new Uint8Array([
  /* Distance codes 0..29 extra */
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
]), Zt = (t, i, e, a, r, n, c, f) => {
  const u = f.bits;
  let o = 0, s = 0, E = 0, w = 0, l = 0, p = 0, S = 0, b = 0, x = 0, y = 0, _, d, k, D, h, R = null, v;
  const g = new Uint16Array($ + 1), m = new Uint16Array($ + 1);
  let I = null, ce, F, P;
  for (o = 0; o <= $; o++)
    g[o] = 0;
  for (s = 0; s < a; s++)
    g[i[e + s]]++;
  for (l = u, w = $; w >= 1 && g[w] === 0; w--)
    ;
  if (l > w && (l = w), w === 0)
    return r[n++] = 1 << 24 | 64 << 16 | 0, r[n++] = 1 << 24 | 64 << 16 | 0, f.bits = 1, 0;
  for (E = 1; E < w && g[E] === 0; E++)
    ;
  for (l < E && (l = E), b = 1, o = 1; o <= $; o++)
    if (b <<= 1, b -= g[o], b < 0)
      return -1;
  if (b > 0 && (t === ue || w !== 1))
    return -1;
  for (m[1] = 0, o = 1; o < $; o++)
    m[o + 1] = m[o] + g[o];
  for (s = 0; s < a; s++)
    i[e + s] !== 0 && (c[m[i[e + s]]++] = s);
  if (t === ue ? (R = I = c, v = 20) : t === J ? (R = Ot, I = Lt, v = 257) : (R = It, I = Nt, v = 0), y = 0, s = 0, o = E, h = n, p = l, S = 0, k = -1, x = 1 << l, D = x - 1, t === J && x > de || t === we && x > he)
    return 1;
  for (; ; ) {
    ce = o - S, c[s] + 1 < v ? (F = 0, P = c[s]) : c[s] >= v ? (F = I[c[s] - v], P = R[c[s] - v]) : (F = 96, P = 0), _ = 1 << o - S, d = 1 << p, E = d;
    do
      d -= _, r[h + (y >> S) + d] = ce << 24 | F << 16 | P | 0;
    while (d !== 0);
    for (_ = 1 << o - 1; y & _; )
      _ >>= 1;
    if (_ !== 0 ? (y &= _ - 1, y += _) : y = 0, s++, --g[o] === 0) {
      if (o === w)
        break;
      o = i[e + c[s]];
    }
    if (o > l && (y & D) !== k) {
      for (S === 0 && (S = l), h += E, p = o - S, b = 1 << p; p + S < w && (b -= g[p + S], !(b <= 0)); )
        p++, b <<= 1;
      if (x += 1 << p, t === J && x > de || t === we && x > he)
        return 1;
      k = y & D, r[k] = l << 24 | p << 16 | h - n | 0;
    }
  }
  return y !== 0 && (r[h + y] = o - S << 24 | 64 << 16 | 0), f.bits = l, 0;
};
var j = Zt;
const $t = 0, Ve = 1, Xe = 2, {
  Z_FINISH: pe,
  Z_BLOCK: Mt,
  Z_TREES: K,
  Z_OK: N,
  Z_STREAM_END: jt,
  Z_NEED_DICT: Bt,
  Z_STREAM_ERROR: U,
  Z_DATA_ERROR: Ye,
  Z_MEM_ERROR: qe,
  Z_BUF_ERROR: Ht,
  Z_DEFLATED: ge
} = Pe, q = 16180, xe = 16181, be = 16182, _e = 16183, me = 16184, ve = 16185, ke = 16186, ye = 16187, Ee = 16188, Re = 16189, Y = 16190, O = 16191, Q = 16192, Ae = 16193, ee = 16194, Se = 16195, De = 16196, Te = 16197, Ue = 16198, V = 16199, X = 16200, ze = 16201, Ce = 16202, Oe = 16203, Le = 16204, Ie = 16205, te = 16206, Ne = 16207, Ze = 16208, A = 16209, We = 16210, Je = 16211, Ft = 852, Pt = 592, Gt = 15, Kt = Gt, $e = (t) => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((t & 65280) << 8) + ((t & 255) << 24);
function Vt() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const Z = (t) => {
  if (!t)
    return 1;
  const i = t.state;
  return !i || i.strm !== t || i.mode < q || i.mode > Je ? 1 : 0;
}, Qe = (t) => {
  if (Z(t))
    return U;
  const i = t.state;
  return t.total_in = t.total_out = i.total = 0, t.msg = "", i.wrap && (t.adler = i.wrap & 1), i.mode = q, i.last = 0, i.havedict = 0, i.flags = -1, i.dmax = 32768, i.head = null, i.hold = 0, i.bits = 0, i.lencode = i.lendyn = new Int32Array(Ft), i.distcode = i.distdyn = new Int32Array(Pt), i.sane = 1, i.back = -1, N;
}, et = (t) => {
  if (Z(t))
    return U;
  const i = t.state;
  return i.wsize = 0, i.whave = 0, i.wnext = 0, Qe(t);
}, tt = (t, i) => {
  let e;
  if (Z(t))
    return U;
  const a = t.state;
  return i < 0 ? (e = 0, i = -i) : (e = (i >> 4) + 5, i < 48 && (i &= 15)), i && (i < 8 || i > 15) ? U : (a.window !== null && a.wbits !== i && (a.window = null), a.wrap = e, a.wbits = i, et(t));
}, it = (t, i) => {
  if (!t)
    return U;
  const e = new Vt();
  t.state = e, e.strm = t, e.window = null, e.mode = q;
  const a = tt(t, i);
  return a !== N && (t.state = null), a;
}, Xt = (t) => it(t, Kt);
let Me = !0, ie, ne;
const Yt = (t) => {
  if (Me) {
    ie = new Int32Array(512), ne = new Int32Array(32);
    let i = 0;
    for (; i < 144; )
      t.lens[i++] = 8;
    for (; i < 256; )
      t.lens[i++] = 9;
    for (; i < 280; )
      t.lens[i++] = 7;
    for (; i < 288; )
      t.lens[i++] = 8;
    for (j(Ve, t.lens, 0, 288, ie, 0, t.work, { bits: 9 }), i = 0; i < 32; )
      t.lens[i++] = 5;
    j(Xe, t.lens, 0, 32, ne, 0, t.work, { bits: 5 }), Me = !1;
  }
  t.lencode = ie, t.lenbits = 9, t.distcode = ne, t.distbits = 5;
}, nt = (t, i, e, a) => {
  let r;
  const n = t.state;
  return n.window === null && (n.wsize = 1 << n.wbits, n.wnext = 0, n.whave = 0, n.window = new Uint8Array(n.wsize)), a >= n.wsize ? (n.window.set(i.subarray(e - n.wsize, e), 0), n.wnext = 0, n.whave = n.wsize) : (r = n.wsize - n.wnext, r > a && (r = a), n.window.set(i.subarray(e - a, e - a + r), n.wnext), a -= r, a ? (n.window.set(i.subarray(e - a, e), 0), n.wnext = a, n.whave = n.wsize) : (n.wnext += r, n.wnext === n.wsize && (n.wnext = 0), n.whave < n.wsize && (n.whave += r))), 0;
}, qt = (t, i) => {
  let e, a, r, n, c, f, u, o, s, E, w, l, p, S, b = 0, x, y, _, d, k, D, h, R;
  const v = new Uint8Array(4);
  let g, m;
  const I = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (Z(t) || !t.output || !t.input && t.avail_in !== 0)
    return U;
  e = t.state, e.mode === O && (e.mode = Q), c = t.next_out, r = t.output, u = t.avail_out, n = t.next_in, a = t.input, f = t.avail_in, o = e.hold, s = e.bits, E = f, w = u, R = N;
  e:
    for (; ; )
      switch (e.mode) {
        case q:
          if (e.wrap === 0) {
            e.mode = Q;
            break;
          }
          for (; s < 16; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          if (e.wrap & 2 && o === 35615) {
            e.wbits === 0 && (e.wbits = 15), e.check = 0, v[0] = o & 255, v[1] = o >>> 8 & 255, e.check = z(e.check, v, 2, 0), o = 0, s = 0, e.mode = xe;
            break;
          }
          if (e.head && (e.head.done = !1), !(e.wrap & 1) || /* check if zlib header allowed */
          (((o & 255) << 8) + (o >> 8)) % 31) {
            t.msg = "incorrect header check", e.mode = A;
            break;
          }
          if ((o & 15) !== ge) {
            t.msg = "unknown compression method", e.mode = A;
            break;
          }
          if (o >>>= 4, s -= 4, h = (o & 15) + 8, e.wbits === 0 && (e.wbits = h), h > 15 || h > e.wbits) {
            t.msg = "invalid window size", e.mode = A;
            break;
          }
          e.dmax = 1 << e.wbits, e.flags = 0, t.adler = e.check = 1, e.mode = o & 512 ? Re : O, o = 0, s = 0;
          break;
        case xe:
          for (; s < 16; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          if (e.flags = o, (e.flags & 255) !== ge) {
            t.msg = "unknown compression method", e.mode = A;
            break;
          }
          if (e.flags & 57344) {
            t.msg = "unknown header flags set", e.mode = A;
            break;
          }
          e.head && (e.head.text = o >> 8 & 1), e.flags & 512 && e.wrap & 4 && (v[0] = o & 255, v[1] = o >>> 8 & 255, e.check = z(e.check, v, 2, 0)), o = 0, s = 0, e.mode = be;
        /* falls through */
        case be:
          for (; s < 32; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          e.head && (e.head.time = o), e.flags & 512 && e.wrap & 4 && (v[0] = o & 255, v[1] = o >>> 8 & 255, v[2] = o >>> 16 & 255, v[3] = o >>> 24 & 255, e.check = z(e.check, v, 4, 0)), o = 0, s = 0, e.mode = _e;
        /* falls through */
        case _e:
          for (; s < 16; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          e.head && (e.head.xflags = o & 255, e.head.os = o >> 8), e.flags & 512 && e.wrap & 4 && (v[0] = o & 255, v[1] = o >>> 8 & 255, e.check = z(e.check, v, 2, 0)), o = 0, s = 0, e.mode = me;
        /* falls through */
        case me:
          if (e.flags & 1024) {
            for (; s < 16; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            e.length = o, e.head && (e.head.extra_len = o), e.flags & 512 && e.wrap & 4 && (v[0] = o & 255, v[1] = o >>> 8 & 255, e.check = z(e.check, v, 2, 0)), o = 0, s = 0;
          } else e.head && (e.head.extra = null);
          e.mode = ve;
        /* falls through */
        case ve:
          if (e.flags & 1024 && (l = e.length, l > f && (l = f), l && (e.head && (h = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Uint8Array(e.head.extra_len)), e.head.extra.set(
            a.subarray(
              n,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              n + l
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            h
          )), e.flags & 512 && e.wrap & 4 && (e.check = z(e.check, a, l, n)), f -= l, n += l, e.length -= l), e.length))
            break e;
          e.length = 0, e.mode = ke;
        /* falls through */
        case ke:
          if (e.flags & 2048) {
            if (f === 0)
              break e;
            l = 0;
            do
              h = a[n + l++], e.head && h && e.length < 65536 && (e.head.name += String.fromCharCode(h));
            while (h && l < f);
            if (e.flags & 512 && e.wrap & 4 && (e.check = z(e.check, a, l, n)), f -= l, n += l, h)
              break e;
          } else e.head && (e.head.name = null);
          e.length = 0, e.mode = ye;
        /* falls through */
        case ye:
          if (e.flags & 4096) {
            if (f === 0)
              break e;
            l = 0;
            do
              h = a[n + l++], e.head && h && e.length < 65536 && (e.head.comment += String.fromCharCode(h));
            while (h && l < f);
            if (e.flags & 512 && e.wrap & 4 && (e.check = z(e.check, a, l, n)), f -= l, n += l, h)
              break e;
          } else e.head && (e.head.comment = null);
          e.mode = Ee;
        /* falls through */
        case Ee:
          if (e.flags & 512) {
            for (; s < 16; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            if (e.wrap & 4 && o !== (e.check & 65535)) {
              t.msg = "header crc mismatch", e.mode = A;
              break;
            }
            o = 0, s = 0;
          }
          e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), t.adler = e.check = 0, e.mode = O;
          break;
        case Re:
          for (; s < 32; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          t.adler = e.check = $e(o), o = 0, s = 0, e.mode = Y;
        /* falls through */
        case Y:
          if (e.havedict === 0)
            return t.next_out = c, t.avail_out = u, t.next_in = n, t.avail_in = f, e.hold = o, e.bits = s, Bt;
          t.adler = e.check = 1, e.mode = O;
        /* falls through */
        case O:
          if (i === Mt || i === K)
            break e;
        /* falls through */
        case Q:
          if (e.last) {
            o >>>= s & 7, s -= s & 7, e.mode = te;
            break;
          }
          for (; s < 3; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          switch (e.last = o & 1, o >>>= 1, s -= 1, o & 3) {
            case 0:
              e.mode = Ae;
              break;
            case 1:
              if (Yt(e), e.mode = V, i === K) {
                o >>>= 2, s -= 2;
                break e;
              }
              break;
            case 2:
              e.mode = De;
              break;
            case 3:
              t.msg = "invalid block type", e.mode = A;
          }
          o >>>= 2, s -= 2;
          break;
        case Ae:
          for (o >>>= s & 7, s -= s & 7; s < 32; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          if ((o & 65535) !== (o >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths", e.mode = A;
            break;
          }
          if (e.length = o & 65535, o = 0, s = 0, e.mode = ee, i === K)
            break e;
        /* falls through */
        case ee:
          e.mode = Se;
        /* falls through */
        case Se:
          if (l = e.length, l) {
            if (l > f && (l = f), l > u && (l = u), l === 0)
              break e;
            r.set(a.subarray(n, n + l), c), f -= l, n += l, u -= l, c += l, e.length -= l;
            break;
          }
          e.mode = O;
          break;
        case De:
          for (; s < 14; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          if (e.nlen = (o & 31) + 257, o >>>= 5, s -= 5, e.ndist = (o & 31) + 1, o >>>= 5, s -= 5, e.ncode = (o & 15) + 4, o >>>= 4, s -= 4, e.nlen > 286 || e.ndist > 30) {
            t.msg = "too many length or distance symbols", e.mode = A;
            break;
          }
          e.have = 0, e.mode = Te;
        /* falls through */
        case Te:
          for (; e.have < e.ncode; ) {
            for (; s < 3; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            e.lens[I[e.have++]] = o & 7, o >>>= 3, s -= 3;
          }
          for (; e.have < 19; )
            e.lens[I[e.have++]] = 0;
          if (e.lencode = e.lendyn, e.lenbits = 7, g = { bits: e.lenbits }, R = j($t, e.lens, 0, 19, e.lencode, 0, e.work, g), e.lenbits = g.bits, R) {
            t.msg = "invalid code lengths set", e.mode = A;
            break;
          }
          e.have = 0, e.mode = Ue;
        /* falls through */
        case Ue:
          for (; e.have < e.nlen + e.ndist; ) {
            for (; b = e.lencode[o & (1 << e.lenbits) - 1], x = b >>> 24, y = b >>> 16 & 255, _ = b & 65535, !(x <= s); ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            if (_ < 16)
              o >>>= x, s -= x, e.lens[e.have++] = _;
            else {
              if (_ === 16) {
                for (m = x + 2; s < m; ) {
                  if (f === 0)
                    break e;
                  f--, o += a[n++] << s, s += 8;
                }
                if (o >>>= x, s -= x, e.have === 0) {
                  t.msg = "invalid bit length repeat", e.mode = A;
                  break;
                }
                h = e.lens[e.have - 1], l = 3 + (o & 3), o >>>= 2, s -= 2;
              } else if (_ === 17) {
                for (m = x + 3; s < m; ) {
                  if (f === 0)
                    break e;
                  f--, o += a[n++] << s, s += 8;
                }
                o >>>= x, s -= x, h = 0, l = 3 + (o & 7), o >>>= 3, s -= 3;
              } else {
                for (m = x + 7; s < m; ) {
                  if (f === 0)
                    break e;
                  f--, o += a[n++] << s, s += 8;
                }
                o >>>= x, s -= x, h = 0, l = 11 + (o & 127), o >>>= 7, s -= 7;
              }
              if (e.have + l > e.nlen + e.ndist) {
                t.msg = "invalid bit length repeat", e.mode = A;
                break;
              }
              for (; l--; )
                e.lens[e.have++] = h;
            }
          }
          if (e.mode === A)
            break;
          if (e.lens[256] === 0) {
            t.msg = "invalid code -- missing end-of-block", e.mode = A;
            break;
          }
          if (e.lenbits = 9, g = { bits: e.lenbits }, R = j(Ve, e.lens, 0, e.nlen, e.lencode, 0, e.work, g), e.lenbits = g.bits, R) {
            t.msg = "invalid literal/lengths set", e.mode = A;
            break;
          }
          if (e.distbits = 6, e.distcode = e.distdyn, g = { bits: e.distbits }, R = j(Xe, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, g), e.distbits = g.bits, R) {
            t.msg = "invalid distances set", e.mode = A;
            break;
          }
          if (e.mode = V, i === K)
            break e;
        /* falls through */
        case V:
          e.mode = X;
        /* falls through */
        case X:
          if (f >= 6 && u >= 258) {
            t.next_out = c, t.avail_out = u, t.next_in = n, t.avail_in = f, e.hold = o, e.bits = s, Ct(t, w), c = t.next_out, r = t.output, u = t.avail_out, n = t.next_in, a = t.input, f = t.avail_in, o = e.hold, s = e.bits, e.mode === O && (e.back = -1);
            break;
          }
          for (e.back = 0; b = e.lencode[o & (1 << e.lenbits) - 1], x = b >>> 24, y = b >>> 16 & 255, _ = b & 65535, !(x <= s); ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          if (y && (y & 240) === 0) {
            for (d = x, k = y, D = _; b = e.lencode[D + ((o & (1 << d + k) - 1) >> d)], x = b >>> 24, y = b >>> 16 & 255, _ = b & 65535, !(d + x <= s); ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            o >>>= d, s -= d, e.back += d;
          }
          if (o >>>= x, s -= x, e.back += x, e.length = _, y === 0) {
            e.mode = Ie;
            break;
          }
          if (y & 32) {
            e.back = -1, e.mode = O;
            break;
          }
          if (y & 64) {
            t.msg = "invalid literal/length code", e.mode = A;
            break;
          }
          e.extra = y & 15, e.mode = ze;
        /* falls through */
        case ze:
          if (e.extra) {
            for (m = e.extra; s < m; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            e.length += o & (1 << e.extra) - 1, o >>>= e.extra, s -= e.extra, e.back += e.extra;
          }
          e.was = e.length, e.mode = Ce;
        /* falls through */
        case Ce:
          for (; b = e.distcode[o & (1 << e.distbits) - 1], x = b >>> 24, y = b >>> 16 & 255, _ = b & 65535, !(x <= s); ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << s, s += 8;
          }
          if ((y & 240) === 0) {
            for (d = x, k = y, D = _; b = e.distcode[D + ((o & (1 << d + k) - 1) >> d)], x = b >>> 24, y = b >>> 16 & 255, _ = b & 65535, !(d + x <= s); ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            o >>>= d, s -= d, e.back += d;
          }
          if (o >>>= x, s -= x, e.back += x, y & 64) {
            t.msg = "invalid distance code", e.mode = A;
            break;
          }
          e.offset = _, e.extra = y & 15, e.mode = Oe;
        /* falls through */
        case Oe:
          if (e.extra) {
            for (m = e.extra; s < m; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            e.offset += o & (1 << e.extra) - 1, o >>>= e.extra, s -= e.extra, e.back += e.extra;
          }
          if (e.offset > e.dmax) {
            t.msg = "invalid distance too far back", e.mode = A;
            break;
          }
          e.mode = Le;
        /* falls through */
        case Le:
          if (u === 0)
            break e;
          if (l = w - u, e.offset > l) {
            if (l = e.offset - l, l > e.whave && e.sane) {
              t.msg = "invalid distance too far back", e.mode = A;
              break;
            }
            l > e.wnext ? (l -= e.wnext, p = e.wsize - l) : p = e.wnext - l, l > e.length && (l = e.length), S = e.window;
          } else
            S = r, p = c - e.offset, l = e.length;
          l > u && (l = u), u -= l, e.length -= l;
          do
            r[c++] = S[p++];
          while (--l);
          e.length === 0 && (e.mode = X);
          break;
        case Ie:
          if (u === 0)
            break e;
          r[c++] = e.length, u--, e.mode = X;
          break;
        case te:
          if (e.wrap) {
            for (; s < 32; ) {
              if (f === 0)
                break e;
              f--, o |= a[n++] << s, s += 8;
            }
            if (w -= u, t.total_out += w, e.total += w, e.wrap & 4 && w && (t.adler = e.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            e.flags ? z(e.check, r, w, c - w) : re(e.check, r, w, c - w)), w = u, e.wrap & 4 && (e.flags ? o : $e(o)) !== e.check) {
              t.msg = "incorrect data check", e.mode = A;
              break;
            }
            o = 0, s = 0;
          }
          e.mode = Ne;
        /* falls through */
        case Ne:
          if (e.wrap && e.flags) {
            for (; s < 32; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << s, s += 8;
            }
            if (e.wrap & 4 && o !== (e.total & 4294967295)) {
              t.msg = "incorrect length check", e.mode = A;
              break;
            }
            o = 0, s = 0;
          }
          e.mode = Ze;
        /* falls through */
        case Ze:
          R = jt;
          break e;
        case A:
          R = Ye;
          break e;
        case We:
          return qe;
        case Je:
        /* falls through */
        default:
          return U;
      }
  return t.next_out = c, t.avail_out = u, t.next_in = n, t.avail_in = f, e.hold = o, e.bits = s, (e.wsize || w !== t.avail_out && e.mode < A && (e.mode < te || i !== pe)) && nt(t, t.output, t.next_out, w - t.avail_out), E -= t.avail_in, w -= t.avail_out, t.total_in += E, t.total_out += w, e.total += w, e.wrap & 4 && w && (t.adler = e.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  e.flags ? z(e.check, r, w, t.next_out - w) : re(e.check, r, w, t.next_out - w)), t.data_type = e.bits + (e.last ? 64 : 0) + (e.mode === O ? 128 : 0) + (e.mode === V || e.mode === ee ? 256 : 0), (E === 0 && w === 0 || i === pe) && R === N && (R = Ht), R;
}, Wt = (t) => {
  if (Z(t))
    return U;
  let i = t.state;
  return i.window && (i.window = null), t.state = null, N;
}, Jt = (t, i) => {
  if (Z(t))
    return U;
  const e = t.state;
  return (e.wrap & 2) === 0 ? U : (e.head = i, i.done = !1, N);
}, Qt = (t, i) => {
  const e = i.length;
  let a, r, n;
  return Z(t) || (a = t.state, a.wrap !== 0 && a.mode !== Y) ? U : a.mode === Y && (r = 1, r = re(r, i, e, 0), r !== a.check) ? Ye : (n = nt(t, i, e, e), n ? (a.mode = We, qe) : (a.havedict = 1, N));
};
var ei = et, ti = tt, ii = Qe, ni = Xt, ai = it, oi = qt, si = Wt, ri = Jt, fi = Qt, li = "pako inflate (from Nodeca project)", L = {
  inflateReset: ei,
  inflateReset2: ti,
  inflateResetKeep: ii,
  inflateInit: ni,
  inflateInit2: ai,
  inflate: oi,
  inflateEnd: si,
  inflateGetHeader: ri,
  inflateSetDictionary: fi,
  inflateInfo: li
};
function ci() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var di = ci;
const at = Object.prototype.toString, {
  Z_NO_FLUSH: hi,
  Z_FINISH: ui,
  Z_OK: H,
  Z_STREAM_END: ae,
  Z_NEED_DICT: oe,
  Z_STREAM_ERROR: wi,
  Z_DATA_ERROR: je,
  Z_MEM_ERROR: pi
} = Pe;
function W(t) {
  this.options = Ge.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, t || {});
  const i = this.options;
  i.raw && i.windowBits >= 0 && i.windowBits < 16 && (i.windowBits = -i.windowBits, i.windowBits === 0 && (i.windowBits = -15)), i.windowBits >= 0 && i.windowBits < 16 && !(t && t.windowBits) && (i.windowBits += 32), i.windowBits > 15 && i.windowBits < 48 && (i.windowBits & 15) === 0 && (i.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Ut(), this.strm.avail_out = 0;
  let e = L.inflateInit2(
    this.strm,
    i.windowBits
  );
  if (e !== H)
    throw new Error(fe[e]);
  if (this.header = new di(), L.inflateGetHeader(this.strm, this.header), i.dictionary && (typeof i.dictionary == "string" ? i.dictionary = le.string2buf(i.dictionary) : at.call(i.dictionary) === "[object ArrayBuffer]" && (i.dictionary = new Uint8Array(i.dictionary)), i.raw && (e = L.inflateSetDictionary(this.strm, i.dictionary), e !== H)))
    throw new Error(fe[e]);
}
W.prototype.push = function(t, i) {
  const e = this.strm, a = this.options.chunkSize, r = this.options.dictionary;
  let n, c, f;
  if (this.ended) return !1;
  for (i === ~~i ? c = i : c = i === !0 ? ui : hi, at.call(t) === "[object ArrayBuffer]" ? e.input = new Uint8Array(t) : e.input = t, e.next_in = 0, e.avail_in = e.input.length; ; ) {
    for (e.avail_out === 0 && (e.output = new Uint8Array(a), e.next_out = 0, e.avail_out = a), n = L.inflate(e, c), n === oe && r && (n = L.inflateSetDictionary(e, r), n === H ? n = L.inflate(e, c) : n === je && (n = oe)); e.avail_in > 0 && n === ae && e.state.wrap > 0 && t[e.next_in] !== 0; )
      L.inflateReset(e), n = L.inflate(e, c);
    switch (n) {
      case wi:
      case je:
      case oe:
      case pi:
        return this.onEnd(n), this.ended = !0, !1;
    }
    if (f = e.avail_out, e.next_out && (e.avail_out === 0 || n === ae))
      if (this.options.to === "string") {
        let u = le.utf8border(e.output, e.next_out), o = e.next_out - u, s = le.buf2string(e.output, u);
        e.next_out = o, e.avail_out = a - o, o && e.output.set(e.output.subarray(u, u + o), 0), this.onData(s);
      } else
        this.onData(e.output.length === e.next_out ? e.output : e.output.subarray(0, e.next_out));
    if (!(n === H && f === 0)) {
      if (n === ae)
        return n = L.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, !0;
      if (e.avail_in === 0) break;
    }
  }
  return !0;
};
W.prototype.onData = function(t) {
  this.chunks.push(t);
};
W.prototype.onEnd = function(t) {
  t === H && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Ge.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
};
function gi(t, i) {
  const e = new W(i);
  if (e.push(t), e.err) throw e.msg || fe[e.err];
  return e.result;
}
function xi(t, i) {
  return i = i || {}, i.raw = !0, gi(t, i);
}
var bi = xi, _i = {
  inflateRaw: bi
};
const { inflateRaw: mi } = _i;
var vi = mi;
function ki({ polynomial: t, numTables: i }) {
  const e = new Uint32Array(256 * i);
  for (let a = 0; a < 256; a++) {
    let r = a;
    r = (r & 1) * t ^ r >>> 1, r = (r & 1) * t ^ r >>> 1, r = (r & 1) * t ^ r >>> 1, r = (r & 1) * t ^ r >>> 1, r = (r & 1) * t ^ r >>> 1, r = (r & 1) * t ^ r >>> 1, r = (r & 1) * t ^ r >>> 1, r = (r & 1) * t ^ r >>> 1, e[a] = r;
  }
  for (let a = 256; a < e.length; a++) {
    const r = e[a - 256];
    e[a] = e[r & 255] ^ r >>> 8;
  }
  return e;
}
const C = ki({ polynomial: 3988292384, numTables: 8 });
function yi() {
  return -1;
}
function Ei(t, i) {
  const e = i.byteLength, a = new DataView(i.buffer, i.byteOffset, e);
  let r = t, n = 0;
  const c = -a.byteOffset & 3;
  for (; n < c && n < e; n++)
    r = C[(r ^ a.getUint8(n)) & 255] ^ r >>> 8;
  if (n === e)
    return r;
  n = c;
  let f = e - n;
  for (; f >= 8; n += 8, f -= 8) {
    r ^= a.getUint32(n, !0);
    const u = a.getUint32(n + 4, !0);
    r = C[0 * 256 + (u >>> 24 & 255)] ^ C[1 * 256 + (u >>> 16 & 255)] ^ C[2 * 256 + (u >>> 8 & 255)] ^ C[3 * 256 + (u >>> 0 & 255)] ^ C[4 * 256 + (r >>> 24 & 255)] ^ C[5 * 256 + (r >>> 16 & 255)] ^ C[6 * 256 + (r >>> 8 & 255)] ^ C[7 * 256 + (r >>> 0 & 255)];
  }
  for (let u = n; u < e; u++)
    r = C[(r ^ a.getUint8(u)) & 255] ^ r >>> 8;
  return r;
}
function Ri(t) {
  return (t ^ -1) >>> 0;
}
function Ai(t) {
  return Ri(Ei(yi(), t));
}
const Be = {
  ".3g2": "video/3gpp2",
  ".3gp": "video/3gpp",
  ".7z": "application/x-7z-compressed",
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".arc": "application/x-freearc",
  ".avi": "video/x-msvideo",
  ".azw": "application/vnd.amazon.ebook",
  ".bin": "application/octet-stream",
  ".bmp": "image/bmp",
  ".bz": "application/x-bzip",
  ".bz2": "application/x-bzip2",
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
  ".jpeg": ".jpg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".jsonld": "application/ld+json",
  ".mid": ".midi",
  ".mjs": "text/javascript",
  ".mp3": "audio/mpeg",
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
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xhtml": "application/xhtml+xml",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xml": "XML",
  ".xul": "application/vnd.mozilla.xul+xml",
  ".zip": "application/zip"
};
class Si {
  constructor(i) {
    T(this, "url");
    T(this, "zipSize", 0);
    T(this, "files", /* @__PURE__ */ new Map());
    // private readonly fmt_eocd = "<IHHHHIIH";
    // private readonly fmt_eocd64 = "<IQHHIIQQQQ";
    // private readonly fmt_cdirentry = "<IHHHHIIIIHHHHHII";
    // private readonly fmt_localhdr = "<IHHHIIIIHH";
    T(this, "magic_eocd64", new Uint8Array([80, 75, 6, 6]));
    T(this, "magic_eocd", new Uint8Array([80, 75, 5, 6]));
    this.url = i;
  }
  async getRange(i, e) {
    return await (await fetch(this.url, {
      headers: { Range: `bytes=${i}-${i + e - 1}` }
    })).arrayBuffer();
  }
  async infoiter() {
    const i = await fetch(this.url, { method: "HEAD" }), e = i.headers.get("Accept-Ranges") || "";
    if (e !== "bytes") {
      const s = new URL(this.url).hostname;
      console.warn(
        `${s} Accept-Ranges header ('${e}') is not 'bytes'--trying anyway`
      );
    }
    this.zipSize = parseInt(i.headers.get("Content-Length") || "0");
    let a = await this.getRange(Math.max(this.zipSize - 65536, 0), 65536), r = new Uint8Array(a), n = -1, c = 0, f = this.findLastIndex(r, this.magic_eocd64);
    if (f >= 0) {
      const s = new DataView(a);
      c = Number(s.getBigUint64(f + 40, !0)), n = Number(s.getBigUint64(f + 48, !0));
    } else if (f = this.findLastIndex(r, this.magic_eocd), f >= 0) {
      const s = new DataView(a);
      c = s.getUint32(f + 12, !0), n = s.getUint32(f + 16, !0);
    }
    if (n < 0 || n >= this.zipSize)
      throw new Error("Cannot find central directory");
    a = await this.getRange(n, c), r = new Uint8Array(a);
    const u = [];
    let o = 0;
    for (; o < c; ) {
      const s = new DataView(a, o), E = s.getUint16(10, !0), w = s.getUint32(12, !0), l = s.getUint32(20, !0), p = s.getUint32(24, !0), S = s.getUint16(28, !0), b = s.getUint16(30, !0), x = s.getUint16(32, !0), y = s.getUint32(42, !0), _ = s.getUint32(16, !0);
      o += 46;
      const d = new TextDecoder().decode(
        r.slice(o, o + S)
      );
      o += S;
      const k = r.slice(o, o + b);
      o += b, o += x;
      const D = new Di(
        d,
        w,
        y,
        E,
        l,
        p,
        _
      );
      D.parseExtra(k), u.push(D);
    }
    return u;
  }
  findLastIndex(i, e) {
    for (let a = i.length - e.length; a >= 0; a--)
      if (e.every((r, n) => r === i[a + n]))
        return a;
    return -1;
  }
  async getFileList() {
    const i = await this.infoiter();
    return this.files = new Map(i.map((e) => [e.filename, e])), Array.from(this.files.keys());
  }
  async getFileAsObjectURL(i, e = "") {
    const a = this.files.get(i);
    if (!a)
      throw new Error(`File not found: ${i}`);
    const r = "." + (i.split(".").pop() || "").toLowerCase();
    r in Be && e == "" && (e = Be[r]), console.log("File info:", a);
    const n = 30, c = await this.getRange(
      a.headerOffset,
      n + a.filename.length + 2
    ), f = new DataView(c), u = f.getUint32(0, !0);
    if (u !== 67324752)
      throw new Error("Invalid local file header signature");
    const o = f.getUint16(26, !0), s = f.getUint16(28, !0);
    console.log("Local header info:", {
      signature: u.toString(16),
      filenameLength: o,
      extraFieldLength: s
    });
    const E = a.headerOffset + n + o + s;
    console.log("File data offset:", E);
    const w = await this.getRange(
      E,
      a.compressSize
    );
    console.log("Compressed data size:", w.byteLength);
    let l;
    if (a.compressType === 0)
      l = new Uint8Array(w);
    else if (a.compressType === 8)
      try {
        l = vi(new Uint8Array(w));
      } catch (b) {
        throw console.error("Decompression error:", b), console.error(
          "Compressed data (first 50 bytes):",
          new Uint8Array(w).slice(0, 50)
        ), new Error("Failed to decompress file data");
      }
    else
      throw new Error(
        `Unsupported compression method: ${a.compressType}`
      );
    console.log("Decompressed data size:", l.length), l.length !== a.fileSize && console.warn(
      `Decompressed size (${l.length}) doesn't match expected size (${a.fileSize})`
    );
    const p = this.calculateCRC32(l);
    p !== a.crc32 && console.warn(
      `Calculated CRC32 (${p}) doesn't match expected CRC32 (${a.crc32})`
    );
    const S = new Blob([l], {
      type: e || "application/octet-stream"
    });
    return URL.createObjectURL(S);
  }
  calculateCRC32(i) {
    return Ai(i);
  }
}
class Di {
  constructor(i, e, a, r, n, c, f) {
    T(this, "filename");
    T(this, "dateTime");
    T(this, "headerOffset");
    T(this, "compressType");
    T(this, "compressSize");
    T(this, "fileSize");
    T(this, "crc32");
    this.filename = i, this.dateTime = e, this.headerOffset = a, this.compressType = r, this.compressSize = n, this.fileSize = c, this.crc32 = f;
  }
  parseExtra(i) {
    let e = 0;
    for (; e < i.length; ) {
      const a = i[e + 1] << 8 | i[e], r = i[e + 3] << 8 | i[e + 2];
      e += 4, a === 1 ? (r >= 8 && this.fileSize === 4294967295 && (this.fileSize = Number(
        new DataView(i.buffer, e, 8).getBigUint64(0, !0)
      ), e += 8), r >= 16 && this.compressSize === 4294967295 && (this.compressSize = Number(
        new DataView(i.buffer, e, 8).getBigUint64(0, !0)
      ), e += 8), r >= 24 && this.headerOffset === 4294967295 && (this.headerOffset = Number(
        new DataView(i.buffer, e, 8).getBigUint64(0, !0)
      ), e += 8)) : e += r;
    }
  }
}
const se = document.querySelector("#output");
document.querySelector("#load-zip-listing").addEventListener("click", () => {
  const t = document.querySelector("#link-to-zip").value;
  t ? se.textContent = "Loading ZIP listing..." : se.textContent = "Please enter a valid ZIP URL";
  const i = new Si(t);
  i.getFileList().then((e) => {
    se.innerHTML = "<ul>" + e.map(
      (a) => `<li>${a} <button class="download-button" type="button" data-file="${a}">Download</button></li>`
    ).join(`
`) + "</ul>", document.querySelectorAll(".download-button").forEach((a) => {
      a.addEventListener("click", async (r) => {
        const c = r.target.getAttribute("data-file"), f = await i.getFileAsObjectURL(c), u = document.createElement("a");
        u.href = f, u.download = c.split("/").pop() || c, u.click(), setTimeout(() => {
          u.remove(), URL.revokeObjectURL(f);
        }, 5e3);
      });
    });
  });
});
