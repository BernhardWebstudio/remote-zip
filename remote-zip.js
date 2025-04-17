var at = Object.defineProperty;
var ot = (t, i, e) => i in t ? at(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var T = (t, i, e) => ot(t, typeof i != "symbol" ? i + "" : i, e);
(function() {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload"))
    return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]'))
    a(s);
  new MutationObserver((s) => {
    for (const n of s)
      if (n.type === "childList")
        for (const c of n.addedNodes)
          c.tagName === "LINK" && c.rel === "modulepreload" && a(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(s) {
    const n = {};
    return s.integrity && (n.integrity = s.integrity), s.referrerPolicy && (n.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? n.credentials = "include" : s.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
  }
  function a(s) {
    if (s.ep)
      return;
    s.ep = !0;
    const n = e(s);
    fetch(s.href, n);
  }
})();
function M(t) {
  let i = t.length;
  for (; --i >= 0; )
    t[i] = 0;
}
const rt = 3, st = 258, He = 29, ft = 256, lt = ft + 1 + He, Fe = 30, ct = 512, dt = new Array((lt + 2) * 2);
M(dt);
const ht = new Array(Fe * 2);
M(ht);
const ut = new Array(ct);
M(ut);
const wt = new Array(st - rt + 1);
M(wt);
const bt = new Array(He);
M(bt);
const gt = new Array(Fe);
M(gt);
const xt = (t, i, e, a) => {
  let s = t & 65535 | 0, n = t >>> 16 & 65535 | 0, c = 0;
  for (; e !== 0; ) {
    c = e > 2e3 ? 2e3 : e, e -= c;
    do
      s = s + i[a++] | 0, n = n + s | 0;
    while (--c);
    s %= 65521, n %= 65521;
  }
  return s | n << 16 | 0;
};
var se = xt;
const _t = () => {
  let t, i = [];
  for (var e = 0; e < 256; e++) {
    t = e;
    for (var a = 0; a < 8; a++)
      t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    i[e] = t;
  }
  return i;
}, pt = new Uint32Array(_t()), kt = (t, i, e, a) => {
  const s = pt, n = a + e;
  t ^= -1;
  for (let c = a; c < n; c++)
    t = t >>> 8 ^ s[(t ^ i[c]) & 255];
  return t ^ -1;
};
var C = kt, fe = {
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
const mt = (t, i) => Object.prototype.hasOwnProperty.call(t, i);
var vt = function(t) {
  const i = Array.prototype.slice.call(arguments, 1);
  for (; i.length; ) {
    const e = i.shift();
    if (e) {
      if (typeof e != "object")
        throw new TypeError(e + "must be non-object");
      for (const a in e)
        mt(e, a) && (t[a] = e[a]);
    }
  }
  return t;
}, yt = (t) => {
  let i = 0;
  for (let a = 0, s = t.length; a < s; a++)
    i += t[a].length;
  const e = new Uint8Array(i);
  for (let a = 0, s = 0, n = t.length; a < n; a++) {
    let c = t[a];
    e.set(c, s), s += c.length;
  }
  return e;
}, je = {
  assign: vt,
  flattenChunks: yt
};
let Ge = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Ge = !1;
}
const H = new Uint8Array(256);
for (let t = 0; t < 256; t++)
  H[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
H[254] = H[254] = 1;
var Et = (t) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(t);
  let i, e, a, s, n, c = t.length, f = 0;
  for (s = 0; s < c; s++)
    e = t.charCodeAt(s), (e & 64512) === 55296 && s + 1 < c && (a = t.charCodeAt(s + 1), (a & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (a - 56320), s++)), f += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
  for (i = new Uint8Array(f), n = 0, s = 0; n < f; s++)
    e = t.charCodeAt(s), (e & 64512) === 55296 && s + 1 < c && (a = t.charCodeAt(s + 1), (a & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (a - 56320), s++)), e < 128 ? i[n++] = e : e < 2048 ? (i[n++] = 192 | e >>> 6, i[n++] = 128 | e & 63) : e < 65536 ? (i[n++] = 224 | e >>> 12, i[n++] = 128 | e >>> 6 & 63, i[n++] = 128 | e & 63) : (i[n++] = 240 | e >>> 18, i[n++] = 128 | e >>> 12 & 63, i[n++] = 128 | e >>> 6 & 63, i[n++] = 128 | e & 63);
  return i;
};
const Rt = (t, i) => {
  if (i < 65534 && t.subarray && Ge)
    return String.fromCharCode.apply(null, t.length === i ? t : t.subarray(0, i));
  let e = "";
  for (let a = 0; a < i; a++)
    e += String.fromCharCode(t[a]);
  return e;
};
var At = (t, i) => {
  const e = i || t.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(t.subarray(0, i));
  let a, s;
  const n = new Array(e * 2);
  for (s = 0, a = 0; a < e; ) {
    let c = t[a++];
    if (c < 128) {
      n[s++] = c;
      continue;
    }
    let f = H[c];
    if (f > 4) {
      n[s++] = 65533, a += f - 1;
      continue;
    }
    for (c &= f === 2 ? 31 : f === 3 ? 15 : 7; f > 1 && a < e; )
      c = c << 6 | t[a++] & 63, f--;
    if (f > 1) {
      n[s++] = 65533;
      continue;
    }
    c < 65536 ? n[s++] = c : (c -= 65536, n[s++] = 55296 | c >> 10 & 1023, n[s++] = 56320 | c & 1023);
  }
  return Rt(n, s);
}, St = (t, i) => {
  i = i || t.length, i > t.length && (i = t.length);
  let e = i - 1;
  for (; e >= 0 && (t[e] & 192) === 128; )
    e--;
  return e < 0 || e === 0 ? i : e + H[t[e]] > i ? e : i;
}, le = {
  string2buf: Et,
  buf2string: At,
  utf8border: St
};
function Dt() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Tt = Dt;
const G = 16209, Ut = 16191;
var Ct = function(i, e) {
  let a, s, n, c, f, w, o, r, E, h, l, b, S, p, x, y, _, d, v, D, u, R, m, g;
  const k = i.state;
  a = i.next_in, m = i.input, s = a + (i.avail_in - 5), n = i.next_out, g = i.output, c = n - (e - i.avail_out), f = n + (i.avail_out - 257), w = k.dmax, o = k.wsize, r = k.whave, E = k.wnext, h = k.window, l = k.hold, b = k.bits, S = k.lencode, p = k.distcode, x = (1 << k.lenbits) - 1, y = (1 << k.distbits) - 1;
  e:
    do {
      b < 15 && (l += m[a++] << b, b += 8, l += m[a++] << b, b += 8), _ = S[l & x];
      t:
        for (; ; ) {
          if (d = _ >>> 24, l >>>= d, b -= d, d = _ >>> 16 & 255, d === 0)
            g[n++] = _ & 65535;
          else if (d & 16) {
            v = _ & 65535, d &= 15, d && (b < d && (l += m[a++] << b, b += 8), v += l & (1 << d) - 1, l >>>= d, b -= d), b < 15 && (l += m[a++] << b, b += 8, l += m[a++] << b, b += 8), _ = p[l & y];
            i:
              for (; ; ) {
                if (d = _ >>> 24, l >>>= d, b -= d, d = _ >>> 16 & 255, d & 16) {
                  if (D = _ & 65535, d &= 15, b < d && (l += m[a++] << b, b += 8, b < d && (l += m[a++] << b, b += 8)), D += l & (1 << d) - 1, D > w) {
                    i.msg = "invalid distance too far back", k.mode = G;
                    break e;
                  }
                  if (l >>>= d, b -= d, d = n - c, D > d) {
                    if (d = D - d, d > r && k.sane) {
                      i.msg = "invalid distance too far back", k.mode = G;
                      break e;
                    }
                    if (u = 0, R = h, E === 0) {
                      if (u += o - d, d < v) {
                        v -= d;
                        do
                          g[n++] = h[u++];
                        while (--d);
                        u = n - D, R = g;
                      }
                    } else if (E < d) {
                      if (u += o + E - d, d -= E, d < v) {
                        v -= d;
                        do
                          g[n++] = h[u++];
                        while (--d);
                        if (u = 0, E < v) {
                          d = E, v -= d;
                          do
                            g[n++] = h[u++];
                          while (--d);
                          u = n - D, R = g;
                        }
                      }
                    } else if (u += E - d, d < v) {
                      v -= d;
                      do
                        g[n++] = h[u++];
                      while (--d);
                      u = n - D, R = g;
                    }
                    for (; v > 2; )
                      g[n++] = R[u++], g[n++] = R[u++], g[n++] = R[u++], v -= 3;
                    v && (g[n++] = R[u++], v > 1 && (g[n++] = R[u++]));
                  } else {
                    u = n - D;
                    do
                      g[n++] = g[u++], g[n++] = g[u++], g[n++] = g[u++], v -= 3;
                    while (v > 2);
                    v && (g[n++] = g[u++], v > 1 && (g[n++] = g[u++]));
                  }
                } else if ((d & 64) === 0) {
                  _ = p[(_ & 65535) + (l & (1 << d) - 1)];
                  continue i;
                } else {
                  i.msg = "invalid distance code", k.mode = G;
                  break e;
                }
                break;
              }
          } else if ((d & 64) === 0) {
            _ = S[(_ & 65535) + (l & (1 << d) - 1)];
            continue t;
          } else if (d & 32) {
            k.mode = Ut;
            break e;
          } else {
            i.msg = "invalid literal/length code", k.mode = G;
            break e;
          }
          break;
        }
    } while (a < s && n < f);
  v = b >> 3, a -= v, b -= v << 3, l &= (1 << b) - 1, i.next_in = a, i.next_out = n, i.avail_in = a < s ? 5 + (s - a) : 5 - (a - s), i.avail_out = n < f ? 257 + (f - n) : 257 - (n - f), k.hold = l, k.bits = b;
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
]), zt = new Uint8Array([
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
]), Nt = (t, i, e, a, s, n, c, f) => {
  const w = f.bits;
  let o = 0, r = 0, E = 0, h = 0, l = 0, b = 0, S = 0, p = 0, x = 0, y = 0, _, d, v, D, u, R = null, m;
  const g = new Uint16Array($ + 1), k = new Uint16Array($ + 1);
  let z = null, ce, P, j;
  for (o = 0; o <= $; o++)
    g[o] = 0;
  for (r = 0; r < a; r++)
    g[i[e + r]]++;
  for (l = w, h = $; h >= 1 && g[h] === 0; h--)
    ;
  if (l > h && (l = h), h === 0)
    return s[n++] = 1 << 24 | 64 << 16 | 0, s[n++] = 1 << 24 | 64 << 16 | 0, f.bits = 1, 0;
  for (E = 1; E < h && g[E] === 0; E++)
    ;
  for (l < E && (l = E), p = 1, o = 1; o <= $; o++)
    if (p <<= 1, p -= g[o], p < 0)
      return -1;
  if (p > 0 && (t === ue || h !== 1))
    return -1;
  for (k[1] = 0, o = 1; o < $; o++)
    k[o + 1] = k[o] + g[o];
  for (r = 0; r < a; r++)
    i[e + r] !== 0 && (c[k[i[e + r]]++] = r);
  if (t === ue ? (R = z = c, m = 20) : t === J ? (R = Ot, z = Lt, m = 257) : (R = It, z = zt, m = 0), y = 0, r = 0, o = E, u = n, b = l, S = 0, v = -1, x = 1 << l, D = x - 1, t === J && x > de || t === we && x > he)
    return 1;
  for (; ; ) {
    ce = o - S, c[r] + 1 < m ? (P = 0, j = c[r]) : c[r] >= m ? (P = z[c[r] - m], j = R[c[r] - m]) : (P = 96, j = 0), _ = 1 << o - S, d = 1 << b, E = d;
    do
      d -= _, s[u + (y >> S) + d] = ce << 24 | P << 16 | j | 0;
    while (d !== 0);
    for (_ = 1 << o - 1; y & _; )
      _ >>= 1;
    if (_ !== 0 ? (y &= _ - 1, y += _) : y = 0, r++, --g[o] === 0) {
      if (o === h)
        break;
      o = i[e + c[r]];
    }
    if (o > l && (y & D) !== v) {
      for (S === 0 && (S = l), u += E, b = o - S, p = 1 << b; b + S < h && (p -= g[b + S], !(p <= 0)); )
        b++, p <<= 1;
      if (x += 1 << b, t === J && x > de || t === we && x > he)
        return 1;
      v = y & D, s[v] = l << 24 | b << 16 | u - n | 0;
    }
  }
  return y !== 0 && (s[u + y] = o - S << 24 | 64 << 16 | 0), f.bits = l, 0;
};
var B = Nt;
const Zt = 0, Ke = 1, Ve = 2, {
  Z_FINISH: be,
  Z_BLOCK: $t,
  Z_TREES: K,
  Z_OK: N,
  Z_STREAM_END: Mt,
  Z_NEED_DICT: Bt,
  Z_STREAM_ERROR: U,
  Z_DATA_ERROR: Xe,
  Z_MEM_ERROR: Ye,
  Z_BUF_ERROR: Ht,
  Z_DEFLATED: ge
} = Pe, q = 16180, xe = 16181, _e = 16182, pe = 16183, ke = 16184, me = 16185, ve = 16186, ye = 16187, Ee = 16188, Re = 16189, Y = 16190, L = 16191, Q = 16192, Ae = 16193, ee = 16194, Se = 16195, De = 16196, Te = 16197, Ue = 16198, V = 16199, X = 16200, Ce = 16201, Oe = 16202, Le = 16203, Ie = 16204, ze = 16205, te = 16206, Ne = 16207, Ze = 16208, A = 16209, qe = 16210, We = 16211, Ft = 852, Pt = 592, jt = 15, Gt = jt, $e = (t) => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((t & 65280) << 8) + ((t & 255) << 24);
function Kt() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const Z = (t) => {
  if (!t)
    return 1;
  const i = t.state;
  return !i || i.strm !== t || i.mode < q || i.mode > We ? 1 : 0;
}, Je = (t) => {
  if (Z(t))
    return U;
  const i = t.state;
  return t.total_in = t.total_out = i.total = 0, t.msg = "", i.wrap && (t.adler = i.wrap & 1), i.mode = q, i.last = 0, i.havedict = 0, i.flags = -1, i.dmax = 32768, i.head = null, i.hold = 0, i.bits = 0, i.lencode = i.lendyn = new Int32Array(Ft), i.distcode = i.distdyn = new Int32Array(Pt), i.sane = 1, i.back = -1, N;
}, Qe = (t) => {
  if (Z(t))
    return U;
  const i = t.state;
  return i.wsize = 0, i.whave = 0, i.wnext = 0, Je(t);
}, et = (t, i) => {
  let e;
  if (Z(t))
    return U;
  const a = t.state;
  return i < 0 ? (e = 0, i = -i) : (e = (i >> 4) + 5, i < 48 && (i &= 15)), i && (i < 8 || i > 15) ? U : (a.window !== null && a.wbits !== i && (a.window = null), a.wrap = e, a.wbits = i, Qe(t));
}, tt = (t, i) => {
  if (!t)
    return U;
  const e = new Kt();
  t.state = e, e.strm = t, e.window = null, e.mode = q;
  const a = et(t, i);
  return a !== N && (t.state = null), a;
}, Vt = (t) => tt(t, Gt);
let Me = !0, ie, ne;
const Xt = (t) => {
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
    for (B(Ke, t.lens, 0, 288, ie, 0, t.work, { bits: 9 }), i = 0; i < 32; )
      t.lens[i++] = 5;
    B(Ve, t.lens, 0, 32, ne, 0, t.work, { bits: 5 }), Me = !1;
  }
  t.lencode = ie, t.lenbits = 9, t.distcode = ne, t.distbits = 5;
}, it = (t, i, e, a) => {
  let s;
  const n = t.state;
  return n.window === null && (n.wsize = 1 << n.wbits, n.wnext = 0, n.whave = 0, n.window = new Uint8Array(n.wsize)), a >= n.wsize ? (n.window.set(i.subarray(e - n.wsize, e), 0), n.wnext = 0, n.whave = n.wsize) : (s = n.wsize - n.wnext, s > a && (s = a), n.window.set(i.subarray(e - a, e - a + s), n.wnext), a -= s, a ? (n.window.set(i.subarray(e - a, e), 0), n.wnext = a, n.whave = n.wsize) : (n.wnext += s, n.wnext === n.wsize && (n.wnext = 0), n.whave < n.wsize && (n.whave += s))), 0;
}, Yt = (t, i) => {
  let e, a, s, n, c, f, w, o, r, E, h, l, b, S, p = 0, x, y, _, d, v, D, u, R;
  const m = new Uint8Array(4);
  let g, k;
  const z = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (Z(t) || !t.output || !t.input && t.avail_in !== 0)
    return U;
  e = t.state, e.mode === L && (e.mode = Q), c = t.next_out, s = t.output, w = t.avail_out, n = t.next_in, a = t.input, f = t.avail_in, o = e.hold, r = e.bits, E = f, h = w, R = N;
  e:
    for (; ; )
      switch (e.mode) {
        case q:
          if (e.wrap === 0) {
            e.mode = Q;
            break;
          }
          for (; r < 16; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          if (e.wrap & 2 && o === 35615) {
            e.wbits === 0 && (e.wbits = 15), e.check = 0, m[0] = o & 255, m[1] = o >>> 8 & 255, e.check = C(e.check, m, 2, 0), o = 0, r = 0, e.mode = xe;
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
          if (o >>>= 4, r -= 4, u = (o & 15) + 8, e.wbits === 0 && (e.wbits = u), u > 15 || u > e.wbits) {
            t.msg = "invalid window size", e.mode = A;
            break;
          }
          e.dmax = 1 << e.wbits, e.flags = 0, t.adler = e.check = 1, e.mode = o & 512 ? Re : L, o = 0, r = 0;
          break;
        case xe:
          for (; r < 16; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          if (e.flags = o, (e.flags & 255) !== ge) {
            t.msg = "unknown compression method", e.mode = A;
            break;
          }
          if (e.flags & 57344) {
            t.msg = "unknown header flags set", e.mode = A;
            break;
          }
          e.head && (e.head.text = o >> 8 & 1), e.flags & 512 && e.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, e.check = C(e.check, m, 2, 0)), o = 0, r = 0, e.mode = _e;
        /* falls through */
        case _e:
          for (; r < 32; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          e.head && (e.head.time = o), e.flags & 512 && e.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, m[2] = o >>> 16 & 255, m[3] = o >>> 24 & 255, e.check = C(e.check, m, 4, 0)), o = 0, r = 0, e.mode = pe;
        /* falls through */
        case pe:
          for (; r < 16; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          e.head && (e.head.xflags = o & 255, e.head.os = o >> 8), e.flags & 512 && e.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, e.check = C(e.check, m, 2, 0)), o = 0, r = 0, e.mode = ke;
        /* falls through */
        case ke:
          if (e.flags & 1024) {
            for (; r < 16; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            e.length = o, e.head && (e.head.extra_len = o), e.flags & 512 && e.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, e.check = C(e.check, m, 2, 0)), o = 0, r = 0;
          } else e.head && (e.head.extra = null);
          e.mode = me;
        /* falls through */
        case me:
          if (e.flags & 1024 && (l = e.length, l > f && (l = f), l && (e.head && (u = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Uint8Array(e.head.extra_len)), e.head.extra.set(
            a.subarray(
              n,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              n + l
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            u
          )), e.flags & 512 && e.wrap & 4 && (e.check = C(e.check, a, l, n)), f -= l, n += l, e.length -= l), e.length))
            break e;
          e.length = 0, e.mode = ve;
        /* falls through */
        case ve:
          if (e.flags & 2048) {
            if (f === 0)
              break e;
            l = 0;
            do
              u = a[n + l++], e.head && u && e.length < 65536 && (e.head.name += String.fromCharCode(u));
            while (u && l < f);
            if (e.flags & 512 && e.wrap & 4 && (e.check = C(e.check, a, l, n)), f -= l, n += l, u)
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
              u = a[n + l++], e.head && u && e.length < 65536 && (e.head.comment += String.fromCharCode(u));
            while (u && l < f);
            if (e.flags & 512 && e.wrap & 4 && (e.check = C(e.check, a, l, n)), f -= l, n += l, u)
              break e;
          } else e.head && (e.head.comment = null);
          e.mode = Ee;
        /* falls through */
        case Ee:
          if (e.flags & 512) {
            for (; r < 16; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            if (e.wrap & 4 && o !== (e.check & 65535)) {
              t.msg = "header crc mismatch", e.mode = A;
              break;
            }
            o = 0, r = 0;
          }
          e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), t.adler = e.check = 0, e.mode = L;
          break;
        case Re:
          for (; r < 32; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          t.adler = e.check = $e(o), o = 0, r = 0, e.mode = Y;
        /* falls through */
        case Y:
          if (e.havedict === 0)
            return t.next_out = c, t.avail_out = w, t.next_in = n, t.avail_in = f, e.hold = o, e.bits = r, Bt;
          t.adler = e.check = 1, e.mode = L;
        /* falls through */
        case L:
          if (i === $t || i === K)
            break e;
        /* falls through */
        case Q:
          if (e.last) {
            o >>>= r & 7, r -= r & 7, e.mode = te;
            break;
          }
          for (; r < 3; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          switch (e.last = o & 1, o >>>= 1, r -= 1, o & 3) {
            case 0:
              e.mode = Ae;
              break;
            case 1:
              if (Xt(e), e.mode = V, i === K) {
                o >>>= 2, r -= 2;
                break e;
              }
              break;
            case 2:
              e.mode = De;
              break;
            case 3:
              t.msg = "invalid block type", e.mode = A;
          }
          o >>>= 2, r -= 2;
          break;
        case Ae:
          for (o >>>= r & 7, r -= r & 7; r < 32; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          if ((o & 65535) !== (o >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths", e.mode = A;
            break;
          }
          if (e.length = o & 65535, o = 0, r = 0, e.mode = ee, i === K)
            break e;
        /* falls through */
        case ee:
          e.mode = Se;
        /* falls through */
        case Se:
          if (l = e.length, l) {
            if (l > f && (l = f), l > w && (l = w), l === 0)
              break e;
            s.set(a.subarray(n, n + l), c), f -= l, n += l, w -= l, c += l, e.length -= l;
            break;
          }
          e.mode = L;
          break;
        case De:
          for (; r < 14; ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          if (e.nlen = (o & 31) + 257, o >>>= 5, r -= 5, e.ndist = (o & 31) + 1, o >>>= 5, r -= 5, e.ncode = (o & 15) + 4, o >>>= 4, r -= 4, e.nlen > 286 || e.ndist > 30) {
            t.msg = "too many length or distance symbols", e.mode = A;
            break;
          }
          e.have = 0, e.mode = Te;
        /* falls through */
        case Te:
          for (; e.have < e.ncode; ) {
            for (; r < 3; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            e.lens[z[e.have++]] = o & 7, o >>>= 3, r -= 3;
          }
          for (; e.have < 19; )
            e.lens[z[e.have++]] = 0;
          if (e.lencode = e.lendyn, e.lenbits = 7, g = { bits: e.lenbits }, R = B(Zt, e.lens, 0, 19, e.lencode, 0, e.work, g), e.lenbits = g.bits, R) {
            t.msg = "invalid code lengths set", e.mode = A;
            break;
          }
          e.have = 0, e.mode = Ue;
        /* falls through */
        case Ue:
          for (; e.have < e.nlen + e.ndist; ) {
            for (; p = e.lencode[o & (1 << e.lenbits) - 1], x = p >>> 24, y = p >>> 16 & 255, _ = p & 65535, !(x <= r); ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            if (_ < 16)
              o >>>= x, r -= x, e.lens[e.have++] = _;
            else {
              if (_ === 16) {
                for (k = x + 2; r < k; ) {
                  if (f === 0)
                    break e;
                  f--, o += a[n++] << r, r += 8;
                }
                if (o >>>= x, r -= x, e.have === 0) {
                  t.msg = "invalid bit length repeat", e.mode = A;
                  break;
                }
                u = e.lens[e.have - 1], l = 3 + (o & 3), o >>>= 2, r -= 2;
              } else if (_ === 17) {
                for (k = x + 3; r < k; ) {
                  if (f === 0)
                    break e;
                  f--, o += a[n++] << r, r += 8;
                }
                o >>>= x, r -= x, u = 0, l = 3 + (o & 7), o >>>= 3, r -= 3;
              } else {
                for (k = x + 7; r < k; ) {
                  if (f === 0)
                    break e;
                  f--, o += a[n++] << r, r += 8;
                }
                o >>>= x, r -= x, u = 0, l = 11 + (o & 127), o >>>= 7, r -= 7;
              }
              if (e.have + l > e.nlen + e.ndist) {
                t.msg = "invalid bit length repeat", e.mode = A;
                break;
              }
              for (; l--; )
                e.lens[e.have++] = u;
            }
          }
          if (e.mode === A)
            break;
          if (e.lens[256] === 0) {
            t.msg = "invalid code -- missing end-of-block", e.mode = A;
            break;
          }
          if (e.lenbits = 9, g = { bits: e.lenbits }, R = B(Ke, e.lens, 0, e.nlen, e.lencode, 0, e.work, g), e.lenbits = g.bits, R) {
            t.msg = "invalid literal/lengths set", e.mode = A;
            break;
          }
          if (e.distbits = 6, e.distcode = e.distdyn, g = { bits: e.distbits }, R = B(Ve, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, g), e.distbits = g.bits, R) {
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
          if (f >= 6 && w >= 258) {
            t.next_out = c, t.avail_out = w, t.next_in = n, t.avail_in = f, e.hold = o, e.bits = r, Ct(t, h), c = t.next_out, s = t.output, w = t.avail_out, n = t.next_in, a = t.input, f = t.avail_in, o = e.hold, r = e.bits, e.mode === L && (e.back = -1);
            break;
          }
          for (e.back = 0; p = e.lencode[o & (1 << e.lenbits) - 1], x = p >>> 24, y = p >>> 16 & 255, _ = p & 65535, !(x <= r); ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          if (y && (y & 240) === 0) {
            for (d = x, v = y, D = _; p = e.lencode[D + ((o & (1 << d + v) - 1) >> d)], x = p >>> 24, y = p >>> 16 & 255, _ = p & 65535, !(d + x <= r); ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            o >>>= d, r -= d, e.back += d;
          }
          if (o >>>= x, r -= x, e.back += x, e.length = _, y === 0) {
            e.mode = ze;
            break;
          }
          if (y & 32) {
            e.back = -1, e.mode = L;
            break;
          }
          if (y & 64) {
            t.msg = "invalid literal/length code", e.mode = A;
            break;
          }
          e.extra = y & 15, e.mode = Ce;
        /* falls through */
        case Ce:
          if (e.extra) {
            for (k = e.extra; r < k; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            e.length += o & (1 << e.extra) - 1, o >>>= e.extra, r -= e.extra, e.back += e.extra;
          }
          e.was = e.length, e.mode = Oe;
        /* falls through */
        case Oe:
          for (; p = e.distcode[o & (1 << e.distbits) - 1], x = p >>> 24, y = p >>> 16 & 255, _ = p & 65535, !(x <= r); ) {
            if (f === 0)
              break e;
            f--, o += a[n++] << r, r += 8;
          }
          if ((y & 240) === 0) {
            for (d = x, v = y, D = _; p = e.distcode[D + ((o & (1 << d + v) - 1) >> d)], x = p >>> 24, y = p >>> 16 & 255, _ = p & 65535, !(d + x <= r); ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            o >>>= d, r -= d, e.back += d;
          }
          if (o >>>= x, r -= x, e.back += x, y & 64) {
            t.msg = "invalid distance code", e.mode = A;
            break;
          }
          e.offset = _, e.extra = y & 15, e.mode = Le;
        /* falls through */
        case Le:
          if (e.extra) {
            for (k = e.extra; r < k; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            e.offset += o & (1 << e.extra) - 1, o >>>= e.extra, r -= e.extra, e.back += e.extra;
          }
          if (e.offset > e.dmax) {
            t.msg = "invalid distance too far back", e.mode = A;
            break;
          }
          e.mode = Ie;
        /* falls through */
        case Ie:
          if (w === 0)
            break e;
          if (l = h - w, e.offset > l) {
            if (l = e.offset - l, l > e.whave && e.sane) {
              t.msg = "invalid distance too far back", e.mode = A;
              break;
            }
            l > e.wnext ? (l -= e.wnext, b = e.wsize - l) : b = e.wnext - l, l > e.length && (l = e.length), S = e.window;
          } else
            S = s, b = c - e.offset, l = e.length;
          l > w && (l = w), w -= l, e.length -= l;
          do
            s[c++] = S[b++];
          while (--l);
          e.length === 0 && (e.mode = X);
          break;
        case ze:
          if (w === 0)
            break e;
          s[c++] = e.length, w--, e.mode = X;
          break;
        case te:
          if (e.wrap) {
            for (; r < 32; ) {
              if (f === 0)
                break e;
              f--, o |= a[n++] << r, r += 8;
            }
            if (h -= w, t.total_out += h, e.total += h, e.wrap & 4 && h && (t.adler = e.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            e.flags ? C(e.check, s, h, c - h) : se(e.check, s, h, c - h)), h = w, e.wrap & 4 && (e.flags ? o : $e(o)) !== e.check) {
              t.msg = "incorrect data check", e.mode = A;
              break;
            }
            o = 0, r = 0;
          }
          e.mode = Ne;
        /* falls through */
        case Ne:
          if (e.wrap && e.flags) {
            for (; r < 32; ) {
              if (f === 0)
                break e;
              f--, o += a[n++] << r, r += 8;
            }
            if (e.wrap & 4 && o !== (e.total & 4294967295)) {
              t.msg = "incorrect length check", e.mode = A;
              break;
            }
            o = 0, r = 0;
          }
          e.mode = Ze;
        /* falls through */
        case Ze:
          R = Mt;
          break e;
        case A:
          R = Xe;
          break e;
        case qe:
          return Ye;
        case We:
        /* falls through */
        default:
          return U;
      }
  return t.next_out = c, t.avail_out = w, t.next_in = n, t.avail_in = f, e.hold = o, e.bits = r, (e.wsize || h !== t.avail_out && e.mode < A && (e.mode < te || i !== be)) && it(t, t.output, t.next_out, h - t.avail_out), E -= t.avail_in, h -= t.avail_out, t.total_in += E, t.total_out += h, e.total += h, e.wrap & 4 && h && (t.adler = e.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  e.flags ? C(e.check, s, h, t.next_out - h) : se(e.check, s, h, t.next_out - h)), t.data_type = e.bits + (e.last ? 64 : 0) + (e.mode === L ? 128 : 0) + (e.mode === V || e.mode === ee ? 256 : 0), (E === 0 && h === 0 || i === be) && R === N && (R = Ht), R;
}, qt = (t) => {
  if (Z(t))
    return U;
  let i = t.state;
  return i.window && (i.window = null), t.state = null, N;
}, Wt = (t, i) => {
  if (Z(t))
    return U;
  const e = t.state;
  return (e.wrap & 2) === 0 ? U : (e.head = i, i.done = !1, N);
}, Jt = (t, i) => {
  const e = i.length;
  let a, s, n;
  return Z(t) || (a = t.state, a.wrap !== 0 && a.mode !== Y) ? U : a.mode === Y && (s = 1, s = se(s, i, e, 0), s !== a.check) ? Xe : (n = it(t, i, e, e), n ? (a.mode = qe, Ye) : (a.havedict = 1, N));
};
var Qt = Qe, ei = et, ti = Je, ii = Vt, ni = tt, ai = Yt, oi = qt, ri = Wt, si = Jt, fi = "pako inflate (from Nodeca project)", I = {
  inflateReset: Qt,
  inflateReset2: ei,
  inflateResetKeep: ti,
  inflateInit: ii,
  inflateInit2: ni,
  inflate: ai,
  inflateEnd: oi,
  inflateGetHeader: ri,
  inflateSetDictionary: si,
  inflateInfo: fi
};
function li() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var ci = li;
const nt = Object.prototype.toString, {
  Z_NO_FLUSH: di,
  Z_FINISH: hi,
  Z_OK: F,
  Z_STREAM_END: ae,
  Z_NEED_DICT: oe,
  Z_STREAM_ERROR: ui,
  Z_DATA_ERROR: Be,
  Z_MEM_ERROR: wi
} = Pe;
function W(t) {
  this.options = je.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, t || {});
  const i = this.options;
  i.raw && i.windowBits >= 0 && i.windowBits < 16 && (i.windowBits = -i.windowBits, i.windowBits === 0 && (i.windowBits = -15)), i.windowBits >= 0 && i.windowBits < 16 && !(t && t.windowBits) && (i.windowBits += 32), i.windowBits > 15 && i.windowBits < 48 && (i.windowBits & 15) === 0 && (i.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Tt(), this.strm.avail_out = 0;
  let e = I.inflateInit2(
    this.strm,
    i.windowBits
  );
  if (e !== F)
    throw new Error(fe[e]);
  if (this.header = new ci(), I.inflateGetHeader(this.strm, this.header), i.dictionary && (typeof i.dictionary == "string" ? i.dictionary = le.string2buf(i.dictionary) : nt.call(i.dictionary) === "[object ArrayBuffer]" && (i.dictionary = new Uint8Array(i.dictionary)), i.raw && (e = I.inflateSetDictionary(this.strm, i.dictionary), e !== F)))
    throw new Error(fe[e]);
}
W.prototype.push = function(t, i) {
  const e = this.strm, a = this.options.chunkSize, s = this.options.dictionary;
  let n, c, f;
  if (this.ended) return !1;
  for (i === ~~i ? c = i : c = i === !0 ? hi : di, nt.call(t) === "[object ArrayBuffer]" ? e.input = new Uint8Array(t) : e.input = t, e.next_in = 0, e.avail_in = e.input.length; ; ) {
    for (e.avail_out === 0 && (e.output = new Uint8Array(a), e.next_out = 0, e.avail_out = a), n = I.inflate(e, c), n === oe && s && (n = I.inflateSetDictionary(e, s), n === F ? n = I.inflate(e, c) : n === Be && (n = oe)); e.avail_in > 0 && n === ae && e.state.wrap > 0 && t[e.next_in] !== 0; )
      I.inflateReset(e), n = I.inflate(e, c);
    switch (n) {
      case ui:
      case Be:
      case oe:
      case wi:
        return this.onEnd(n), this.ended = !0, !1;
    }
    if (f = e.avail_out, e.next_out && (e.avail_out === 0 || n === ae))
      if (this.options.to === "string") {
        let w = le.utf8border(e.output, e.next_out), o = e.next_out - w, r = le.buf2string(e.output, w);
        e.next_out = o, e.avail_out = a - o, o && e.output.set(e.output.subarray(w, w + o), 0), this.onData(r);
      } else
        this.onData(e.output.length === e.next_out ? e.output : e.output.subarray(0, e.next_out));
    if (!(n === F && f === 0)) {
      if (n === ae)
        return n = I.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, !0;
      if (e.avail_in === 0) break;
    }
  }
  return !0;
};
W.prototype.onData = function(t) {
  this.chunks.push(t);
};
W.prototype.onEnd = function(t) {
  t === F && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = je.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
};
function bi(t, i) {
  const e = new W(i);
  if (e.push(t), e.err) throw e.msg || fe[e.err];
  return e.result;
}
function gi(t, i) {
  return i = i || {}, i.raw = !0, bi(t, i);
}
var xi = gi, _i = {
  inflateRaw: xi
};
const { inflateRaw: pi } = _i;
var ki = pi;
function mi({ polynomial: t, numTables: i }) {
  const e = new Uint32Array(256 * i);
  for (let a = 0; a < 256; a++) {
    let s = a;
    s = (s & 1) * t ^ s >>> 1, s = (s & 1) * t ^ s >>> 1, s = (s & 1) * t ^ s >>> 1, s = (s & 1) * t ^ s >>> 1, s = (s & 1) * t ^ s >>> 1, s = (s & 1) * t ^ s >>> 1, s = (s & 1) * t ^ s >>> 1, s = (s & 1) * t ^ s >>> 1, e[a] = s;
  }
  for (let a = 256; a < e.length; a++) {
    const s = e[a - 256];
    e[a] = e[s & 255] ^ s >>> 8;
  }
  return e;
}
const O = mi({ polynomial: 3988292384, numTables: 8 });
function vi() {
  return -1;
}
function yi(t, i) {
  const e = i.byteLength, a = new DataView(i.buffer, i.byteOffset, e);
  let s = t, n = 0;
  const c = -a.byteOffset & 3;
  for (; n < c && n < e; n++)
    s = O[(s ^ a.getUint8(n)) & 255] ^ s >>> 8;
  if (n === e)
    return s;
  n = c;
  let f = e - n;
  for (; f >= 8; n += 8, f -= 8) {
    s ^= a.getUint32(n, !0);
    const w = a.getUint32(n + 4, !0);
    s = O[0 * 256 + (w >>> 24 & 255)] ^ O[1 * 256 + (w >>> 16 & 255)] ^ O[2 * 256 + (w >>> 8 & 255)] ^ O[3 * 256 + (w >>> 0 & 255)] ^ O[4 * 256 + (s >>> 24 & 255)] ^ O[5 * 256 + (s >>> 16 & 255)] ^ O[6 * 256 + (s >>> 8 & 255)] ^ O[7 * 256 + (s >>> 0 & 255)];
  }
  for (let w = n; w < e; w++)
    s = O[(s ^ a.getUint8(w)) & 255] ^ s >>> 8;
  return s;
}
function Ei(t) {
  return (t ^ -1) >>> 0;
}
function Ri(t) {
  return Ei(yi(vi(), t));
}
class Ai {
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
      const r = new URL(this.url).hostname;
      console.warn(
        `${r} Accept-Ranges header ('${e}') is not 'bytes'--trying anyway`
      );
    }
    this.zipSize = parseInt(i.headers.get("Content-Length") || "0");
    let a = await this.getRange(Math.max(this.zipSize - 65536, 0), 65536), s = new Uint8Array(a), n = -1, c = 0, f = this.findLastIndex(s, this.magic_eocd64);
    if (f >= 0) {
      const r = new DataView(a);
      c = Number(r.getBigUint64(f + 40, !0)), n = Number(r.getBigUint64(f + 48, !0));
    } else if (f = this.findLastIndex(s, this.magic_eocd), f >= 0) {
      const r = new DataView(a);
      c = r.getUint32(f + 12, !0), n = r.getUint32(f + 16, !0);
    }
    if (n < 0 || n >= this.zipSize)
      throw new Error("Cannot find central directory");
    a = await this.getRange(n, c), s = new Uint8Array(a);
    const w = [];
    let o = 0;
    for (; o < c; ) {
      const r = new DataView(a, o), E = r.getUint16(10, !0), h = r.getUint32(12, !0), l = r.getUint32(20, !0), b = r.getUint32(24, !0), S = r.getUint16(28, !0), p = r.getUint16(30, !0), x = r.getUint16(32, !0), y = r.getUint32(42, !0), _ = r.getUint32(16, !0);
      o += 46;
      const d = new TextDecoder().decode(
        s.slice(o, o + S)
      );
      o += S;
      const v = s.slice(o, o + p);
      o += p, o += x;
      const D = new Si(
        d,
        h,
        y,
        E,
        l,
        b,
        _
      );
      D.parseExtra(v), w.push(D);
    }
    return w;
  }
  findLastIndex(i, e) {
    for (let a = i.length - e.length; a >= 0; a--)
      if (e.every((s, n) => s === i[a + n]))
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
    console.log("File info:", a);
    const s = 30, n = await this.getRange(
      a.headerOffset,
      s + a.filename.length + 2
    ), c = new DataView(n), f = c.getUint32(0, !0);
    if (f !== 67324752)
      throw new Error("Invalid local file header signature");
    const w = c.getUint16(26, !0), o = c.getUint16(28, !0);
    console.log("Local header info:", {
      signature: f.toString(16),
      filenameLength: w,
      extraFieldLength: o
    });
    const r = a.headerOffset + s + w + o;
    console.log("File data offset:", r);
    const E = await this.getRange(
      r,
      a.compressSize
    );
    console.log("Compressed data size:", E.byteLength);
    let h;
    if (a.compressType === 0)
      h = new Uint8Array(E);
    else if (a.compressType === 8)
      try {
        h = ki(new Uint8Array(E));
      } catch (S) {
        throw console.error("Decompression error:", S), console.error(
          "Compressed data (first 50 bytes):",
          new Uint8Array(E).slice(0, 50)
        ), new Error("Failed to decompress file data");
      }
    else
      throw new Error(
        `Unsupported compression method: ${a.compressType}`
      );
    console.log("Decompressed data size:", h.length), h.length !== a.fileSize && console.warn(
      `Decompressed size (${h.length}) doesn't match expected size (${a.fileSize})`
    );
    const l = this.calculateCRC32(h);
    l !== a.crc32 && console.warn(
      `Calculated CRC32 (${l}) doesn't match expected CRC32 (${a.crc32})`
    );
    const b = new Blob([h], {
      type: e || "application/octet-stream"
    });
    return URL.createObjectURL(b);
  }
  calculateCRC32(i) {
    return Ri(i);
  }
}
class Si {
  constructor(i, e, a, s, n, c, f) {
    T(this, "filename");
    T(this, "dateTime");
    T(this, "headerOffset");
    T(this, "compressType");
    T(this, "compressSize");
    T(this, "fileSize");
    T(this, "crc32");
    this.filename = i, this.dateTime = e, this.headerOffset = a, this.compressType = s, this.compressSize = n, this.fileSize = c, this.crc32 = f;
  }
  parseExtra(i) {
    let e = 0;
    for (; e < i.length; ) {
      const a = i[e + 1] << 8 | i[e], s = i[e + 3] << 8 | i[e + 2];
      e += 4, a === 1 ? (s >= 8 && this.fileSize === 4294967295 && (this.fileSize = Number(
        new DataView(i.buffer, e, 8).getBigUint64(0, !0)
      ), e += 8), s >= 16 && this.compressSize === 4294967295 && (this.compressSize = Number(
        new DataView(i.buffer, e, 8).getBigUint64(0, !0)
      ), e += 8), s >= 24 && this.headerOffset === 4294967295 && (this.headerOffset = Number(
        new DataView(i.buffer, e, 8).getBigUint64(0, !0)
      ), e += 8)) : e += s;
    }
  }
}
const re = document.querySelector("#output");
document.querySelector("#load-zip-listing").addEventListener("click", () => {
  const t = document.querySelector("#link-to-zip").value;
  t ? re.textContent = "Loading ZIP listing..." : re.textContent = "Please enter a valid ZIP URL";
  const i = new Ai(t);
  i.getFileList().then((e) => {
    re.innerHTML = "<ul>" + e.map(
      (a) => `<li>${a} <button class="download-button" type="button" data-file="${a}">Download</button></li>`
    ).join(`
`) + "</ul>", document.querySelectorAll(".download-button").forEach((a) => {
      a.addEventListener("click", async (s) => {
        const c = s.target.getAttribute("data-file"), f = await i.getFileAsObjectURL(c), w = document.createElement("a");
        w.href = f, w.download = c.split("/").pop() || c, w.click(), setTimeout(() => {
          w.remove(), URL.revokeObjectURL(f);
        }, 5e3);
      });
    });
  });
});
