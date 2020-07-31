var app = (function () {
  "use strict";
  function t() {}
  function n(t) {
    return t();
  }
  function e() {
    return Object.create(null);
  }
  function o(t) {
    t.forEach(n);
  }
  function r(t) {
    return "function" == typeof t;
  }
  function c(t, n) {
    return t != t
      ? n == n
      : t !== n || (t && "object" == typeof t) || "function" == typeof t;
  }
  function i(t, n) {
    t.appendChild(n);
  }
  function s(t, n, e) {
    t.insertBefore(n, e || null);
  }
  function u(t) {
    t.parentNode.removeChild(t);
  }
  function a(t) {
    return document.createElement(t);
  }
  function f(t) {
    return document.createTextNode(t);
  }
  function l() {
    return f(" ");
  }
  function d(t, n, e, o) {
    return t.addEventListener(n, e, o), () => t.removeEventListener(n, e, o);
  }
  let h;
  function p(t) {
    h = t;
  }
  const g = [],
    m = [],
    $ = [],
    b = [],
    x = Promise.resolve();
  let y = !1;
  function w(t) {
    $.push(t);
  }
  let E = !1;
  const v = new Set();
  function _() {
    if (!E) {
      E = !0;
      do {
        for (let t = 0; t < g.length; t += 1) {
          const n = g[t];
          p(n), k(n.$$);
        }
        for (g.length = 0; m.length; ) m.pop()();
        for (let t = 0; t < $.length; t += 1) {
          const n = $[t];
          v.has(n) || (v.add(n), n());
        }
        $.length = 0;
      } while (g.length);
      for (; b.length; ) b.pop()();
      (y = !1), (E = !1), v.clear();
    }
  }
  function k(t) {
    if (null !== t.fragment) {
      t.update(), o(t.before_update);
      const n = t.dirty;
      (t.dirty = [-1]),
        t.fragment && t.fragment.p(t.ctx, n),
        t.after_update.forEach(w);
    }
  }
  const T = new Set();
  function L(t, n) {
    -1 === t.$$.dirty[0] &&
      (g.push(t), y || ((y = !0), x.then(_)), t.$$.dirty.fill(0)),
      (t.$$.dirty[(n / 31) | 0] |= 1 << n % 31);
  }
  function C(c, i, s, a, f, l, d = [-1]) {
    const g = h;
    p(c);
    const m = i.props || {},
      $ = (c.$$ = {
        fragment: null,
        ctx: null,
        props: l,
        update: t,
        not_equal: f,
        bound: e(),
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(g ? g.$$.context : []),
        callbacks: e(),
        dirty: d,
      });
    let b = !1;
    if (
      (($.ctx = s
        ? s(c, m, (t, n, ...e) => {
            const o = e.length ? e[0] : n;
            return (
              $.ctx &&
                f($.ctx[t], ($.ctx[t] = o)) &&
                ($.bound[t] && $.bound[t](o), b && L(c, t)),
              n
            );
          })
        : []),
      $.update(),
      (b = !0),
      o($.before_update),
      ($.fragment = !!a && a($.ctx)),
      i.target)
    ) {
      if (i.hydrate) {
        const t = (function (t) {
          return Array.from(t.childNodes);
        })(i.target);
        $.fragment && $.fragment.l(t), t.forEach(u);
      } else $.fragment && $.fragment.c();
      i.intro && (x = c.$$.fragment) && x.i && (T.delete(x), x.i(y)),
        (function (t, e, c) {
          const {
            fragment: i,
            on_mount: s,
            on_destroy: u,
            after_update: a,
          } = t.$$;
          i && i.m(e, c),
            w(() => {
              const e = s.map(n).filter(r);
              u ? u.push(...e) : o(e), (t.$$.on_mount = []);
            }),
            a.forEach(w);
        })(c, i.target, i.anchor),
        _();
    }
    var x, y;
    p(g);
  }
  let M;
  "function" == typeof HTMLElement &&
    (M = class extends HTMLElement {
      constructor() {
        super(), this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        for (const t in this.$$.slotted) this.appendChild(this.$$.slotted[t]);
      }
      attributeChangedCallback(t, n, e) {
        this[t] = e;
      }
      $destroy() {
        !(function (t, n) {
          const e = t.$$;
          null !== e.fragment &&
            (o(e.on_destroy),
            e.fragment && e.fragment.d(n),
            (e.on_destroy = e.fragment = null),
            (e.ctx = []));
        })(this, 1),
          (this.$destroy = t);
      }
      $on(t, n) {
        const e = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
        return (
          e.push(n),
          () => {
            const t = e.indexOf(n);
            -1 !== t && e.splice(t, 1);
          }
        );
      }
      $set() {}
    });
  const H = [];
  const R = (function (n, e = t) {
    let o;
    const r = [];
    function i(t) {
      if (c(n, t) && ((n = t), o)) {
        const t = !H.length;
        for (let t = 0; t < r.length; t += 1) {
          const e = r[t];
          e[1](), H.push(e, n);
        }
        if (t) {
          for (let t = 0; t < H.length; t += 2) H[t][0](H[t + 1]);
          H.length = 0;
        }
      }
    }
    return {
      set: i,
      update: function (t) {
        i(t(n));
      },
      subscribe: function (c, s = t) {
        const u = [c, s];
        return (
          r.push(u),
          1 === r.length && (o = e(i) || t),
          c(n),
          () => {
            const t = r.indexOf(u);
            -1 !== t && r.splice(t, 1), 0 === r.length && (o(), (o = null));
          }
        );
      },
    };
  })(0);
  function N(n) {
    let e, o, r;
    return {
      c() {
        (e = a("button")), (e.innerHTML = "Enter<br>\n  +"), (this.c = t);
      },
      m(t, c) {
        s(t, e, c), o || ((r = d(e, "click", n[0])), (o = !0));
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && u(e), (o = !1), r();
      },
    };
  }
  function O(t) {
    return [
      function () {
        R.update((t) => t + 1);
      },
    ];
  }
  function S(n) {
    let e, o, r;
    return {
      c() {
        (e = a("button")), (e.innerHTML = "Exit<br>\n  -"), (this.c = t);
      },
      m(t, c) {
        s(t, e, c), o || ((r = d(e, "click", n[0])), (o = !0));
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && u(e), (o = !1), r();
      },
    };
  }
  function j(t) {
    return [
      function () {
        R.update((t) => t - 1);
      },
    ];
  }
  customElements.define(
    "covid-incrementer",
    class extends M {
      constructor(t) {
        super(),
          (this.shadowRoot.innerHTML =
            "<style>button{background:green;color:white;padding:50px;font-family:inherit;font-size:20px}</style>"),
          C(this, { target: this.shadowRoot }, O, N, c, {}),
          t && t.target && s(t.target, this, t.anchor);
      }
    }
  );
  function z(n) {
    let e, o, r;
    return {
      c() {
        (e = a("button")), (e.textContent = "reset"), (this.c = t);
      },
      m(t, c) {
        s(t, e, c), o || ((r = d(e, "click", n[0])), (o = !0));
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && u(e), (o = !1), r();
      },
    };
  }
  function q(t) {
    return [
      function () {
        R.set(0);
      },
    ];
  }
  customElements.define(
    "covid-decrementer",
    class extends M {
      constructor(t) {
        super(),
          (this.shadowRoot.innerHTML =
            "<style>button{background:red;color:white;padding:50px;font-family:inherit;font-size:20px}</style>"),
          C(this, { target: this.shadowRoot }, j, S, c, {}),
          t && t.target && s(t.target, this, t.anchor);
      }
    }
  );
  function A(n) {
    let e, o, r, c, d, h, p, g, m;
    return {
      c() {
        (e = a("h1")),
          (o = f("The count is ")),
          (r = f(n[0])),
          (c = l()),
          (d = a("covid-incrementer")),
          (h = l()),
          (p = a("covid-decrementer")),
          (g = l()),
          (m = a("covid-resetter")),
          (this.c = t);
      },
      m(t, n) {
        s(t, e, n),
          i(e, o),
          i(e, r),
          s(t, c, n),
          s(t, d, n),
          s(t, h, n),
          s(t, p, n),
          s(t, g, n),
          s(t, m, n);
      },
      p(t, [n]) {
        1 & n &&
          (function (t, n) {
            (n = "" + n), t.wholeText !== n && (t.data = n);
          })(r, t[0]);
      },
      i: t,
      o: t,
      d(t) {
        t && u(e),
          t && u(c),
          t && u(d),
          t && u(h),
          t && u(p),
          t && u(g),
          t && u(m);
      },
    };
  }
  function B(t, n, e) {
    let o = 0;
    R.subscribe((t) => {
      e(0, (o = t));
    });
    return [o];
  }
  customElements.define(
    "covid-resetter",
    class extends M {
      constructor(t) {
        super(),
          C(this, { target: this.shadowRoot }, q, z, c, {}),
          t && t.target && s(t.target, this, t.anchor);
      }
    }
  );
  class P extends M {
    constructor(t) {
      super(),
        C(this, { target: this.shadowRoot }, B, A, c, {}),
        t && t.target && s(t.target, this, t.anchor);
    }
  }
  customElements.define("covid-backend", P);
  return new P({ target: document.body, props: {} });
})();
//# sourceMappingURL=bundle.js.map
