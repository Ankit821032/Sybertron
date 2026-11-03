import React, { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, ArrowRight as ArrowRight$1, ArrowUpRight, ArrowUpRight as ArrowUpRight$1, BadgeCheck, Ban, BarChart3, Bot, Boxes, Check, Clock, Cloud, Code2, Cookie, Copy, CornerDownLeft, Cpu, CreditCard, FileSearch, FileText, Flame, FlaskConical, Gamepad2, Gauge, Ghost, Glasses, Home, Layers, LayoutGrid, LifeBuoy, Lightbulb, Link2, Lock, Mail, Megaphone, Menu, MessageCircle, Minus, MonitorSmartphone, Pause, Play, Plug, Plus, Puzzle, Rocket, RotateCcw, Send, Server, Settings2, ShieldAlert, ShieldCheck, ShoppingBag, ShoppingCart, Siren, SlidersHorizontal, Smartphone, Sparkles, Sparkles as Sparkles$1, TrendingDown, TrendingUp, TriangleAlert, Users, Wallet, Workflow, X, Zap } from "lucide-react";
import { SiAndroid, SiAnthropic, SiApple, SiExpress, SiFirebase, SiFlutter, SiGoogleads, SiGoogleanalytics, SiGooglecloud, SiGooglegemini, SiLaravel, SiMeta, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiPostgresql, SiPython, SiReact, SiShopify, SiTailwindcss, SiUnity, SiWix, SiWoocommerce, SiWordpress } from "react-icons/si";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";
// src/cms/runtime.tsx
var CmsContext = createContext({
	path: "/",
	snapshot: { fields: {} }
});
function hash(text) {
	let n = 2166136261;
	for (let i = 0; i < text.length; i++) n = Math.imul(n ^ text.charCodeAt(i), 16777619);
	return (n >>> 0).toString(36);
}
function fieldId(source, kind, original) {
	return `${source}:${kind}:${hash(original)}`;
}
function CmsElement({ cmsTag: tag, cmsSource: source, children, ...props }) {
	const ctx = useContext(CmsContext);
	const lookup = (kind, original) => {
		const id = fieldId(source, kind, original);
		const item = {
			id,
			source,
			kind,
			original
		};
		ctx.collect?.(item);
		const local = ctx.snapshot.fields[id], shared = ctx.snapshot.fields["library:" + kind + ":" + hash(original)];
		return {
			id: shared?.value != null && local?.value == null ? shared.id : id,
			saved: local?.value != null ? local : shared?.value != null ? shared : local
		};
	};
	if (tag === "svg") {
		const { id, saved } = lookup("illustration", "Built-in illustration");
		if (saved?.value) return React.createElement("img", {
			className: props.className,
			style: props.style,
			src: saved.value,
			alt: props["aria-label"] || "Illustration",
			"data-cms-attributes": id
		});
		props["data-cms-attributes"] = id;
	}
	const attributes = props["data-cms-attributes"] ? [props["data-cms-attributes"]] : [];
	for (const key of [
		"src",
		"alt",
		"title",
		"placeholder",
		"href",
		"poster",
		"aria-label"
	]) {
		if (typeof props[key] !== "string") continue;
		const { id, saved } = lookup(key, props[key]);
		attributes.push(id);
		if (saved) props[key] = saved.value ?? props[key];
	}
	if (typeof props.style?.backgroundImage === "string") {
		const { saved } = lookup("backgroundImage", props.style.backgroundImage);
		if (saved?.value != null) props.style = {
			...props.style,
			backgroundImage: `url(${JSON.stringify(saved.value)})`
		};
	}
	const text = (child) => {
		if (Array.isArray(child)) return child.map(text);
		if (typeof child !== "string" || !child.trim() || /^\d{2}:\d{2}$/.test(child)) return child;
		const { id, saved } = lookup("text", child);
		const f = saved?.format ?? {};
		return React.createElement("cms-text", {
			key: id,
			"data-cms-field": id,
			style: {
				fontWeight: f.bold ? 700 : void 0,
				fontStyle: f.italic ? "italic" : void 0,
				textDecoration: [f.underline ? "underline" : "", f.strike ? "line-through" : ""].filter(Boolean).join(" ") || void 0,
				backgroundColor: f.highlight || void 0,
				color: f.color || void 0,
				whiteSpace: "pre-wrap"
			}
		}, saved?.value ?? child);
	};
	const noWrap = [
		"input",
		"textarea",
		"option",
		"source",
		"img"
	].includes(tag);
	return React.createElement(tag, {
		...props,
		"data-cms-attributes": attributes.join("|") || void 0
	}, noWrap ? children : React.Children.map(children, text));
}
function useCmsPhrase(original) {
	const ctx = useContext(CmsContext), source = "motion/SplitWords", id = fieldId(source, "text", original);
	ctx.collect?.({
		id,
		source,
		kind: "text",
		original
	});
	const local = ctx.snapshot.fields[id], shared = ctx.snapshot.fields["library:text:" + hash(original)], saved = local?.value != null ? local : shared?.value != null ? shared : local, f = saved?.format || {};
	return {
		id: saved?.id || id,
		text: saved?.value ?? original,
		style: {
			fontWeight: f.bold ? 700 : void 0,
			fontStyle: f.italic ? "italic" : void 0,
			textDecoration: [f.underline ? "underline" : "", f.strike ? "line-through" : ""].filter(Boolean).join(" ") || void 0,
			color: f.color || void 0,
			backgroundColor: f.highlight || void 0
		}
	};
}
function useCmsMetric(original) {
	const ctx = useContext(CmsContext), source = "motion/useCountUp", id = fieldId(source, "number", String(original));
	ctx.collect?.({
		id,
		source,
		kind: "number",
		original: String(original)
	});
	const saved = ctx.snapshot.fields[id], n = Number(saved?.value ?? original);
	return Number.isFinite(n) ? n : original;
}
// src/motion.tsx
var clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
var reduced$1 = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
function useScrollMotion(route) {
	useEffect(() => {
		const links = Array.from(document.querySelectorAll(".nav-links a"));
		const sections = links.filter((a) => a.getAttribute("href")?.startsWith("#")).map((a) => document.querySelector(a.getAttribute("href") || "")).filter(Boolean);
		const spy = new IntersectionObserver((entries) => entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
		}), { rootMargin: "-45% 0px -50% 0px" });
		sections.forEach((s) => spy.observe(s));
		if (reduced$1()) return () => spy.disconnect();
		const hero = document.querySelector(".hero-inner");
		const heroBg = document.querySelector(".hero");
		const parallax = Array.from(document.querySelectorAll("[data-parallax]"));
		const cards = Array.from(document.querySelectorAll(".project-card"));
		let stickyTop = [];
		let isSticky = false;
		const measure = () => {
			isSticky = cards[0] ? getComputedStyle(cards[0]).position === "sticky" : false;
			stickyTop = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);
		};
		let raf = 0;
		const update = () => {
			raf = 0;
			const vh = window.innerHeight;
			const y = window.scrollY;
			if (hero) hero.style.setProperty("--hero-p", clamp(y / (vh * .85)).toFixed(3));
			if (heroBg) heroBg.style.setProperty("--hero-bg", `${(y * .18).toFixed(1)}px`);
			parallax.forEach((el) => {
				const ref = el.parentElement;
				if (!ref) return;
				const r = ref.getBoundingClientRect();
				if (r.bottom < -200 || r.top > vh + 200) return;
				const speed = parseFloat(el.dataset.parallax || "0.1");
				const center = r.top + r.height / 2 - vh / 2;
				el.style.setProperty("--pary", `${(-center * speed).toFixed(1)}px`);
			});
			cards.forEach((card, i) => {
				const next = cards[i + 1];
				let sink = 0;
				let emerge = 1;
				if (isSticky) {
					if (next) {
						const target = stickyTop[i + 1];
						const nt = next.getBoundingClientRect().top;
						sink = clamp(1 - (nt - target) / Math.max(1, vh - target));
					}
					emerge = clamp((vh - card.getBoundingClientRect().top) / (vh * .55));
				}
				card.style.setProperty("--sink", sink.toFixed(3));
				card.style.setProperty("--emerge", emerge.toFixed(3));
			});
		};
		const request = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		const onResize = () => {
			measure();
			request();
		};
		measure();
		update();
		window.addEventListener("scroll", request, { passive: true });
		window.addEventListener("resize", onResize);
		window.addEventListener("load", onResize);
		return () => {
			spy.disconnect();
			cancelAnimationFrame(raf);
			window.removeEventListener("scroll", request);
			window.removeEventListener("resize", onResize);
			window.removeEventListener("load", onResize);
		};
	}, [route]);
}
function usePointerMotion(route) {
	useEffect(() => {
		if (reduced$1() || !finePointer()) return;
		const cleanups = [];
		document.querySelectorAll("[data-tilt]").forEach((el) => {
			const move = (e) => {
				const r = el.getBoundingClientRect();
				const x = clamp((e.clientX - r.left) / r.width);
				const y = clamp((e.clientY - r.top) / r.height);
				el.style.setProperty("--tilt-x", (x * 2 - 1).toFixed(3));
				el.style.setProperty("--tilt-y", (y * 2 - 1).toFixed(3));
				el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
				el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
			};
			const leave = () => {
				el.style.setProperty("--tilt-x", "0");
				el.style.setProperty("--tilt-y", "0");
			};
			el.addEventListener("pointermove", move);
			el.addEventListener("pointerleave", leave);
			cleanups.push(() => {
				el.removeEventListener("pointermove", move);
				el.removeEventListener("pointerleave", leave);
			});
		});
		document.querySelectorAll(".button-3d, .menu-button, .hero-chips button").forEach((el) => {
			const move = (e) => {
				const r = el.getBoundingClientRect();
				const dx = e.clientX - (r.left + r.width / 2);
				const dy = e.clientY - (r.top + r.height / 2);
				el.style.setProperty("--mag-x", `${(dx * .22).toFixed(1)}px`);
				el.style.setProperty("--mag-y", `${(dy * .28).toFixed(1)}px`);
			};
			const leave = () => {
				el.style.setProperty("--mag-x", "0px");
				el.style.setProperty("--mag-y", "0px");
			};
			el.addEventListener("pointermove", move);
			el.addEventListener("pointerleave", leave);
			cleanups.push(() => {
				el.removeEventListener("pointermove", move);
				el.removeEventListener("pointerleave", leave);
			});
		});
		const hero = document.querySelector(".hero");
		if (hero) {
			const move = (e) => {
				const r = hero.getBoundingClientRect();
				hero.style.setProperty("--hx", ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
				hero.style.setProperty("--hy", ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
			};
			hero.addEventListener("pointermove", move);
			cleanups.push(() => hero.removeEventListener("pointermove", move));
		}
		return () => cleanups.forEach((fn) => fn());
	}, [route]);
}
function useMotion(route = "home") {
	useScrollMotion(route);
	usePointerMotion(route);
}
function Cursor() {
	const dot = useRef(null);
	const ring = useRef(null);
	const label = useRef(null);
	useEffect(() => {
		if (reduced$1() || !finePointer()) return;
		const d = dot.current;
		const r = ring.current;
		let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
		const onMove = (e) => {
			x = e.clientX;
			y = e.clientY;
			d.style.transform = `translate3d(${x}px,${y}px,0)`;
			d.classList.add("is-on");
			r.classList.add("is-on");
			const t = e.target;
			const tagged = t?.closest("[data-cursor]");
			const interactive = t?.closest("a, button, input, [data-tilt]");
			r.classList.toggle("is-link", !!interactive && !tagged);
			r.classList.toggle("is-label", !!tagged);
			d.classList.toggle("is-hidden", !!tagged || !!interactive);
			if (label.current) label.current.textContent = tagged?.dataset.cursor ?? "";
		};
		const onLeave = () => {
			d.classList.remove("is-on");
			r.classList.remove("is-on");
		};
		const onDown = () => r.classList.add("is-down");
		const onUp = () => r.classList.remove("is-down");
		const loop = () => {
			cx += (x - cx) * .17;
			cy += (y - cy) * .17;
			r.style.transform = `translate3d(${cx}px,${cy}px,0)`;
			raf = requestAnimationFrame(loop);
		};
		loop();
		window.addEventListener("pointermove", onMove);
		document.addEventListener("pointerleave", onLeave);
		window.addEventListener("pointerdown", onDown);
		window.addEventListener("pointerup", onUp);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", onMove);
			document.removeEventListener("pointerleave", onLeave);
			window.removeEventListener("pointerdown", onDown);
			window.removeEventListener("pointerup", onUp);
		};
	}, []);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
		className: "cursor-dot",
		ref: dot,
		"aria-hidden": "true"
	}), /* @__PURE__ */ jsx("div", {
		className: "cursor-ring",
		ref: ring,
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("span", {
			className: "cursor-ring-inner",
			children: /* @__PURE__ */ jsx("span", { ref: label })
		})
	})] });
}
function CountUp({ value }) {
	const match = value.match(/^(\d+)(.*)$/);
	const target = match ? parseInt(match[1], 10) : 0;
	const suffix = match ? match[2] : "";
	const [n, setN] = useState(reduced$1() ? target : 0);
	const hasNumber = !!match;
	const ref = useRef(null);
	useEffect(() => {
		if (!hasNumber || reduced$1()) return;
		const el = ref.current;
		let raf = 0;
		const io = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) return;
			io.disconnect();
			const start = performance.now();
			const dur = 1700;
			const tick = (now) => {
				const t = clamp((now - start) / dur);
				const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
				setN(Math.round(target * eased));
				if (t < 1) raf = requestAnimationFrame(tick);
			};
			raf = requestAnimationFrame(tick);
		}, { threshold: .6 });
		io.observe(el);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	}, [target, hasNumber]);
	return /* @__PURE__ */ jsxs("strong", {
		ref,
		"aria-label": value,
		children: [n.toLocaleString("en-US"), suffix]
	});
}
function SplitWords({ text, start = 0, em = false }) {
	const phrase = useCmsPhrase(text);
	const words = phrase.text.split(" ").map((w, i) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		className: "word",
		children: /* @__PURE__ */ jsx("span", {
			style: {
				...phrase.style,
				"--i": start + i
			},
			children: w
		})
	}), " "] }, i));
	return /* @__PURE__ */ jsx("span", {
		"data-cms-field": phrase.id,
		style: phrase.style,
		children: em ? /* @__PURE__ */ jsx("em", { children: words }) : /* @__PURE__ */ jsx(Fragment$1, { children: words })
	});
}
function TypedInput({ id, value, onChange, phrases }) {
	const [text, setText] = useState(phrases[0]);
	useEffect(() => {
		if (reduced$1()) return;
		let phrase = 0;
		let chars = 0;
		let deleting = false;
		let timer = 0;
		const step = () => {
			const full = phrases[phrase];
			chars += deleting ? -1 : 1;
			setText(full.slice(0, chars));
			let wait = deleting ? 28 : 62;
			if (!deleting && chars === full.length) {
				deleting = true;
				wait = 1700;
			} else if (deleting && chars === 0) {
				deleting = false;
				phrase = (phrase + 1) % phrases.length;
				wait = 350;
			}
			timer = window.setTimeout(step, wait);
		};
		timer = window.setTimeout(step, 2400);
		return () => window.clearTimeout(timer);
	}, [phrases]);
	return /* @__PURE__ */ jsx("input", {
		id,
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder: text || "\xA0"
	});
}
function useTypedText(phrases, active = true) {
	const [text, setText] = useState(phrases[0]);
	useEffect(() => {
		if (reduced$1() || !active) {
			setText(phrases[0]);
			return;
		}
		let phrase = 0;
		let chars = 0;
		let deleting = false;
		let timer = 0;
		const step = () => {
			const full = phrases[phrase];
			chars += deleting ? -2 : 1;
			chars = Math.max(0, chars);
			setText(full.slice(0, chars));
			let wait = deleting ? 18 : 42;
			if (!deleting && chars === full.length) {
				deleting = true;
				wait = 2200;
			} else if (deleting && chars === 0) {
				deleting = false;
				phrase = (phrase + 1) % phrases.length;
				wait = 400;
			}
			timer = window.setTimeout(step, wait);
		};
		timer = window.setTimeout(step, 2600);
		return () => window.clearTimeout(timer);
	}, [phrases, active]);
	return text;
}
var WAVE = "M0 60 Q150 0 300 60 T600 60 T900 60 T1200 60 T1500 60 T1800 60 T2100 60 T2400 60";
function WaveDivider({ from, to }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "wave",
		style: { background: from },
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsx("svg", {
			className: "wave-layer wave-layer--back",
			viewBox: "0 0 2400 120",
			preserveAspectRatio: "none",
			children: /* @__PURE__ */ jsx("path", {
				d: `${WAVE} V120 H0Z`,
				fill: to,
				opacity: ".45"
			})
		}), /* @__PURE__ */ jsxs("svg", {
			className: "wave-layer wave-layer--front",
			viewBox: "0 0 2400 120",
			preserveAspectRatio: "none",
			children: [/* @__PURE__ */ jsx("path", {
				d: `${WAVE} V120 H0Z`,
				fill: to
			}), /* @__PURE__ */ jsx("path", {
				d: WAVE,
				fill: "none",
				stroke: "var(--ink)",
				strokeWidth: "1.5",
				vectorEffect: "non-scaling-stroke"
			})]
		})]
	});
}
function useInView(ref, { once = false, amount = .3 } = {}) {
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => {
			setInView(entry.isIntersecting);
			if (entry.isIntersecting && once) io.disconnect();
		}, { threshold: amount });
		io.observe(el);
		return () => io.disconnect();
	}, [
		ref,
		once,
		amount
	]);
	return inView;
}
function useCountUp(to, run, duration = 1400) {
	to = useCmsMetric(to);
	const [v, setV] = useState(typeof window === "undefined" || reduced$1() ? to : 0);
	useEffect(() => {
		if (!run || reduced$1()) return;
		let raf = 0;
		const start = performance.now();
		const tick = (now) => {
			const t = clamp((now - start) / duration);
			setV(Math.round(to * (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))));
			if (t < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		run,
		to,
		duration
	]);
	return v;
}
var prefersReducedMotion = reduced$1;
// src/components/ui.tsx
function Button3D({ children, href, tone = "mint", type = "button", onClick }) {
	const className = `button-3d button-3d--${tone}`;
	if (href) return /* @__PURE__ */ jsx(CmsElement, {
		className,
		href,
		cmsTag: "a",
		cmsSource: "components/ui.tsx:1",
		children
	});
	return /* @__PURE__ */ jsx(CmsElement, {
		className,
		type,
		onClick,
		cmsTag: "button",
		cmsSource: "components/ui.tsx:2",
		children
	});
}
function SectionHeading({ eyebrow, title, em, copy, className = "" }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: `section-heading ${className}`,
		"data-reveal": true,
		cmsTag: "div",
		cmsSource: "components/ui.tsx:3",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			cmsTag: "div",
			cmsSource: "components/ui.tsx:4",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "eyebrow",
				cmsTag: "p",
				cmsSource: "components/ui.tsx:5",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/ui.tsx:6"
					}),
					" ",
					eyebrow
				]
			}), /* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "h2",
				cmsSource: "components/ui.tsx:7",
				children: [title, em && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "em",
					cmsSource: "components/ui.tsx:8",
					children: em
				})] })]
			})]
		}), copy && /* @__PURE__ */ jsx(CmsElement, {
			cmsTag: "p",
			cmsSource: "components/ui.tsx:9",
			children: copy
		})]
	});
}
// src/components/Header.tsx
var NAV = [
	"Services",
	"Products",
	"Work",
	"About",
	"Careers"
];
function Wordmark({ footer = false }) {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: footer ? "brand-logo brand-logo--footer" : "brand-logo",
		href: "/",
		"aria-label": "Sybertron Technologies home",
		cmsTag: "a",
		cmsSource: "components/Header.tsx:1",
		children: /* @__PURE__ */ jsx(CmsElement, {
			src: footer ? "/logo-horizontal-white.svg" : "/logo-horizontal-black.svg",
			alt: "Sybertron Technologies",
			width: footer ? 260 : 156,
			height: footer ? 64 : 38,
			cmsTag: "img",
			cmsSource: "components/Header.tsx:2"
		})
	});
}
function Header({ hidden, menuOpen, setMenuOpen, route = "home" }) {
	const section = route === "product" ? "products" : route === "service" ? "services" : route;
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: hidden ? "site-header is-hidden" : "site-header",
		cmsTag: "header",
		cmsSource: "components/Header.tsx:3",
		children: [
			/* @__PURE__ */ jsx(Wordmark, {}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: menuOpen ? "nav-links is-open" : "nav-links",
				"aria-label": "Main navigation",
				cmsTag: "nav",
				cmsSource: "components/Header.tsx:4",
				children: [NAV.map((label) => /* @__PURE__ */ jsx(CmsElement, {
					href: label === "Careers" ? "/careers" : `/${label.toLowerCase()}`,
					className: section === label.toLowerCase() ? "is-active" : void 0,
					"aria-current": section === label.toLowerCase() ? "page" : void 0,
					onClick: () => setMenuOpen(false),
					cmsTag: "a",
					cmsSource: "components/Header.tsx:5",
					children: label
				}, label)), /* @__PURE__ */ jsxs(CmsElement, {
					className: route === "urgent" ? "nav-urgent is-active" : "nav-urgent",
					href: "/urgent",
					"aria-current": route === "urgent" ? "page" : void 0,
					onClick: () => setMenuOpen(false),
					cmsTag: "a",
					cmsSource: "components/Header.tsx:6",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/Header.tsx:7"
					}), " RAPID RESPONSE"]
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "header-actions",
				cmsTag: "div",
				cmsSource: "components/Header.tsx:8",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: route === "urgent" ? "urgent-pill is-active" : "urgent-pill",
						href: "/urgent",
						"aria-current": route === "urgent" ? "page" : void 0,
						cmsTag: "a",
						cmsSource: "components/Header.tsx:9",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "i",
							cmsSource: "components/Header.tsx:10"
						}), " RAPID RESPONSE"]
					}),
					/* @__PURE__ */ jsxs(Button3D, {
						href: "/start",
						tone: "ink",
						children: ["Start a project ", /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 17 })]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "menu-button",
						onClick: () => setMenuOpen(!menuOpen),
						"aria-label": "Toggle menu",
						"aria-expanded": menuOpen,
						cmsTag: "button",
						cmsSource: "components/Header.tsx:11",
						children: /* @__PURE__ */ jsx(Menu, { size: 20 })
					})
				]
			})
		]
	});
}
// src/data/products.ts
var products = [
	{
		id: "peopledesk",
		category: "HR & Payroll",
		name: "PeopleDesk",
		url: "peopledesk.sybertron.com",
		blurb: "Attendance, leave and payroll for growing teams, from punch-in to payslip.",
		bullets: [
			"GPS and biometric attendance",
			"GST-ready payroll with PF and ESI",
			"Shift and leave rules",
			"Employee self-service app"
		],
		platforms: "Web app · Phone app · Desktop app",
		accent: "#7c73ff",
		mock: {
			variant: "list",
			crumb: "People / Overview",
			title: "Attendance",
			heading: "Present by department",
			attention: "Needs attention",
			accent: "#7c73ff",
			accent2: "#c084fc",
			kpis: [
				{
					v: "126",
					l: "Present today"
				},
				{
					v: "8",
					l: "On leave"
				},
				{
					v: "3",
					l: "Late arrivals"
				}
			],
			rows: [
				{
					n: "Engineering",
					p: 92,
					t: "46 / 50"
				},
				{
					n: "Design",
					p: 85,
					t: "17 / 20"
				},
				{
					n: "Sales",
					p: 78,
					t: "31 / 40"
				},
				{
					n: "Support",
					p: 96,
					t: "24 / 25"
				},
				{
					n: "Finance",
					p: 70,
					t: "7 / 10"
				},
				{
					n: "Operations",
					p: 88,
					t: "22 / 25"
				}
			],
			alerts: [{
				t: "5 timesheets pending",
				s: "Approve before payroll closes"
			}, {
				t: "2 leave requests",
				s: "Waiting for manager review"
			}]
		}
	},
	{
		id: "leadflow",
		category: "Sales & CRM",
		name: "LeadFlow CRM",
		url: "leadflow.sybertron.com",
		blurb: "Track every lead from first enquiry to signed deal, with follow-ups that never slip.",
		bullets: [
			"Pipeline with follow-up reminders",
			"WhatsApp and email in one inbox",
			"Quotes and GST invoices",
			"Team targets and reports"
		],
		platforms: "Web app · Phone & tablet browser",
		accent: "#06b6d4",
		mock: {
			variant: "chart",
			crumb: "Sales / Pipeline",
			title: "Revenue",
			heading: "Closed deals, last 12 weeks",
			attention: "Follow up today",
			accent: "#22d3ee",
			accent2: "#6366f1",
			kpis: [
				{
					v: "₹48.2L",
					l: "Pipeline value"
				},
				{
					v: "37",
					l: "Open deals"
				},
				{
					v: "24%",
					l: "Win rate"
				}
			],
			rows: [
				{
					n: "W1",
					p: 28,
					t: ""
				},
				{
					n: "W2",
					p: 36,
					t: ""
				},
				{
					n: "W3",
					p: 30,
					t: ""
				},
				{
					n: "W4",
					p: 48,
					t: ""
				},
				{
					n: "W5",
					p: 44,
					t: ""
				},
				{
					n: "W6",
					p: 58,
					t: ""
				},
				{
					n: "W7",
					p: 52,
					t: ""
				},
				{
					n: "W8",
					p: 70,
					t: ""
				},
				{
					n: "W9",
					p: 66,
					t: ""
				},
				{
					n: "W10",
					p: 82,
					t: ""
				}
			],
			alerts: [{
				t: "Call back: Mehta Traders",
				s: "Quote sent 3 days ago"
			}, {
				t: "Proposal due: Orion Labs",
				s: "Today, 5:00 pm"
			}]
		}
	},
	{
		id: "dineos",
		category: "Restaurants",
		name: "DineOS",
		url: "dineos.sybertron.com",
		blurb: "Billing, kitchen and stock for restaurants and cafés in one system.",
		bullets: [
			"Dine-in, takeaway and delivery billing",
			"Kitchen display screens",
			"UPI and card payments",
			"Recipe-level stock tracking"
		],
		platforms: "Web app · Tablet POS · Phone app",
		accent: "#10b981",
		mock: {
			variant: "tiles",
			crumb: "Floor / Live tables",
			title: "Tables",
			heading: "Floor plan",
			attention: "Kitchen queue",
			accent: "#34d399",
			accent2: "#fbbf24",
			kpis: [
				{
					v: "14 / 22",
					l: "Tables busy"
				},
				{
					v: "₹86,400",
					l: "Sales today"
				},
				{
					v: "9 min",
					l: "Avg. prep time"
				}
			],
			rows: [
				{
					n: "T1",
					p: 90,
					t: ""
				},
				{
					n: "T2",
					p: 20,
					t: ""
				},
				{
					n: "T3",
					p: 60,
					t: ""
				},
				{
					n: "T4",
					p: 90,
					t: ""
				},
				{
					n: "T5",
					p: 5,
					t: ""
				},
				{
					n: "T6",
					p: 60,
					t: ""
				},
				{
					n: "T7",
					p: 90,
					t: ""
				},
				{
					n: "T8",
					p: 20,
					t: ""
				},
				{
					n: "T9",
					p: 5,
					t: ""
				},
				{
					n: "T10",
					p: 60,
					t: ""
				},
				{
					n: "T11",
					p: 90,
					t: ""
				},
				{
					n: "T12",
					p: 5,
					t: ""
				}
			],
			alerts: [{
				t: "Table 4: 2 mains",
				s: "Cooking, 6 min left"
			}, {
				t: "Table 7: dessert",
				s: "Ready to serve"
			}]
		}
	},
	{
		id: "stockpilot",
		category: "Inventory",
		name: "StockPilot",
		url: "stockpilot.sybertron.com",
		blurb: "Inventory and purchasing control across warehouses, stores and suppliers.",
		bullets: [
			"Multi-warehouse stock",
			"Barcode scanning",
			"Purchase orders and goods receipts",
			"Low-stock alerts"
		],
		platforms: "Web app · Handheld scanner app",
		accent: "#f59e0b",
		mock: {
			variant: "list",
			crumb: "Stock / Overview",
			title: "Inventory",
			heading: "Stock level by warehouse",
			attention: "Low stock",
			accent: "#fbbf24",
			accent2: "#f97316",
			kpis: [
				{
					v: "4,280",
					l: "SKUs tracked"
				},
				{
					v: "36",
					l: "Low-stock items"
				},
				{
					v: "12",
					l: "Orders in transit"
				}
			],
			rows: [
				{
					n: "Delhi",
					p: 84,
					t: "8.4k"
				},
				{
					n: "Mumbai",
					p: 62,
					t: "6.2k"
				},
				{
					n: "Pune",
					p: 74,
					t: "7.4k"
				},
				{
					n: "Jaipur",
					p: 38,
					t: "3.8k"
				},
				{
					n: "Noida",
					p: 91,
					t: "9.1k"
				},
				{
					n: "Lucknow",
					p: 52,
					t: "5.2k"
				}
			],
			alerts: [{
				t: "Cable 6mm: 12 left",
				s: "Reorder level is 50"
			}, {
				t: "PO #1042 arriving",
				s: "Delhi warehouse, today"
			}]
		}
	}
];
// src/data/catalog.ts
var categories = [
	{
		id: "finance-pos",
		label: "Finance & POS",
		tone: "#b8f36b"
	},
	{
		id: "operations",
		label: "Operations",
		tone: "#c9b7ff"
	},
	{
		id: "people",
		label: "People",
		tone: "#ffd764"
	},
	{
		id: "commerce",
		label: "Commerce",
		tone: "#ffb8c6"
	},
	{
		id: "ai-data",
		label: "AI & data",
		tone: "#a9dcff"
	},
	{
		id: "security-cloud",
		label: "Security & cloud",
		tone: "#9eebd2"
	},
	{
		id: "ar-vr",
		label: "AR/VR",
		tone: "#ffb59e"
	},
	{
		id: "education",
		label: "Education",
		tone: "#d7c8ff"
	}
];
var PAL = [
	"#7c73ff",
	"#06b6d4",
	"#10b981",
	"#f59e0b",
	"#ec4899",
	"#8b5cf6",
	"#f97316",
	"#3b82f6"
];
var LIST_P$1 = [
	92,
	85,
	78,
	96,
	70,
	88
];
var TILE_P$1 = [
	90,
	20,
	60,
	5,
	60,
	90,
	20,
	5,
	60,
	90,
	5,
	20
];
var CHART_P$1 = [
	28,
	36,
	30,
	48,
	44,
	58,
	52,
	70
];
var SPECS = [
	[
		"invoicehub",
		"finance-pos",
		"Invoice Hub",
		"Quotes, GST invoices and payment reminders that chase themselves.",
		[
			"GST-ready invoices and e-way bills",
			"Automatic payment reminders",
			"Expense and tax reports"
		],
		"Web app · Phone app",
		"chart",
		"Billing / Invoices",
		"Collected, last 8 weeks",
		"Overdue",
		[
			["₹12.4L", "Billed this month"],
			["₹3.1L", "Outstanding"],
			["96%", "Paid on time"]
		],
		[["4 invoices overdue", "Reminder sends tomorrow"], ["Quote #218 accepted", "Convert to invoice"]]
	],
	[
		"retailpos",
		"finance-pos",
		"Retail POS",
		"Fast checkout, barcode billing and stock sync for shops of any size.",
		[
			"Barcode and weighing-scale billing",
			"Works offline, syncs later",
			"Returns, discounts and loyalty"
		],
		"Tablet & desktop POS · Web dashboard",
		"chart",
		"Shop / Sales",
		"Sales, last 8 days",
		"Low stock",
		[
			["₹86k", "Sales today"],
			["214", "Bills"],
			["₹403", "Avg. basket"]
		],
		[["Rice 5kg: 6 left", "Reorder level is 20"], ["Till 2 closing", "Cash count pending"]]
	],
	[
		"dineos",
		"finance-pos",
		"",
		"",
		[
			"",
			"",
			""
		],
		"",
		"list",
		"",
		"",
		"",
		[],
		[]
	],
	[
		"salonplanner",
		"finance-pos",
		"Salon Planner",
		"Bookings, checkout and staff earnings for salons and spas.",
		[
			"Online booking by stylist",
			"Deposits and package sales",
			"Commission and payroll reports"
		],
		"Web POS · Salon website · Staff login",
		"list",
		"Salon / Today",
		"Chairs booked by service",
		"Walk-ins waiting",
		[
			["38", "Bookings today"],
			["₹54k", "Revenue"],
			["4", "No-shows"]
		],
		[["Priya: 11:30 colour", "Needs a deposit"], ["Package expiring", "3 clients this week"]],
		[
			"Hair",
			"Spa",
			"Nails",
			"Makeup",
			"Barber",
			"Bridal"
		]
	],
	[
		"stockpilot",
		"operations",
		"",
		"",
		[
			"",
			"",
			""
		],
		"",
		"list",
		"",
		"",
		"",
		[],
		[]
	],
	[
		"smartfacility",
		"operations",
		"Smart Facility",
		"Every building, tenant, lease and work order on one dashboard.",
		[
			"Live occupancy per building",
			"Units, floors and amenities",
			"Lease renewals in one click"
		],
		"Web dashboard · Tenant app · Guard app",
		"chart",
		"Facility / Dashboard",
		"Occupancy by building",
		"Open work orders",
		[
			["92%", "Occupancy"],
			["17", "Open tickets"],
			["5", "Leases ending"]
		],
		[["Lift B inspection", "Due on Friday"], ["Lease: Unit 4C", "Renews in 12 days"]]
	],
	[
		"fleettracker",
		"operations",
		"Fleet Tracker",
		"Live vehicle tracking, trips and fuel reports for fleets.",
		[
			"Live map with trip history",
			"Driver and fuel reports",
			"Maintenance reminders"
		],
		"Web app · Driver app",
		"list",
		"Fleet / Live",
		"On-time trips by route",
		"Service due",
		[
			["42", "Vehicles live"],
			["6", "Idle > 30 min"],
			["94%", "On-time trips"]
		],
		[["Truck 07: service", "Due in 300 km"], ["Route C delayed", "Traffic near Gurugram"]],
		[
			"Route A",
			"Route B",
			"Route C",
			"Route D",
			"Route E",
			"Route F"
		]
	],
	[
		"assettracker",
		"operations",
		"Asset Tracker",
		"Know where every asset is, who has it and when it's due for service.",
		[
			"QR and barcode asset tags",
			"Check-in and check-out log",
			"Service and warranty alerts"
		],
		"Web app · Phone scanner app",
		"tiles",
		"Assets / Registry",
		"Assets by status",
		"Service due",
		[
			["1,240", "Assets tracked"],
			["86", "Checked out"],
			["9", "Service due"]
		],
		[["Laptop L-204", "Warranty ends in 14 days"], ["Drill D-31", "Overdue by 3 days"]]
	],
	[
		"fieldservice",
		"operations",
		"Field Service",
		"Dispatch technicians, track jobs and collect sign-off on site.",
		[
			"Job scheduling and dispatch",
			"Photo and signature capture",
			"Customer status updates"
		],
		"Web dispatch · Technician app",
		"list",
		"Jobs / Today",
		"Jobs done by team",
		"Unassigned jobs",
		[
			["64", "Jobs today"],
			["11", "In progress"],
			["2", "Unassigned"]
		],
		[["Job #882 unassigned", "Customer waiting"], ["Signature missing", "Job #871"]],
		[
			"Team A",
			"Team B",
			"Team C",
			"Team D",
			"Team E",
			"Team F"
		]
	],
	[
		"propertymanager",
		"operations",
		"Property Manager",
		"Listings, tenants, rent and repairs for property managers.",
		[
			"Rent roll and reminders",
			"Maintenance requests",
			"Owner statements"
		],
		"Web app · Tenant app",
		"chart",
		"Property / Rent",
		"Rent collected, last 8 months",
		"Overdue rent",
		[
			["₹18.6L", "Rent due"],
			["93%", "Collected"],
			["7", "Repairs open"]
		],
		[["Flat 12B: rent late", "Reminder sent"], ["Plumber booked", "Tower 3, 4 pm"]]
	],
	[
		"peopledesk",
		"people",
		"",
		"",
		[
			"",
			"",
			""
		],
		"",
		"list",
		"",
		"",
		"",
		[],
		[]
	],
	[
		"visitorpass",
		"people",
		"Visitor Pass",
		"Pre-register guests, print badges and keep an audit trail.",
		[
			"QR pre-registration",
			"Badge printing at the desk",
			"Host alerts on arrival"
		],
		"Web app · Kiosk · Phone app",
		"tiles",
		"Front desk / Visitors",
		"Visitors by hour",
		"Waiting at desk",
		[
			["48", "Visitors today"],
			["6", "On site"],
			["3", "Expected"]
		],
		[["R. Mehta arrived", "Host notified"], ["Contractor badge", "Expires at 6 pm"]]
	],
	[
		"clinicdesk",
		"people",
		"Clinic Desk",
		"Appointments, patient records and billing for clinics.",
		[
			"Online appointments",
			"Prescriptions and visit notes",
			"Billing and reminders"
		],
		"Web app · Reception tablet",
		"list",
		"Clinic / Today",
		"Appointments by department",
		"Waiting room",
		[
			["58", "Appointments"],
			["5", "Waiting"],
			["₹71k", "Billed"]
		],
		[["Follow-up due", "12 patients this week"], ["Lab report ready", "Dr. Rao to review"]],
		[
			"General",
			"Dental",
			"Skin",
			"Child",
			"Eye",
			"Ortho"
		]
	],
	[
		"gymmanager",
		"people",
		"Gym Manager",
		"Memberships, classes and access control for gyms and studios.",
		[
			"Plans and auto-renewal",
			"Class booking and waitlists",
			"Door access by QR"
		],
		"Web app · Member app",
		"chart",
		"Gym / Members",
		"Check-ins, last 8 days",
		"Renewals due",
		[
			["1,120", "Active members"],
			["142", "Check-ins today"],
			["31", "Renewals due"]
		],
		[["Yoga 6 pm full", "9 on waitlist"], ["Plan expiring", "31 members this week"]]
	],
	[
		"leadflow",
		"commerce",
		"",
		"",
		[
			"",
			"",
			""
		],
		"",
		"chart",
		"",
		"",
		"",
		[],
		[]
	],
	[
		"bookingengine",
		"commerce",
		"Booking Engine",
		"Take bookings, deposits and reminders on your own website.",
		[
			"Calendar and resource rules",
			"Deposits and prepayment",
			"SMS and email reminders"
		],
		"Web widget · Admin app",
		"tiles",
		"Bookings / Calendar",
		"Slots filled this week",
		"Pending deposits",
		[
			["126", "Bookings this week"],
			["₹2.4L", "Deposits"],
			["4%", "No-show rate"]
		],
		[["Saturday nearly full", "3 slots left"], ["Deposit pending", "Booking #4412"]]
	],
	[
		"orderportal",
		"commerce",
		"Order Portal",
		"A bulk-ordering portal for distributors and wholesale buyers.",
		[
			"Customer-specific price lists",
			"Reorder from past orders",
			"Credit limits and approvals"
		],
		"Web portal · Sales rep app",
		"list",
		"Portal / Orders",
		"Orders by channel",
		"Needs approval",
		[
			["212", "Orders this week"],
			["₹38L", "Order value"],
			["9", "Awaiting approval"]
		],
		[["Dealer over limit", "Approve or hold"], ["New price list", "Goes live Monday"]],
		[
			"Retail",
			"Wholesale",
			"Dealers",
			"Export",
			"Online",
			"Direct"
		]
	],
	[
		"aichatbot",
		"ai-data",
		"AI Chatbot",
		"A support and sales assistant trained on your own content.",
		[
			"Answers from your documents",
			"Hands over to your team",
			"WhatsApp and website chat"
		],
		"Website widget · WhatsApp · Admin dashboard",
		"chart",
		"Chatbot / Conversations",
		"Conversations, last 8 days",
		"Needs a human",
		[
			["2,310", "Chats this month"],
			["81%", "Resolved by bot"],
			["14s", "First reply"]
		],
		[["Refund question", "Handed to support"], ["New topic found", "Add to knowledge base"]]
	],
	[
		"aianalytics",
		"ai-data",
		"AI-Powered Analytics",
		"Ask questions of your data in plain language and get charts back.",
		[
			"Plain-language questions",
			"Scheduled reports",
			"Connects to your database"
		],
		"Web app · Email reports",
		"chart",
		"Analytics / Ask",
		"Revenue, last 8 weeks",
		"Insights",
		[
			["+12%", "Revenue vs last month"],
			["38", "Reports saved"],
			["5", "New insights"]
		],
		[["Churn up in Pune", "Worth a look"], ["Weekly report", "Sent to 6 people"]]
	],
	[
		"documentvault",
		"ai-data",
		"Document Vault",
		"Search, tag and extract data from contracts, invoices and forms.",
		[
			"Automatic data extraction",
			"Full-text search",
			"Role-based access"
		],
		"Web app · Email-in",
		"list",
		"Vault / Documents",
		"Documents by type",
		"Needs review",
		[
			["18.4k", "Documents"],
			["96%", "Auto-tagged"],
			["23", "To review"]
		],
		[["Contract expiring", "Vendor: Orion Labs"], ["Low-confidence scan", "Invoice #2291"]],
		[
			"Contracts",
			"Invoices",
			"Forms",
			"HR",
			"Legal",
			"Other"
		]
	],
	[
		"securitysuite",
		"security-cloud",
		"Security & Compliance",
		"Monitoring, access control and compliance checks in one place.",
		[
			"Login and access monitoring",
			"Compliance checklists",
			"Alerts for risky changes"
		],
		"Web dashboard · Alerts by email and chat",
		"tiles",
		"Security / Overview",
		"Checks by status",
		"Alerts",
		[
			["98%", "Checks passing"],
			["3", "Open alerts"],
			["12", "Audits ready"]
		],
		[["Admin login: new device", "Verify with user"], ["Policy review", "Due in 5 days"]]
	],
	[
		"cloudbackup",
		"security-cloud",
		"Cloud Infrastructure",
		"Automatic backups, fast restores and cost control for cloud workloads.",
		[
			"Scheduled encrypted backups",
			"One-click restore",
			"Usage and cost reports"
		],
		"Web console · CLI",
		"list",
		"Cloud / Backups",
		"Backup health by workload",
		"Failed jobs",
		[
			["99.9%", "Uptime"],
			["214", "Backups this week"],
			["₹1.1L", "Monthly cost"]
		],
		[["Backup job failed", "Mail server, retrying"], ["Cost spike", "Storage up 18%"]],
		[
			"Database",
			"Files",
			"Servers",
			"Mail",
			"Apps",
			"Logs"
		]
	],
	[
		"vrshowroom",
		"ar-vr",
		"VR Showroom",
		"Let customers walk through products and spaces before they buy.",
		[
			"Immersive 3D environments",
			"Real-time interaction",
			"Works on headsets and browsers"
		],
		"VR headsets · Desktop",
		"tiles",
		"Showroom / Scenes",
		"Sessions by scene",
		"Popular",
		[
			["3D", "Scenes live"],
			["420", "Sessions"],
			["6 min", "Avg. visit"]
		],
		[["Scene 2 most visited", "Add a call to action"], ["New product model", "Ready to publish"]]
	],
	[
		"virtualtours",
		"ar-vr",
		"Virtual Tours",
		"Interactive 360° tours for properties, venues and campuses.",
		[
			"360° photo and video tours",
			"Hotspots and floor plans",
			"Embeds in your website"
		],
		"Web · Phone · VR headsets",
		"chart",
		"Tours / Views",
		"Tour views, last 8 days",
		"Enquiries",
		[
			["64", "Tours live"],
			["9.2k", "Views"],
			["212", "Enquiries"]
		],
		[["Tour 18 updated", "Floor 3 added"], ["New enquiry", "From the villa tour"]]
	],
	[
		"vrgaming",
		"ar-vr",
		"VR Gaming",
		"VR games and simulations people want to come back to.",
		[
			"Optimised for affordable hardware",
			"Comfort-first design",
			"Diverse content"
		],
		"VR headsets",
		"tiles",
		"Games / Library",
		"Sessions by game",
		"New release",
		[
			["12", "Titles"],
			["8.4k", "Players"],
			["22 min", "Avg. session"]
		],
		[["Update 1.4", "Rolling out today"], ["Motion comfort", "Test results in"]]
	],
	[
		"hologuide",
		"ar-vr",
		"Holo Guide",
		"AR overlays and guided walkthroughs for training and retail.",
		[
			"AR overlays on a phone",
			"Step-by-step training mode",
			"Content you can update yourself"
		],
		"Phone app · Tablet · AR glasses",
		"chart",
		"Guides / Usage",
		"Guides opened, last 8 days",
		"Updates",
		[
			["38", "Guides"],
			["1.9k", "Completions"],
			["91%", "Pass rate"]
		],
		[["Guide 12 outdated", "Update steps"], ["New store layout", "Overlay ready"]]
	],
	[
		"school360",
		"education",
		"School360",
		"School management: admissions, fees, report cards and a parent app.",
		[
			"Fee vouchers and online payments",
			"Report cards and attendance",
			"Parent and teacher apps"
		],
		"Web app · Phone & tablet browser · Desktop app",
		"list",
		"School / Overview",
		"Attendance by class",
		"Fees due",
		[
			["1,480", "Students"],
			["94%", "Present today"],
			["₹6.2L", "Fees due"]
		],
		[["Class 8 results", "Ready to publish"], ["Fee reminder", "Sends tomorrow"]],
		[
			"Class 1",
			"Class 3",
			"Class 5",
			"Class 7",
			"Class 9",
			"Class 11"
		]
	],
	[
		"learningplatform",
		"education",
		"Learning Platform",
		"A learning platform for academies: courses, question banks and live classes.",
		[
			"Course and subject builder",
			"Objective and subjective questions",
			"Live classes and paid plans"
		],
		"Web admin · Student portal · Phone app",
		"chart",
		"Learning / Courses",
		"Lessons completed, last 8 days",
		"Live today",
		[
			["340", "Active learners"],
			["24", "Courses"],
			["78%", "Completion"]
		],
		[["Live class 5 pm", "Physics, 42 joined"], ["Question bank", "120 new questions"]]
	]
];
var mk = (s, i) => {
	const [, , , , , , variant, crumb, heading, attention, kpis, alerts, labels = []] = s;
	const rows = variant === "list" ? labels.map((n, k) => ({
		n,
		p: LIST_P$1[k % 6],
		t: `${LIST_P$1[k % 6]}%`
	})) : variant === "chart" ? CHART_P$1.map((p, k) => ({
		n: `W${k + 1}`,
		p,
		t: ""
	})) : TILE_P$1.map((p, k) => ({
		n: `T${k + 1}`,
		p,
		t: ""
	}));
	return {
		variant,
		crumb,
		title: crumb.split(" / ")[1] ?? crumb,
		heading,
		attention,
		accent: PAL[i % 8],
		accent2: PAL[(i + 3) % 8],
		kpis: kpis.map(([v, l]) => ({
			v,
			l
		})),
		rows,
		alerts: alerts.map(([t, s2]) => ({
			t,
			s: s2
		}))
	};
};
var catalog = SPECS.map((s, i) => {
	const existing = products.find((b) => b.id === s[0]);
	if (existing) return {
		id: existing.id,
		cat: s[1],
		name: existing.name,
		blurb: existing.blurb,
		bullets: existing.bullets.slice(0, 3),
		platforms: existing.platforms,
		accent: existing.accent,
		mock: existing.mock
	};
	return {
		id: s[0],
		cat: s[1],
		name: s[2],
		blurb: s[3],
		bullets: s[4],
		platforms: s[5],
		accent: PAL[i % 8],
		mock: mk(s, i)
	};
});
catalog.map((p) => p.name);
// src/data/serviceDetail.ts
var flow = (title, a, b, c, d) => ({
	k: "flow",
	title,
	items: [
		a,
		b,
		c,
		d
	]
});
var chat = (title, a, b, c) => ({
	k: "chat",
	title,
	items: [
		a,
		b,
		c
	]
});
var bars = (title, items, nums) => ({
	k: "bars",
	title,
	items,
	nums
});
var list = (title, ...items) => ({
	k: "list",
	title,
	items
});
var W6 = [
	"W1",
	"W2",
	"W3",
	"W4",
	"W5",
	"W6"
];
var M6 = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun"
];
var DETAILS = [
	{
		id: "ai",
		lede: "We build AI for the jobs where it actually saves time or money: assistants that answer customers, agents that work through routine tasks, and models that make sense of your data.",
		stmt: "Every engagement starts with a workflow, not a model.",
		p: ["We find the step where people lose the most time or the business loses the most money, prototype an AI solution against your real data, and measure it before we scale it.", "We build on leading foundation models and open-source stacks, connect them to your systems through secure APIs, and keep humans in the loop where judgement matters."],
		capsTitle: "Where AI takes work off your team",
		caps: [
			{
				chip: "Answer customers instantly",
				h: "Answer customers instantly",
				d: "A chatbot or copilot trained on your products, policies and orders answers common questions day and night, and hands anything tricky to a person with the conversation attached.",
				subs: [["Chatbots & copilots", "Customer-facing assistants and internal tools grounded in your own content, in Arabic, English and more."], ["Smart handover", "Escalates to your team with the full context, so nobody asks the customer to repeat themselves."]],
				vis: chat("Support assistant", "Where is my order #4421?", "It left our warehouse this morning and arrives tomorrow. Want the tracking link?", "Yes please")
			},
			{
				chip: "Automate the busywork",
				h: "Automate the busywork",
				d: "Agents read emails, invoices and forms, check them against your rules and update your systems, so your team only handles the exceptions.",
				subs: [["AI agents & automation", "Agents that read, decide and act across your tools, such as triaging tickets, routing leads and updating records."], ["Document & vision AI", "Extract, classify and verify invoices, IDs, resumes and forms at scale."]],
				vis: flow("Invoice, start to finish", "Invoice arrives by email", "AI reads the PDF", "Checked against the purchase order", "Posted to your accounts")
			},
			{
				chip: "Turn data into decisions",
				h: "Turn data into decisions",
				d: "Models forecast demand, flag risk and spot patterns in your data, then the findings show up in the dashboards your team already uses.",
				subs: [["Machine learning & analytics", "Forecasting, scoring and anomaly detection built on your own data."], ["AI inside your product", "Add search, summaries, recommendations and voice to your web and mobile apps."]],
				vis: bars("Weekly order forecast", W6, [
					45,
					52,
					58,
					66,
					74,
					88
				])
			},
			{
				chip: "Keep it safe and accurate",
				h: "Keep it safe and accurate",
				d: "Every AI feature is tested on real examples before launch and watched afterwards, with limits on what it may do and a person on the loop for anything important.",
				subs: [["Evaluation & guardrails", "Accuracy testing, cost control, privacy and safety checks before and after launch."], ["Access & audit", "Role-based access, redaction of personal data and a log of every AI action."]],
				vis: list("Before it goes live", "Tested on 500 real questions|Passed", "Personal data masked before it reaches the model|On", "Every answer and action logged|On", "Refunds over $100 need a person's approval|Active")
			}
		],
		paysTitle: "Where AI pays off first",
		pays: [
			"Your team answers the same questions all day",
			"Staff re-type data from PDFs, emails or forms into another system",
			"Decisions wait on someone pulling a report together",
			"You screen large volumes of applications, leads or tickets by hand",
			"Customers expect answers outside office hours"
		],
		words: [
			"Agents",
			"Chatbots",
			"Automation",
			"Forecasts",
			"RAG",
			"Vision",
			"Guardrails",
			"Workflows",
			"Copilots",
			"Insights"
		],
		teamNote: "The team behind your project: analysts, designers, developers and testers working as one.",
		steps: [
			"Pick one workflow, map where the hours go and agree how we will measure success.",
			"A working prototype on your real data that you can judge before committing to the full build.",
			"We build it properly, connect it to your systems and add the logs and approvals it needs."
		],
		faq: [
			["Where should we start with AI?", "With one repetitive, high-volume job that already has clear rules, such as answering order questions or processing invoices. It is quick to measure, and it builds trust before you automate more."],
			["Is our data safe?", "Yes. We mask personal data before it reaches a model, use providers that do not train on your data, apply role-based access and keep an audit log. We can also run models inside your own cloud."],
			["What if the AI gets something wrong?", "We design for it. Important actions need approval, low-confidence answers go to a person, and we track accuracy after launch so problems show up early."],
			["Will it work with our current systems?", "Almost always. We connect through APIs, webhooks, databases or, when there is nothing else, the screens your team already uses."]
		],
		work: [
			"learnloop",
			"tablechat",
			"ledgerly"
		],
		prods: [
			"aichatbot",
			"aianalytics",
			"documentvault"
		],
		more: [
			"ai-agents",
			"ai-models",
			"web-portals"
		]
	},
	{
		id: "ai-agents",
		lede: "Custom AI agents that plan, use your tools and finish multi-step work, with approvals where they matter and a clear record of everything they did.",
		stmt: "An agent is only useful if it can finish the job.",
		p: ["We design agents around a real process: what triggers it, which tools it may use, when it must ask, and what done looks like.", "Each agent runs with limits on spend, access and actions, and every step is logged so you can see why it did what it did."],
		capsTitle: "Where agents take work off your team",
		caps: [
			{
				chip: "Plan and act",
				h: "Agents that plan and act",
				d: "Give an agent a goal and it breaks it into steps, calls the right tools and checks its own work before reporting back.",
				subs: [["Multi-step planning", "Research, draft, check and submit without someone babysitting every step."], ["Tool use", "Connects to your CRM, email, calendar, database and internal APIs."]],
				vis: flow("Lead follow-up agent", "New enquiry arrives", "Agent researches the company", "Drafts a personal reply", "Rep approves and sends")
			},
			{
				chip: "Work across tools",
				h: "Work across your tools",
				d: "Agents move between systems the way a person would, but faster, and without copy-paste errors.",
				subs: [["System integrations", "Read from one tool, decide, then update three others in one run."], ["Browser and document skills", "Handle portals and PDFs that have no API."]],
				vis: list("Agent run #1182", "Read the supplier email|Done", "Matched to purchase order|Done", "Updated stock in ERP|Done", "Asked finance to approve|Waiting")
			},
			{
				chip: "Keep a human in charge",
				h: "Keep a human in charge",
				d: "Approval steps, spending limits and escalation rules mean agents work freely on safe tasks and stop for the risky ones.",
				subs: [["Approval gates", "Anything over a limit or outside a rule waits for a person."], ["Full audit trail", "Every prompt, tool call and decision is stored and searchable."]],
				vis: chat("Approval request", "Agent wants to refund $240 to order #881.", "Reason: item arrived damaged, photo attached.", "Approve")
			},
			{
				chip: "Measure and improve",
				h: "Measure and improve",
				d: "We track completion rate, cost per task and error rate, then tune prompts, tools and rules as real usage teaches us more.",
				subs: [["Evaluation suites", "Regression tests so a change never quietly makes things worse."], ["Cost and speed tuning", "Right-size the model for each step."]],
				vis: bars("Tasks completed without help", M6, [
					52,
					61,
					68,
					74,
					81,
					87
				])
			}
		],
		paysTitle: "Where agents pay off first",
		pays: [
			"Sales reps spend hours researching and writing follow-ups",
			"Support tickets need the same lookups across several tools",
			"Back-office staff move data between systems all day",
			"Reports are assembled by hand every week",
			"Routine approvals sit in someone's inbox"
		],
		words: [
			"Planning",
			"Tools",
			"Memory",
			"Approvals",
			"Routing",
			"Browser",
			"Evals",
			"Audit",
			"Limits",
			"Handover"
		],
		teamNote: "Product thinkers, AI engineers and testers designing agents you can trust.",
		steps: [
			"Choose one process, list its tools and rules and decide where a person must approve.",
			"A thin agent that handles the happy path, tested on real cases from your team.",
			"Add tools, memory, limits and logging, then connect it to your live systems."
		],
		faq: [
			["How is an agent different from a chatbot?", "A chatbot answers. An agent acts: it plans several steps, uses your tools and completes a task, usually with an approval step before anything important."],
			["Can an agent spend money or delete things by mistake?", "Only if you let it. We set explicit permissions, spending caps and approval gates, and sensitive actions always ask first."],
			["Which tools can it connect to?", "Anything with an API, plus email, calendars, databases, spreadsheets and, when needed, web portals through a controlled browser."],
			["How do we know it is working?", "We give you a dashboard of completed tasks, errors, cost and time saved, along with a log of every run."]
		],
		work: [
			"fleetline",
			"hiretrack",
			"ledgerly"
		],
		prods: [
			"aichatbot",
			"documentvault",
			"aianalytics"
		],
		more: [
			"ai",
			"ai-models",
			"custom"
		]
	},
	{
		id: "ai-models",
		lede: "Bring GPT, Claude, Gemini and open-source models into your products and systems, with the right model for each job, sensible costs and proper safeguards.",
		stmt: "The model is the easy part. Making it reliable is the work.",
		p: ["We help you choose between hosted and self-hosted models, wire them into your product and add the retrieval, caching and monitoring that keep answers accurate and bills predictable.", "Our integrations are provider-agnostic, so you can switch models as better ones arrive without rebuilding."],
		capsTitle: "What we integrate and tune",
		caps: [
			{
				chip: "Pick the right model",
				h: "Pick the right model",
				d: "We test several models on your own examples and choose on quality, speed, privacy and price, not on hype.",
				subs: [["Model benchmarking", "Side-by-side results on your real tasks."], ["Hosted or self-hosted", "Cloud APIs, private deployments or open-source on your servers."]],
				vis: bars("Answer quality on your tests", [
					"Model A",
					"Model B",
					"Model C",
					"Open source",
					"Tuned"
				], [
					72,
					81,
					84,
					68,
					91
				])
			},
			{
				chip: "Ground it in your data",
				h: "Ground it in your data",
				d: "Retrieval pulls the right passages from your documents and databases so answers cite real sources instead of guessing.",
				subs: [["RAG pipelines", "Ingest, chunk, index and refresh your content."], ["Source citations", "Every answer links back to where it came from."]],
				vis: flow("Ask your documents", "Question comes in", "Search your content", "Model drafts an answer", "Sources attached")
			},
			{
				chip: "Control cost and speed",
				h: "Control cost and speed",
				d: "Caching, smaller models for simple steps and streaming responses keep the experience quick and the invoice in check.",
				subs: [["Smart routing", "Easy questions go to a cheap model, hard ones to a strong one."], ["Usage dashboards", "See cost by feature, team and customer."]],
				vis: bars("Monthly model cost, $", M6, [
					88,
					80,
					66,
					52,
					44,
					38
				])
			},
			{
				chip: "Keep it safe",
				h: "Keep it safe and compliant",
				d: "Personal data is masked, prompts are filtered and outputs are checked before they reach users.",
				subs: [["Privacy by design", "Redaction, regional hosting and no training on your data."], ["Output checks", "Policy filters, format validation and fallbacks."]],
				vis: list("Safety checks", "Personal data masked|On", "Prompt injection filter|On", "Output format validated|On", "Fallback if provider is down|Ready")
			}
		],
		paysTitle: "Where model integration pays off first",
		pays: [
			"You want AI inside your product but not a research team",
			"A demo works, but production answers are inconsistent",
			"Model bills are growing faster than usage",
			"Your documents are full of answers nobody can find",
			"Compliance needs to know where your data goes"
		],
		words: [
			"GPT",
			"Claude",
			"Gemini",
			"Llama",
			"RAG",
			"Embeddings",
			"Routing",
			"Caching",
			"Evals",
			"Privacy"
		],
		teamNote: "Engineers who have shipped model-powered features to real users.",
		steps: [
			"Define the task, collect real examples and set the quality bar.",
			"Compare models and prompts on your examples and prove the approach in a thin slice.",
			"Build retrieval, routing, caching and monitoring into your product."
		],
		faq: [
			["Which model should we use?", "It depends on the task. We test a shortlist on your own examples and pick on quality, cost, speed and privacy, and we keep the design flexible so you can switch later."],
			["Can we use our own documents?", "Yes. We index them for retrieval so the model answers from your content and shows its sources."],
			["Will our data train the model?", "Not with the setup we recommend. We use providers and settings that do not train on your data, or host models privately."],
			["How do you keep costs down?", "By routing simple steps to smaller models, caching repeated answers and trimming prompts, with dashboards so there are no surprises."]
		],
		work: [
			"learnloop",
			"ledgerly",
			"clinichub"
		],
		prods: [
			"aichatbot",
			"aianalytics",
			"documentvault"
		],
		more: [
			"ai",
			"ai-agents",
			"saas"
		]
	},
	{
		id: "web-portals",
		lede: "Customer, partner and staff portals with dashboards, roles and self-service, so people get what they need without calling or emailing your team.",
		stmt: "A good portal removes the phone call.",
		p: ["We start with the questions people keep asking your team, then build the screens that answer them: orders, invoices, documents, requests and reports.", "Everything is permission-based, fast on a phone and built to connect with the systems you already run."],
		capsTitle: "What we build into portals",
		caps: [
			{
				chip: "Self-service for customers",
				h: "Self-service for customers",
				d: "Customers track orders, download invoices, raise requests and update details themselves, any time of day.",
				subs: [["Customer accounts", "Orders, invoices, documents and history in one place."], ["Requests and tickets", "Raise, track and resolve with status updates."]],
				vis: list("Your orders", "#4421 Delivered|Today", "#4418 In transit|Tomorrow", "#4402 Invoice ready|Download", "#4397 Return requested|Review")
			},
			{
				chip: "Roles and permissions",
				h: "The right view for every role",
				d: "Partners, staff and managers each see only what they should, with approvals and activity logs built in.",
				subs: [["Role-based access", "Fine-grained permissions per team, branch or client."], ["Approvals", "Multi-step sign-off with a clear trail."]],
				vis: flow("Purchase request", "Staff submits", "Manager reviews", "Finance approves", "Vendor notified")
			},
			{
				chip: "Dashboards that answer",
				h: "Dashboards that answer questions",
				d: "Live numbers and exports replace the weekly spreadsheet, tailored to each role.",
				subs: [["Live reports", "Charts and tables that update as work happens."], ["Exports and alerts", "Excel, PDF and scheduled emails."]],
				vis: bars("Requests resolved", W6, [
					38,
					44,
					52,
					61,
					70,
					82
				])
			},
			{
				chip: "Connected to your systems",
				h: "Connected to your systems",
				d: "Portals read from and write to your ERP, CRM, accounting and payment tools so data lives in one place.",
				subs: [["Integrations", "APIs, webhooks and scheduled syncs."], ["Single sign-on", "Google, Microsoft or your own identity provider."]],
				vis: flow("Order sync", "Customer places order", "Portal records it", "ERP receives it", "Status flows back")
			}
		],
		paysTitle: "Where a portal pays off first",
		pays: [
			"Your team answers status questions all day",
			"Partners email you for documents and price lists",
			"Data is copied between spreadsheets and systems",
			"Approvals happen over chat and get lost",
			"Customers expect to help themselves"
		],
		words: [
			"Dashboards",
			"Roles",
			"Self-service",
			"Approvals",
			"Reports",
			"SSO",
			"Invoices",
			"Requests",
			"Alerts",
			"Search"
		],
		teamNote: "Designers and engineers who build portals people actually log in to.",
		steps: [
			"List the questions and tasks the portal must handle and who needs which view.",
			"Clickable screens for each role that you can test with real users.",
			"Build, integrate with your systems and migrate your data."
		],
		faq: [
			["Who is a portal for?", "Customers, distributors, suppliers, staff or all of them, each with their own permissions and views."],
			["Can it connect to our ERP or CRM?", "Yes. We integrate through APIs or scheduled syncs so there is one source of truth."],
			["Will it work on phones?", "Yes. Every portal is responsive, and we can add a mobile app later if you need one."],
			["Who hosts it?", "We can host it for you or deploy to your own cloud account, with backups and monitoring either way."]
		],
		work: [
			"fleetline",
			"clinichub",
			"schoolsphere"
		],
		prods: [
			"orderportal",
			"smartfacility",
			"documentvault"
		],
		more: [
			"custom",
			"erp",
			"saas"
		]
	},
	{
		id: "ecommerce",
		lede: "Online stores on Shopify, WooCommerce, Magento and more, or a custom cart, designed to turn visitors into customers and run smoothly behind the scenes.",
		stmt: "A store is a sales process, not a catalogue.",
		p: ["We choose the platform that fits your catalogue, team and budget, then design every step from product page to payment to reduce friction.", "We also connect stock, shipping, accounting and marketing tools so orders flow without manual work."],
		capsTitle: "What we build into stores",
		caps: [
			{
				chip: "Pages that sell",
				h: "Pages that sell",
				d: "Fast, clear product pages, filters and search that help people find and trust what they are buying.",
				subs: [["Product and collection design", "Galleries, size guides and reviews that answer doubts."], ["Search and filters", "Find the right item in a few taps."]],
				vis: bars("Add-to-cart rate, %", M6, [
					30,
					34,
					41,
					46,
					52,
					59
				])
			},
			{
				chip: "Checkout that converts",
				h: "Checkout that converts",
				d: "One-page checkout, wallets, local payment methods and saved details cut abandoned carts.",
				subs: [["Payments", "Cards, UPI, wallets, COD and buy-now-pay-later."], ["Cart recovery", "Automatic reminders for unfinished orders."]],
				vis: flow("Checkout", "Cart", "Delivery slot", "Pay", "Confirmation sent")
			},
			{
				chip: "Orders run themselves",
				h: "Orders that run themselves",
				d: "Stock, shipping labels, invoices and accounting update automatically when an order arrives.",
				subs: [["Inventory sync", "Stock stays right across channels."], ["Shipping and returns", "Couriers, labels, tracking and RMAs."]],
				vis: list("Order #8841", "Payment received|Done", "Stock reserved|Done", "Label printed|Done", "Customer notified|Done")
			},
			{
				chip: "Grow after launch",
				h: "Grow after launch",
				d: "SEO, analytics, email and ad tracking are set up from day one so you can see what works.",
				subs: [["Analytics and tracking", "Sales, funnels and campaigns in one view."], ["Subscriptions and loyalty", "Bring customers back."]],
				vis: bars("Repeat customers, %", M6, [
					14,
					17,
					21,
					26,
					31,
					38
				])
			}
		],
		paysTitle: "Where a better store pays off first",
		pays: [
			"Lots of visitors but few orders",
			"Customers abandon the cart at checkout",
			"Stock and orders are updated by hand",
			"Your site is slow on phones",
			"You sell on several channels with separate catalogues"
		],
		words: [
			"Shopify",
			"WooCommerce",
			"Magento",
			"Checkout",
			"Catalogue",
			"Payments",
			"Shipping",
			"SEO",
			"Subscriptions",
			"Loyalty"
		],
		teamNote: "Designers, developers and marketers who have launched stores of every size.",
		steps: [
			"Review your catalogue, customers and channels, then choose the right platform.",
			"Designs for the key pages and a working checkout you can test.",
			"Build, connect payments, shipping and accounting, and import your products."
		],
		faq: [
			["Which platform should I choose?", "Shopify is fastest to launch, WooCommerce is flexible and Magento suits large catalogues. We recommend based on your products and team, not our preference."],
			["Can you migrate my existing store?", "Yes. We move products, customers and order history and set up redirects to protect your search rankings."],
			["Can you add local payment and shipping options?", "Yes. We integrate regional gateways, wallets, COD and couriers."],
			["Do you support the store after launch?", "Yes. We offer monthly support for updates, fixes, speed and new features."]
		],
		work: [
			"aurum",
			"bloom",
			"nutribasket"
		],
		prods: [
			"retailpos",
			"bookingengine",
			"orderportal"
		],
		more: [
			"plugins",
			"marketing",
			"mobile-apps"
		]
	},
	{
		id: "mobile-apps",
		lede: "Native and cross-platform apps for iOS and Android, from first sketch to store launch and the updates that follow.",
		stmt: "A great app does one thing people open every day.",
		p: ["We shape the idea around the one journey that matters, design it for thumbs and small screens, then build and test on real devices.", "We handle store submission, analytics and crash monitoring so launch day is calm and the next release is easy."],
		capsTitle: "What goes into a mobile app",
		caps: [
			{
				chip: "Designed for thumbs",
				h: "Designed for thumbs",
				d: "Clear flows, fast screens and platform-native feel on iOS and Android.",
				subs: [["UX and prototyping", "Tappable prototypes before a line of code."], ["Accessibility", "Readable, reachable and screen-reader friendly."]],
				vis: flow("Onboarding", "Welcome", "Sign up", "Pick interests", "First win")
			},
			{
				chip: "Native or cross-platform",
				h: "Native or cross-platform",
				d: "We choose Swift, Kotlin or React Native on your budget, performance needs and roadmap.",
				subs: [["One codebase or two", "Honest trade-offs, not a default."], ["Offline and sync", "Works on weak networks and catches up later."]],
				vis: bars("Cold start time, ms", [
					"Old",
					"v1",
					"v2",
					"v3",
					"v4"
				], [
					88,
					64,
					48,
					36,
					28
				])
			},
			{
				chip: "Connected backend",
				h: "A backend that keeps up",
				d: "Accounts, push notifications, payments and real-time features run on a secure, scalable API.",
				subs: [["Push and in-app messaging", "Timely nudges users welcome."], ["Payments and subscriptions", "In-app purchases and gateways."]],
				vis: list("Notifications", "Order shipped|Sent", "Cart reminder|Scheduled", "Weekly summary|Scheduled", "New feature|Draft")
			},
			{
				chip: "Launch and learn",
				h: "Launch and keep learning",
				d: "Store listings, beta testing, analytics and crash reports help each release land better.",
				subs: [["Store submission", "Screenshots, listings and review handling."], ["Analytics and crash tracking", "See where users drop off."]],
				vis: bars("Weekly active users", W6, [
					20,
					31,
					44,
					58,
					71,
					86
				])
			}
		],
		paysTitle: "Where an app pays off first",
		pays: [
			"Customers come back often and want speed",
			"Your field team needs to work offline",
			"You want push notifications to bring people back",
			"A website alone feels clumsy on phones",
			"You sell subscriptions or bookings"
		],
		words: [
			"iOS",
			"Android",
			"React Native",
			"Offline",
			"Push",
			"Payments",
			"Maps",
			"Biometrics",
			"Analytics",
			"Stores"
		],
		teamNote: "Designers, mobile engineers and testers shipping to both stores.",
		steps: [
			"Define the core journey, audience and success metric.",
			"A tappable prototype tested with real users.",
			"Build, test on real devices and prepare store submission."
		],
		faq: [
			["Native or cross-platform?", "Cross-platform is faster and cheaper for most apps. Native wins for heavy graphics, deep device features or the best possible polish. We will tell you which fits."],
			["How long does an app take?", "A focused first version usually takes two to four months, depending on features and integrations."],
			["Do you publish to the stores?", "Yes. We prepare listings, handle submission and respond to review feedback."],
			["Can you update an existing app?", "Yes. We can audit, refactor and extend apps built by others."]
		],
		work: [
			"fitpulse",
			"ridenow",
			"pocketwise"
		],
		prods: [
			"gymmanager",
			"clinicdesk",
			"fleettracker"
		],
		more: [
			"web-portals",
			"games",
			"saas"
		]
	},
	{
		id: "games",
		lede: "Mobile, PC and web games, from first prototype to store launch and live updates, built to be fun in the first minute and the hundredth.",
		stmt: "Fun comes first. Everything else supports it.",
		p: ["We prototype the core loop early, playtest constantly and only then invest in art, content and polish.", "After launch we handle live events, balancing and updates so players have a reason to return."],
		capsTitle: "What goes into a game",
		caps: [
			{
				chip: "Prototype the fun",
				h: "Prototype the fun",
				d: "A playable core loop in weeks, so you can feel the game before committing to a full build.",
				subs: [["Game design", "Mechanics, progression and economy."], ["Rapid prototyping", "Playable builds you can test."]],
				vis: flow("Core loop", "Play", "Earn", "Upgrade", "Play harder")
			},
			{
				chip: "Art and sound",
				h: "Art, animation and sound",
				d: "2D and 3D art, animation, effects and music that give the game its own personality.",
				subs: [["Art direction", "Characters, worlds and UI."], ["Audio", "Music and effects that make it feel right."]],
				vis: list("Asset pipeline", "Characters|12 of 12", "Environments|6 of 8", "Animations|34 of 50", "Sound effects|40 of 60")
			},
			{
				chip: "Build and optimise",
				h: "Build and optimise",
				d: "Unity builds tuned for low-end phones, consoles and browsers, with smooth frame rates and small downloads.",
				subs: [["Unity development", "Mobile, PC, console and WebGL."], ["Multiplayer and leaderboards", "Co-op, ranked and social features."]],
				vis: bars("Frame rate, fps", [
					"Early",
					"Alpha",
					"Beta",
					"RC",
					"Live"
				], [
					34,
					42,
					51,
					57,
					60
				])
			},
			{
				chip: "Live operations",
				h: "Live operations",
				d: "Events, seasons, ads and in-app purchases tuned with real player data.",
				subs: [["Live events", "Seasonal content and daily quests."], ["Analytics and balancing", "Fix what players struggle with."]],
				vis: bars("Day-7 retention, %", M6, [
					14,
					17,
					21,
					25,
					29,
					34
				])
			}
		],
		paysTitle: "Where game development pays off first",
		pays: [
			"You have an idea but no playable version",
			"A prototype exists but is not fun yet",
			"Your game runs poorly on cheaper phones",
			"You need live events to keep players",
			"You want a branded game for a campaign"
		],
		words: [
			"Unity",
			"Prototype",
			"Levels",
			"Multiplayer",
			"Art",
			"Sound",
			"Events",
			"Economy",
			"Leaderboards",
			"Stores"
		],
		teamNote: "Game designers, artists and engineers who love playing as much as building.",
		steps: [
			"Define the core loop, audience and platform.",
			"A playable prototype tested with real players.",
			"Full production of content, art and tech, then store launch."
		],
		faq: [
			["Which engines do you use?", "Mostly Unity, which covers mobile, PC, console and web. We choose the engine that suits the game."],
			["Can you make a game from my idea?", "Yes. We help turn an idea into a playable prototype, then a full production plan."],
			["Do you handle monetisation?", "Yes. Ads, in-app purchases and subscriptions, designed so they do not spoil the fun."],
			["Do you support live updates?", "Yes. We run events, patches and balancing after launch."]
		],
		work: [
			"skyforge",
			"pixelpirates",
			"neonracer"
		],
		prods: [
			"vrgaming",
			"learningplatform",
			"hologuide"
		],
		more: [
			"ar-vr",
			"mobile-apps",
			"custom"
		]
	},
	{
		id: "ar-vr",
		lede: "Augmented and virtual reality for training, retail, property and events, experiences people can try on a headset, a phone or a browser.",
		stmt: "If it is easier to show than to explain, build it in 3D.",
		p: ["We pick the format that fits your audience: browser-based 3D for reach, phone AR for convenience, or headsets for full immersion.", "Content is built so you can update it yourself, and we measure how people use it."],
		capsTitle: "What we build in AR and VR",
		caps: [
			{
				chip: "Walk-through showrooms",
				h: "Walk-through showrooms and tours",
				d: "Let customers explore products, properties and venues before they visit or buy.",
				subs: [["Virtual tours", "360° tours with hotspots and floor plans."], ["3D product views", "Rotate, zoom and customise."]],
				vis: list("Tour hotspots", "Living room|Open", "Kitchen|Open", "Floor plan|Open", "Book a visit|Open")
			},
			{
				chip: "Training and simulation",
				h: "Training and simulation",
				d: "Practise safely in VR and measure how people perform, without the cost of real equipment.",
				subs: [["VR training", "Step-by-step scenarios with scoring."], ["Progress tracking", "See who completed what."]],
				vis: bars("Pass rate, %", W6, [
					48,
					56,
					63,
					72,
					80,
					91
				])
			},
			{
				chip: "AR on a phone",
				h: "AR on a phone",
				d: "Overlays and guides that appear on the real world through the camera, with no headset needed.",
				subs: [["Try-before-you-buy", "Place products in the room."], ["Guided overlays", "Step-by-step help on the real object."]],
				vis: flow("AR guide", "Scan the object", "See the overlay", "Follow the steps", "Mark complete")
			},
			{
				chip: "Events and campaigns",
				h: "Events and campaigns",
				d: "Branded experiences for launches, expos and campaigns that people share.",
				subs: [["Interactive installations", "Booth and showroom experiences."], ["Analytics", "Sessions, dwell time and enquiries."]],
				vis: bars("Sessions per day", [
					"Mon",
					"Tue",
					"Wed",
					"Thu",
					"Fri",
					"Sat"
				], [
					22,
					34,
					41,
					52,
					66,
					88
				])
			}
		],
		paysTitle: "Where AR and VR pay off first",
		pays: [
			"Customers cannot visit your property or venue in person",
			"Training is costly, risky or hard to repeat",
			"Products are better understood in 3D",
			"You want a standout experience at an event",
			"Remote teams need to learn together"
		],
		words: [
			"VR",
			"AR",
			"360°",
			"3D",
			"Unity",
			"Quest",
			"Hotspots",
			"Training",
			"Showroom",
			"WebXR"
		],
		teamNote: "3D artists, engineers and designers who build immersive work for real audiences.",
		steps: [
			"Choose the format and audience, and define what the experience must achieve.",
			"A rough interactive scene to test on the device your audience will use.",
			"Full build, optimisation and publishing to headsets, phones or the web."
		],
		faq: [
			["Do users need a headset?", "Not always. Many experiences work in a browser or on a phone, and we use headsets where full immersion is worth it."],
			["Which devices do you support?", "Meta Quest, other standalone headsets, iOS and Android AR, and WebXR in the browser."],
			["Can we update the content ourselves?", "Yes. We build simple tools so you can change scenes, text and media without a developer."],
			["How much does it cost?", "It depends on scope. A simple 360° tour is far cheaper than a full training simulation, and we will give you a clear estimate."]
		],
		work: [
			"orbitvr",
			"landmark",
			"neonracer"
		],
		prods: [
			"vrshowroom",
			"virtualtours",
			"hologuide"
		],
		more: [
			"games",
			"mobile-apps",
			"custom"
		]
	},
	{
		id: "marketing",
		lede: "Brand, search, paid, social, content and analytics run as one growth engine, with reporting you can read without a translator.",
		stmt: "Marketing works when every channel pulls in the same direction.",
		p: ["We start with your customers and numbers, choose the few channels that matter and run them together so each one helps the others.", "You get a simple monthly report that shows spend, leads, sales and what we will do next."],
		capsTitle: "What we run for you",
		caps: [
			{
				chip: "Search and content",
				h: "Search and content that compounds",
				d: "SEO and useful content bring steady, free traffic that keeps growing.",
				subs: [["SEO", "Technical fixes, keywords and links."], ["Content", "Articles and pages that answer real questions."]],
				vis: bars("Organic visits", M6, [
					20,
					28,
					39,
					52,
					68,
					90
				])
			},
			{
				chip: "Paid and social",
				h: "Paid and social that pay back",
				d: "Google, Meta and social campaigns tuned for cost per lead and return on spend.",
				subs: [["Paid search and social", "Creative, targeting and testing."], ["Conversion tracking", "Know which ad led to which sale."]],
				vis: bars("Cost per lead, $", M6, [
					48,
					42,
					35,
					29,
					24,
					19
				])
			},
			{
				chip: "Brand and creative",
				h: "Brand and creative that sticks",
				d: "Logos, guidelines, videos and social content that make you easy to recognise.",
				subs: [["Brand identity", "Logo, colours and voice."], ["Social content", "Posts, reels and campaigns."]],
				vis: list("This month's content", "Brand film|Editing", "Reel series|Scheduled", "Blog posts|Published", "Email campaign|Draft")
			},
			{
				chip: "Analytics you can read",
				h: "Analytics you can read",
				d: "One dashboard connects traffic, leads and revenue so decisions are quick.",
				subs: [["Dashboards", "Google Analytics, ads and CRM together."], ["Monthly reports", "Plain-language summaries."]],
				vis: flow("Lead journey", "Sees an ad", "Visits the site", "Enquires", "Becomes a customer")
			}
		],
		paysTitle: "Where marketing pays off first",
		pays: [
			"Your site gets little organic traffic",
			"Ad spend rises but leads do not",
			"You do not know which channel works",
			"Your brand looks different everywhere",
			"Reports are confusing or missing"
		],
		words: [
			"SEO",
			"Ads",
			"Content",
			"Social",
			"Brand",
			"Email",
			"Analytics",
			"Video",
			"Funnels",
			"Leads"
		],
		teamNote: "Strategists, designers, writers and analysts working to the same goals.",
		steps: [
			"Audit your channels, customers and numbers and set targets.",
			"Test messages and channels at small scale.",
			"Scale what works and report monthly."
		],
		faq: [
			["How soon will I see results?", "Paid campaigns can bring leads within weeks. SEO and content build over three to six months."],
			["Do you guarantee rankings?", "No honest agency can. We commit to the work, the targets and clear reporting."],
			["Can you work with our in-house team?", "Yes. We can lead, support or fill gaps."],
			["What does it cost?", "Retainers depend on channels and scope. We will propose a plan that fits your budget."]
		],
		work: [
			"aurum",
			"bloom",
			"harbor"
		],
		prods: [
			"leadflow",
			"aianalytics",
			"bookingengine"
		],
		more: [
			"ecommerce",
			"custom",
			"ai"
		]
	},
	{
		id: "custom",
		lede: "Software built the way you work, from a small internal tool to a full platform, designed with you and built to last.",
		stmt: "If off-the-shelf does not fit, build what does.",
		p: ["We start by learning how your team really works, then build only what is needed, in stages you can use early.", "You own the code, and we document it so anyone can maintain it."],
		capsTitle: "What we build",
		caps: [
			{
				chip: "Internal tools",
				h: "Internal tools that save hours",
				d: "Dashboards, admin panels and workflow apps that replace spreadsheets and email chains.",
				subs: [["Workflow apps", "Requests, approvals and tracking."], ["Admin panels", "Manage data without a developer."]],
				vis: list("Request queue", "Leave request|Approve", "Purchase order|Review", "Access request|Approve", "Expense claim|Review")
			},
			{
				chip: "Customer-facing platforms",
				h: "Customer-facing platforms",
				d: "Products your customers use, with accounts, payments and a polished experience.",
				subs: [["Web platforms", "Fast, secure and scalable."], ["Payments and accounts", "Sign-up, billing and roles."]],
				vis: bars("Active users", W6, [
					30,
					41,
					55,
					66,
					79,
					94
				])
			},
			{
				chip: "Integrations",
				h: "Integrations and data",
				d: "Connect the tools you already use and keep data clean and in one place.",
				subs: [["APIs", "Build and consume them."], ["Data migration", "Move safely from legacy systems."]],
				vis: flow("Data sync", "Source system", "Clean and map", "Your platform", "Reports")
			},
			{
				chip: "Modernisation",
				h: "Modernise legacy systems",
				d: "Rebuild or wrap old software so it is faster, safer and easier to change.",
				subs: [["Refactoring", "Pay down technical debt."], ["Cloud move", "Host reliably and cost-effectively."]],
				vis: bars("Page load time, ms", [
					"Old",
					"Step 1",
					"Step 2",
					"Step 3",
					"Now"
				], [
					90,
					70,
					52,
					38,
					24
				])
			}
		],
		paysTitle: "Where custom software pays off first",
		pays: [
			"Your team works around a tool that does not fit",
			"Spreadsheets run critical processes",
			"Systems do not talk to each other",
			"A legacy app is slow and risky to change",
			"You have a product idea that needs building"
		],
		words: [
			"Platforms",
			"APIs",
			"Dashboards",
			"Cloud",
			"Security",
			"Workflows",
			"Integrations",
			"Mobile",
			"Testing",
			"Support"
		],
		teamNote: "Analysts, designers, developers and testers who stay with you after launch.",
		steps: [
			"Map your process, users and priorities and agree a scope.",
			"A clickable prototype or thin working slice.",
			"Build in stages, release early and migrate your data."
		],
		faq: [
			["Do I own the code?", "Yes. You own the code and we hand over documentation."],
			["How do you price projects?", "Fixed price for clear scopes, or monthly teams for evolving ones."],
			["Can we start small?", "Yes. Most clients begin with one tool or one stage and grow from there."],
			["Do you maintain it afterwards?", "Yes, if you want. Support plans cover fixes, updates and new features."]
		],
		work: [
			"fleetline",
			"hiretrack",
			"ledgerly"
		],
		prods: [
			"fieldservice",
			"assettracker",
			"propertymanager"
		],
		more: [
			"erp",
			"saas",
			"web-portals"
		]
	},
	{
		id: "plugins",
		lede: "Plugins and apps that extend WordPress, Shopify, Magento and Wix, so the platform you already use can do exactly what your business needs.",
		stmt: "Do not change your platform. Extend it.",
		p: ["We build clean, well-tested plugins that follow each platform's standards, so updates do not break them.", "We can build a private plugin for your store or a public one for the marketplace."],
		capsTitle: "What we build",
		caps: [
			{
				chip: "WordPress and WooCommerce",
				h: "WordPress and WooCommerce",
				d: "Custom plugins, blocks and integrations that stay fast and update-safe.",
				subs: [["Custom plugins", "Features built to your spec."], ["Performance", "Light on queries and load time."]],
				vis: list("Plugin features", "Custom checkout fields|Done", "Delivery date picker|Done", "ERP sync|Done", "Admin report|Testing")
			},
			{
				chip: "Shopify apps",
				h: "Shopify apps and themes",
				d: "Public and custom apps, theme sections and checkout extensions.",
				subs: [["Custom apps", "Private apps for your store."], ["Theme work", "Sections and features that fit your brand."]],
				vis: flow("Order app", "Order placed", "App checks rules", "ERP updated", "Customer notified")
			},
			{
				chip: "Magento and Wix",
				h: "Magento and Wix extensions",
				d: "Modules and Velo code that add features without hacking the core.",
				subs: [["Magento modules", "Catalogue, pricing and checkout logic."], ["Wix Velo", "Custom pages and integrations."]],
				vis: bars("Install growth", M6, [
					10,
					18,
					29,
					42,
					58,
					78
				])
			},
			{
				chip: "Marketplace-ready",
				h: "Marketplace-ready",
				d: "Billing, onboarding, docs and support so your plugin is ready to sell.",
				subs: [["Listing and review", "Store submission handled."], ["Updates and support", "Compatibility with new versions."]],
				vis: list("Release checklist", "Security review|Passed", "Compatibility tests|Passed", "Docs and onboarding|Ready", "Store listing|Submitted")
			}
		],
		paysTitle: "Where a plugin pays off first",
		pays: [
			"A feature you need does not exist",
			"Several plugins clash or slow the site",
			"You must connect the store to another system",
			"You want to sell your own app",
			"An old plugin is unsupported"
		],
		words: [
			"WordPress",
			"WooCommerce",
			"Shopify",
			"Magento",
			"Wix",
			"Blocks",
			"Hooks",
			"APIs",
			"Themes",
			"Updates"
		],
		teamNote: "Platform specialists who know each marketplace's rules.",
		steps: [
			"Define the feature and check what already exists.",
			"A working proof on a staging site.",
			"Build, test across versions and release."
		],
		faq: [
			["Why not use an existing plugin?", "If one fits, we will say so. Custom plugins make sense when you need specific behaviour or fewer moving parts."],
			["Will updates break it?", "We follow platform standards and test against new versions."],
			["Can you publish it to the marketplace?", "Yes. We prepare, submit and support public plugins."],
			["Who owns it?", "You do."]
		],
		work: [
			"bloom",
			"threadwell",
			"brewlab"
		],
		prods: [
			"bookingengine",
			"orderportal",
			"retailpos"
		],
		more: [
			"ecommerce",
			"custom",
			"web-portals"
		]
	},
	{
		id: "erp",
		lede: "Enterprise resource planning built for your business, covering finance, stock, sales, people and reports in one system at a price you can afford.",
		stmt: "One system, one version of the truth.",
		p: ["We map your processes, then build only the modules you need, so you are not paying for a giant suite you will never use.", "Modules can be added over time, and everything shares the same data."],
		capsTitle: "What an ERP covers",
		caps: [
			{
				chip: "Finance and accounting",
				h: "Finance and accounting",
				d: "Invoices, payments, tax and books that stay accurate because they are fed by the rest of the business.",
				subs: [["Billing and tax", "GST-ready invoices and filings."], ["Accounts", "Ledgers, expenses and reconciliation."]],
				vis: bars("Cash collected, lakh", M6, [
					8,
					11,
					14,
					17,
					22,
					28
				])
			},
			{
				chip: "Stock and purchasing",
				h: "Stock and purchasing",
				d: "Know what you have, what is on order and what to reorder, across warehouses.",
				subs: [["Inventory", "Batches, barcodes and transfers."], ["Purchasing", "Orders, receipts and vendor bills."]],
				vis: flow("Purchase to stock", "Reorder alert", "Purchase order", "Goods received", "Stock updated")
			},
			{
				chip: "Sales and customers",
				h: "Sales and customers",
				d: "Quotes, orders, deliveries and customer history in one flow.",
				subs: [["Sales orders", "Quote to cash."], ["CRM", "Contacts and follow-ups."]],
				vis: list("Sales pipeline", "Quote sent|12", "Order confirmed|8", "Delivered|21", "Invoice paid|34")
			},
			{
				chip: "People and reports",
				h: "People and reports",
				d: "Attendance, payroll and management dashboards that update live.",
				subs: [["HR and payroll", "Attendance, leave and salary."], ["Management reports", "Profit, stock and performance."]],
				vis: bars("Profit by month, lakh", M6, [
					5,
					6,
					8,
					9,
					12,
					15
				])
			}
		],
		paysTitle: "Where an ERP pays off first",
		pays: [
			"Data lives in many spreadsheets",
			"Month-end close takes days",
			"Stock counts never match",
			"Teams cannot see each other's numbers",
			"Off-the-shelf ERP is too expensive or rigid"
		],
		words: [
			"Finance",
			"Inventory",
			"Sales",
			"Purchasing",
			"HR",
			"Payroll",
			"Reports",
			"Tax",
			"Multi-branch",
			"Approvals"
		],
		teamNote: "Business analysts and engineers who understand how companies run.",
		steps: [
			"Map your processes and choose the modules to build first.",
			"A working core module that your team tries on real data.",
			"Roll out module by module, train users and migrate data."
		],
		faq: [
			["Is it cheaper than a big-brand ERP?", "Usually yes, because you only build what you need and avoid per-seat licences."],
			["Can it grow with us?", "Yes. New modules, branches and users can be added."],
			["Can you migrate our old data?", "Yes. We clean and import it with checks."],
			["Do you train our team?", "Yes. Training and documentation are part of the rollout."]
		],
		work: [
			"ledgerly",
			"schoolsphere",
			"fleetline"
		],
		prods: [
			"stockpilot",
			"invoicehub",
			"peopledesk"
		],
		more: [
			"custom",
			"web-portals",
			"saas"
		]
	},
	{
		id: "saas",
		lede: "Subscription software built to launch, sell and scale, from MVP to multi-tenant platform with billing, onboarding and analytics included.",
		stmt: "Ship the smallest product that can earn its first customers.",
		p: ["We help you cut the idea down to an MVP, build it fast and add accounts, billing and analytics from day one.", "The architecture is ready to grow into multiple customers, plans and regions."],
		capsTitle: "What goes into a SaaS product",
		caps: [
			{
				chip: "MVP in weeks",
				h: "An MVP in weeks, not quarters",
				d: "Focus on the one job your customer pays for, then launch and learn.",
				subs: [["Product scoping", "Cut to what matters."], ["Fast build", "Working software early."]],
				vis: flow("MVP path", "Idea", "Prototype", "First customers", "Iterate")
			},
			{
				chip: "Accounts and billing",
				h: "Accounts, plans and billing",
				d: "Sign-up, teams, roles, trials, subscriptions and invoices that work from launch.",
				subs: [["Subscriptions", "Monthly, yearly and usage-based."], ["Teams and roles", "Invite users and set permissions."]],
				vis: list("Plans", "Starter|$19", "Growth|$59", "Scale|$149", "Enterprise|Talk")
			},
			{
				chip: "Multi-tenant platform",
				h: "Built to scale",
				d: "Secure data separation, background jobs, caching and monitoring so growth does not break things.",
				subs: [["Multi-tenancy", "Many customers, one platform."], ["Reliability", "Backups, alerts and uptime."]],
				vis: bars("Customers", M6, [
					4,
					9,
					17,
					29,
					46,
					71
				])
			},
			{
				chip: "Analytics and growth",
				h: "Analytics and growth",
				d: "Product analytics, onboarding flows and admin tools to understand and grow usage.",
				subs: [["Product analytics", "Activation, retention and churn."], ["Onboarding", "Get users to value faster."]],
				vis: bars("Trial to paid, %", M6, [
					6,
					8,
					11,
					14,
					17,
					21
				])
			}
		],
		paysTitle: "Where SaaS development pays off first",
		pays: [
			"You have a product idea but no technical team",
			"A prototype needs to become a real product",
			"You sell a service that could be software",
			"Billing and accounts are held together by hand",
			"Your product struggles as customers grow"
		],
		words: [
			"MVP",
			"Billing",
			"Multi-tenant",
			"Teams",
			"Plans",
			"Analytics",
			"Onboarding",
			"API",
			"Admin",
			"Scale"
		],
		teamNote: "Product managers, designers and engineers who have launched SaaS before.",
		steps: [
			"Define the customer, the problem and the smallest product that solves it.",
			"A prototype in front of real customers.",
			"Build the MVP with accounts, billing and analytics."
		],
		faq: [
			["How long does an MVP take?", "Typically eight to sixteen weeks, depending on scope."],
			["Can you help with the idea?", "Yes. We run product workshops to sharpen scope and priorities."],
			["Do I own the product?", "Yes. You own the code and IP."],
			["Can it handle growth?", "Yes. We design for multiple tenants and add capacity as you grow."]
		],
		work: [
			"ledgerly",
			"hiretrack",
			"learnloop"
		],
		prods: [
			"leadflow",
			"peopledesk",
			"learningplatform"
		],
		more: [
			"custom",
			"ai-models",
			"web-portals"
		]
	}
];
var getService = (id) => DETAILS.find((d) => d.id === id) ?? null;
// src/data/blog.ts
var BLOG_CATS = [
	"AI",
	"Web & apps",
	"Ecommerce",
	"Marketing",
	"Product"
];
var posts = [
	{
		slug: "start-ai-with-one-workflow",
		cat: "AI",
		tone: "#c9b7ff",
		service: "ai",
		date: "2026-10-21",
		read: 6,
		title: "Start your AI project with one workflow, not a model",
		excerpt: "The teams that get value from AI pick one boring, high-volume job first. Here is how to find yours.",
		body: [
			{
				h: "Why starting with the model goes wrong",
				p: ["Most stalled AI projects began with a question like which model should we use. The better question is where your team loses the most hours to work that follows rules.", "A workflow gives you a baseline, a clear owner and a number to beat. A model gives you a demo."]
			},
			{
				h: "How to spot a good first workflow",
				p: ["Look for work that is repeated daily, follows clear rules and has an obvious right answer most of the time."],
				ul: [
					"Answering the same customer questions",
					"Re-typing data from PDFs or emails",
					"Sorting tickets, leads or applications",
					"Building the same weekly report"
				]
			},
			{
				h: "Measure before you automate",
				p: ["Time a handful of real cases by hand. Write down accuracy, hours and cost. After launch you compare against those numbers, not against a feeling.", "Keep a person in the loop for anything involving money or customers until the numbers earn your trust."]
			}
		]
	},
	{
		slug: "shopify-or-woocommerce",
		cat: "Ecommerce",
		tone: "#ffd764",
		service: "ecommerce",
		date: "2026-10-08",
		read: 5,
		title: "Shopify, WooCommerce or custom: how to choose in 2026",
		excerpt: "A plain comparison of speed, cost and flexibility, based on stores we have launched.",
		body: [
			{
				h: "Start with your catalogue and your team",
				p: ["A store with a few dozen products and no developer is a different problem from a store with thousands of variants and an ERP."]
			},
			{
				h: "When Shopify wins",
				p: ["You want to launch quickly, accept payments reliably and not think about servers. Apps cover most needs, and the trade-off is monthly fees and less control over checkout."]
			},
			{
				h: "When WooCommerce or custom wins",
				p: ["You need unusual pricing, deep integrations or full ownership of the code. You pay for that flexibility with more setup and maintenance."],
				ul: [
					"Complex B2B price lists",
					"Custom order flows",
					"Heavy ERP or POS integration"
				]
			},
			{
				h: "Our rule of thumb",
				p: ["Choose the simplest platform that can do what you need for the next two years, and design the data so you can move later."]
			}
		]
	},
	{
		slug: "what-a-portal-should-answer",
		cat: "Web & apps",
		tone: "#b8f36b",
		service: "web-portals",
		date: "2026-09-24",
		read: 5,
		title: "Five questions every customer portal should answer",
		excerpt: "If your team still answers these by phone, your portal is not finished.",
		body: [
			{
				h: "Where is my order?",
				p: ["Status and tracking, without logging a ticket."]
			},
			{
				h: "Where is my invoice?",
				p: ["Every invoice and receipt, searchable and downloadable."]
			},
			{
				h: "What do I owe?",
				p: ["Balances, due dates and a way to pay."]
			},
			{
				h: "Can you change this for me?",
				p: ["Addresses, contacts and plans that the customer can edit directly, with changes logged."]
			},
			{
				h: "Who do I talk to?",
				p: ["A clear route to a person when self-service is not enough, with the context attached."]
			}
		]
	},
	{
		slug: "mobile-app-first-version",
		cat: "Web & apps",
		tone: "#ffb8c6",
		service: "mobile-apps",
		date: "2026-09-10",
		read: 4,
		title: "What belongs in the first version of a mobile app",
		excerpt: "Cut it down to the one journey people will open the app for, then add the rest.",
		body: [
			{
				h: "Pick one journey",
				p: ["Booking, ordering, tracking or learning: choose the single task your users repeat and make it excellent."]
			},
			{
				h: "What can wait",
				p: ["Social features, deep settings and rare edge cases can ship in version two once real usage tells you what matters."],
				ul: [
					"Profiles with every field",
					"Multiple languages on day one",
					"Complex admin screens"
				]
			},
			{
				h: "Plan the launch",
				p: ["Allow time for store review, beta testers and analytics, so your first release teaches you something."]
			}
		]
	},
	{
		slug: "marketing-reports-you-can-read",
		cat: "Marketing",
		tone: "#a9dcff",
		service: "marketing",
		date: "2026-08-27",
		read: 4,
		title: "Marketing reports you can actually read",
		excerpt: "Spend, leads, sales and next steps. Everything else is decoration.",
		body: [
			{
				h: "Start with money in, money out",
				p: ["How much did you spend, how many leads did it bring and how many became customers? Put those three numbers at the top."]
			},
			{
				h: "Explain changes in one sentence",
				p: ["Every number that moved needs a short reason and a decision: keep, fix or stop."]
			},
			{
				h: "End with the plan",
				p: ["The last section should say what happens next month and what we need from you."]
			}
		]
	},
	{
		slug: "saas-mvp-checklist",
		cat: "Product",
		tone: "#ffb59e",
		service: "saas",
		date: "2026-08-12",
		read: 7,
		title: "A SaaS MVP checklist for founders",
		excerpt: "The accounts, billing and analytics you need before your first paying customer.",
		body: [
			{
				h: "The product",
				p: ["One job, done well. If you cannot describe it in a sentence, the scope is still too big."]
			},
			{
				h: "The plumbing",
				p: ["Customers will not wait for you to add the basics later."],
				ul: [
					"Sign-up, login and password reset",
					"Teams and roles",
					"Subscriptions and invoices",
					"Email notifications",
					"Backups and monitoring"
				]
			},
			{
				h: "The learning loop",
				p: ["Add product analytics from day one so you can see activation and drop-off, and talk to your first ten customers."]
			}
		]
	},
	{
		slug: "when-to-build-custom-software",
		cat: "Product",
		tone: "#9eebd2",
		service: "custom",
		date: "2026-07-30",
		read: 5,
		title: "When custom software beats off-the-shelf",
		excerpt: "Three signs that you have outgrown spreadsheets and generic tools.",
		body: [
			{
				h: "Your process is your advantage",
				p: ["If how you work is what makes you better than competitors, forcing it into a generic tool removes the edge."]
			},
			{
				h: "Your tools do not talk to each other",
				p: ["When staff copy data between systems all day, integration or a purpose-built tool pays for itself quickly."]
			},
			{
				h: "Costs scale with headcount",
				p: ["Per-seat pricing can get expensive. An owned system has a build cost but a flatter running cost."]
			}
		]
	}
];
var getPost = (slug) => posts.find((p) => p.slug === slug) ?? null;
var fmtDate = (d) => (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("en-GB", {
	day: "numeric",
	month: "short",
	year: "numeric"
});
// src/router.ts
var PAGES = {
	"/about": "about",
	"/products": "products",
	"/work": "work",
	"/services": "services",
	"/careers": "careers",
	"/start": "start",
	"/urgent": "urgent",
	"/blog": "blog",
	"/privacy": "legal",
	"/terms": "legal",
	"/cookies": "legal",
	"/lite": "lite"
};
var norm$1 = (path) => path.replace(/\/+$/, "");
var productIdOf = (path) => {
	const m = norm$1(path).match(/^\/products\/([^/]+)$/);
	return m ? decodeURIComponent(m[1]) : null;
};
var serviceIdOf = (path) => {
	const m = norm$1(path).match(/^\/services\/([^/]+)$/);
	return m ? decodeURIComponent(m[1]) : null;
};
var postSlugOf = (path) => {
	const m = norm$1(path).match(/^\/blog\/([^/]+)$/);
	return m ? decodeURIComponent(m[1]) : null;
};
var postHref = (slug) => `/blog/${slug}`;
var serviceHref = (id) => `/services/${id}`;
var productHref = (id) => `/products/${id}`;
var toRoute = (path) => {
	const id = productIdOf(path);
	if (id) return catalog.some((p) => p.id === id) ? "product" : "products";
	const sid = serviceIdOf(path);
	if (sid) return DETAILS.some((d) => d.id === sid) ? "service" : "services";
	const slug = postSlugOf(path);
	if (slug) return posts.some((p) => p.slug === slug) ? "post" : "notfound";
	const n = norm$1(path);
	return PAGES[n] ?? (n === "" ? "home" : "notfound");
};
var isKnown = (path) => norm$1(path) === "" || norm$1(path) in PAGES || productIdOf(path) !== null || serviceIdOf(path) !== null || postSlugOf(path) !== null;
var LOCAL_ON_ABOUT = ["#contact", "#locations"];
var hrefFor = (href, route) => route !== "home" && href.startsWith("#") && !LOCAL_ON_ABOUT.includes(href) ? `/${href}` : href;
function navigate(path) {
	window.location.assign(path);
}
function useRouter() {
	const server = useContext(CmsContext);
	const [path, setPath] = useState(() => norm$1(typeof location === "undefined" ? server.path : location.pathname));
	useEffect(() => {
		const sync = () => setPath(norm$1(location.pathname));
		const onClick = (e) => {
			if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
			const a = e.target?.closest("a[href]");
			if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
			const url = new URL(a.href, location.href);
			if (url.origin !== location.origin) return;
			if (!isKnown(url.pathname)) return;
			if (url.pathname === location.pathname && url.hash) return;
		};
		window.addEventListener("popstate", sync);
		document.addEventListener("click", onClick);
		return () => {
			window.removeEventListener("popstate", sync);
			document.removeEventListener("click", onClick);
		};
	}, []);
	return {
		route: toRoute(path),
		path
	};
}
// src/components/Hero.tsx
var PROMPTS = [
	"I want an online store for my brand",
	"Can you build an AI chatbot for support?",
	"We need a mobile app for our customers",
	"Our website is slow, can you fix it?",
	"I'd like a custom CRM for my team",
	"Can you automate our manual reports?",
	"We want to launch a booking platform",
	"Help me get more leads online"
];
var CHIPS = [
	"Online store",
	"AI chatbot",
	"Business website",
	"Mobile app",
	"Game",
	"Marketing",
	"Build my quote",
	"Urgent fix"
];
var goToContact = (text) => {
	try {
		sessionStorage.setItem("project-idea", text);
	} catch {}
	document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
};
function Hero() {
	const [idea, setIdea] = useState("");
	const submit = (event) => {
		event.preventDefault();
		goToContact(idea || PROMPTS[0]);
	};
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "hero",
		cmsTag: "section",
		cmsSource: "components/Hero.tsx:1",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/Hero.tsx:2"
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--two",
				"data-parallax": "-0.1",
				cmsTag: "div",
				cmsSource: "components/Hero.tsx:3"
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "hero-sticker hero-sticker--top",
				"data-parallax": "0.08",
				cmsTag: "div",
				cmsSource: "components/Hero.tsx:4",
				children: [/* @__PURE__ */ jsx(Sparkles$1, { size: 20 }), " 1,000+ projects shipped"]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "hero-inner",
				cmsTag: "div",
				cmsSource: "components/Hero.tsx:5",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/Hero.tsx:6",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/Hero.tsx:7"
						}), " Software, AI and digital engineering"]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						"aria-label": "What do you want to build?",
						cmsTag: "h1",
						cmsSource: "components/Hero.tsx:8",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/Hero.tsx:9",
							children: [
								/* @__PURE__ */ jsx(SplitWords, { text: "What do you want" }),
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx(SplitWords, {
									text: "to",
									start: 3
								}),
								/* @__PURE__ */ jsx(SplitWords, {
									text: "build?",
									start: 4,
									em: true
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "hero-copy",
						cmsTag: "p",
						cmsSource: "components/Hero.tsx:10",
						children: "Websites, apps, AI and cloud engineering built to scale — from one team, so you don't have to manage three agencies."
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "idea-form",
						onSubmit: submit,
						cmsTag: "form",
						cmsSource: "components/Hero.tsx:11",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							htmlFor: "project-idea",
							cmsTag: "label",
							cmsSource: "components/Hero.tsx:12",
							children: "Tell us what you're building"
						}), /* @__PURE__ */ jsxs(CmsElement, {
							className: "idea-field",
							cmsTag: "div",
							cmsSource: "components/Hero.tsx:13",
							children: [/* @__PURE__ */ jsx(TypedInput, {
								id: "project-idea",
								value: idea,
								onChange: setIdea,
								phrases: PROMPTS
							}), /* @__PURE__ */ jsxs(Button3D, {
								type: "submit",
								tone: "mint",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "span",
									cmsSource: "components/Hero.tsx:14",
									children: "Let's talk"
								}), /* @__PURE__ */ jsx(ArrowRight$1, { size: 20 })]
							})]
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "hero-chips",
						"aria-label": "Popular project types",
						cmsTag: "div",
						cmsSource: "components/Hero.tsx:15",
						children: CHIPS.map((chip) => /* @__PURE__ */ jsx(CmsElement, {
							type: "button",
							className: chip === "Urgent fix" ? "is-urgent" : void 0,
							onClick: () => {
								if (chip === "Urgent fix") return navigate("/urgent");
								setIdea(chip);
								goToContact(chip);
							},
							cmsTag: "button",
							cmsSource: "components/Hero.tsx:16",
							children: chip
						}, chip))
					})
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "scroll-cue",
				href: "#services",
				cmsTag: "a",
				cmsSource: "components/Hero.tsx:17",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/Hero.tsx:18",
					children: "Scroll for the good stuff"
				}), /* @__PURE__ */ jsx(CmsElement, {
					className: "scroll-line",
					cmsTag: "span",
					cmsSource: "components/Hero.tsx:19"
				})]
			})
		]
	});
}
// src/components/TechStrip.tsx
var STACK = [
	["Shopify", SiShopify],
	["WordPress", SiWordpress],
	["Laravel", SiLaravel],
	["React", SiReact],
	["Next.js", SiNextdotjs],
	["Node.js", SiNodedotjs],
	["Flutter", SiFlutter],
	["Android", SiAndroid],
	["iOS", SiApple],
	["Python", SiPython],
	["Unity", SiUnity]
];
function TechStrip() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "social-strip",
		"aria-label": "Technologies we build with",
		cmsTag: "section",
		cmsSource: "components/TechStrip.tsx:1",
		children: [/* @__PURE__ */ jsx(CmsElement, {
			cmsTag: "span",
			cmsSource: "components/TechStrip.tsx:2",
			children: "We build with"
		}), /* @__PURE__ */ jsx(CmsElement, {
			className: "logos",
			cmsTag: "div",
			cmsSource: "components/TechStrip.tsx:3",
			children: /* @__PURE__ */ jsx(CmsElement, {
				className: "logos-track",
				cmsTag: "div",
				cmsSource: "components/TechStrip.tsx:4",
				children: [0, 1].map((copy) => /* @__PURE__ */ jsx(CmsElement, {
					className: "logos-group",
					"aria-hidden": copy === 1,
					cmsTag: "div",
					cmsSource: "components/TechStrip.tsx:5",
					children: STACK.map(([name, Icon]) => /* @__PURE__ */ jsxs(CmsElement, {
						className: "tech",
						cmsTag: "b",
						cmsSource: "components/TechStrip.tsx:6",
						children: [
							/* @__PURE__ */ jsx(Icon, {
								size: 20,
								"aria-hidden": true
							}),
							" ",
							name
						]
					}, name))
				}, copy))
			})
		})]
	});
}
// src/data/photos.ts
var photos = Object.fromEntries([
	{
		"key": "team",
		"id": 7643742,
		"author": "MART PRODUCTION",
		"source": "https://www.pexels.com/photo/a-team-looking-at-a-laptop-and-collaborating-7643742/",
		"download": "https://images.pexels.com/photos/7643742/pexels-photo-7643742.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/team.webp",
		"alt": "Professionals collaborating around a laptop",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "collaboration",
		"id": 7693730,
		"author": "Yan Krukau",
		"source": "https://www.pexels.com/photo/group-of-men-and-women-looking-at-a-laptop-and-working-together-7693730/",
		"download": "https://images.pexels.com/photos/7693730/pexels-photo-7693730.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/collaboration.webp",
		"alt": "Colleagues working together around a laptop",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "code",
		"id": 5926382,
		"author": "Sora Shimazaki",
		"source": "https://www.pexels.com/photo/crop-faceless-developer-working-on-software-code-on-laptop-5926382/",
		"download": "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/code.webp",
		"alt": "Developer typing software code on a laptop",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "cloud",
		"id": 5480781,
		"author": "Brett Sayles",
		"source": "https://www.pexels.com/photo/server-racks-on-data-center-5480781/",
		"download": "https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/cloud.webp",
		"alt": "Server racks and network cables in a data center",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 958
	},
	{
		"key": "analytics",
		"id": 669623,
		"author": "Lukas Blazek",
		"source": "https://www.pexels.com/photo/paper-beside-macbook-669623/",
		"download": "https://images.pexels.com/photos/669623/pexels-photo-669623.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/analytics.webp",
		"alt": "Laptop and business analytics reports on a desk",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 954
	},
	{
		"key": "jewelry",
		"id": 29502933,
		"author": "Yusuf Çelik",
		"source": "https://www.pexels.com/photo/elegant-gold-jewelry-necklace-and-ring-set-29502933/",
		"download": "https://images.pexels.com/photos/29502933/pexels-photo-29502933.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/jewelry.webp",
		"alt": "Gold necklaces and a ring displayed on a light surface",
		"license": "https://www.pexels.com/license/",
		"width": 960,
		"height": 960
	},
	{
		"key": "logistics",
		"id": 4487383,
		"author": "Tiger Lily",
		"source": "https://www.pexels.com/photo/workers-walking-along-aisle-in-warehouse-4487383/",
		"download": "https://images.pexels.com/photos/4487383/pexels-photo-4487383.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/logistics.webp",
		"alt": "Warehouse colleagues handling a package between stocked shelves",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "education",
		"id": 5537527,
		"author": "Zen Chung",
		"source": "https://www.pexels.com/photo/crop-multiethnic-students-with-laptop-studying-at-table-5537527/",
		"download": "https://images.pexels.com/photos/5537527/pexels-photo-5537527.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/education.webp",
		"alt": "Student using a laptop with notebooks for study",
		"license": "https://www.pexels.com/license/",
		"width": 1381,
		"height": 960
	},
	{
		"key": "gaming",
		"id": 5207523,
		"author": "Kaboompics",
		"source": "https://www.pexels.com/photo/person-holding-black-game-controller-5207523/",
		"download": "https://images.pexels.com/photos/5207523/pexels-photo-5207523.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/gaming.webp",
		"alt": "Hands holding a gaming controller",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "vr",
		"id": 7776217,
		"author": "Pavel Danilyuk",
		"source": "https://www.pexels.com/photo/a-man-wearing-a-vr-headset-7776217/",
		"download": "https://images.pexels.com/photos/7776217/pexels-photo-7776217.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/vr.webp",
		"alt": "Person using a virtual reality headset and headphones",
		"license": "https://www.pexels.com/license/",
		"width": 1439,
		"height": 960
	},
	{
		"key": "property",
		"id": 13752348,
		"author": "Gustavo Galeano Maz",
		"source": "https://www.pexels.com/photo/exterior-of-a-modern-villa-13752348/",
		"download": "https://images.pexels.com/photos/13752348/pexels-photo-13752348.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/property.webp",
		"alt": "Modern villa exterior illuminated at dusk",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "flowers",
		"id": 8116731,
		"author": "Bridgette Lynn",
		"source": "https://www.pexels.com/photo/a-bouquet-of-colorful-flowers-8116731/",
		"download": "https://images.pexels.com/photos/8116731/pexels-photo-8116731.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/flowers.webp",
		"alt": "Bouquet of colorful fresh flowers",
		"license": "https://www.pexels.com/license/",
		"width": 720,
		"height": 960
	},
	{
		"key": "grocery",
		"id": 8496228,
		"author": "Md Yeahia Bhuiyan",
		"source": "https://www.pexels.com/photo/fresh-vegetables-on-sale-8496228/",
		"download": "https://images.pexels.com/photos/8496228/pexels-photo-8496228.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/grocery.webp",
		"alt": "Fresh vegetables arranged at a market stall",
		"license": "https://www.pexels.com/license/",
		"width": 720,
		"height": 960
	},
	{
		"key": "fashion",
		"id": 8989864,
		"author": "Alena Darmel",
		"source": "https://www.pexels.com/photo/close-up-of-a-clothing-rack-8989864/",
		"download": "https://images.pexels.com/photos/8989864/pexels-photo-8989864.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/fashion.webp",
		"alt": "Neutral clothing and shoes arranged in a bright interior",
		"license": "https://www.pexels.com/license/",
		"width": 640,
		"height": 960
	},
	{
		"key": "coffee",
		"id": 30487195,
		"author": "Pho Tomass",
		"source": "https://www.pexels.com/photo/ceramic-coffee-cup-with-beans-in-light-30487195/",
		"download": "https://images.pexels.com/photos/30487195/pexels-photo-30487195.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/coffee.webp",
		"alt": "Ceramic coffee cup and coffee beans in afternoon light",
		"license": "https://www.pexels.com/license/",
		"width": 1439,
		"height": 960
	},
	{
		"key": "healthcare",
		"id": 8376198,
		"author": "Tima Miroshnichenko",
		"source": "https://www.pexels.com/photo/a-woman-using-a-laptop-8376198/",
		"download": "https://images.pexels.com/photos/8376198/pexels-photo-8376198.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/healthcare.webp",
		"alt": "Doctor using a laptop for a telehealth consultation",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "fitness",
		"id": 38055044,
		"author": "Marcus Chan Media",
		"source": "https://www.pexels.com/photo/intense-gym-workout-with-dumbbells-38055044/",
		"download": "https://images.pexels.com/photos/38055044/pexels-photo-38055044.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/fitness.webp",
		"alt": "Athlete training with dumbbells in a gym",
		"license": "https://www.pexels.com/license/",
		"width": 1440,
		"height": 960
	},
	{
		"key": "construction",
		"id": 35767048,
		"author": "Павел Хлыстунов",
		"source": "https://www.pexels.com/photo/modern-urban-high-rise-construction-site-35767048/",
		"download": "https://images.pexels.com/photos/35767048/pexels-photo-35767048.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/construction.webp",
		"alt": "High-rise building construction with cranes",
		"license": "https://www.pexels.com/license/",
		"width": 641,
		"height": 960
	},
	{
		"key": "mobile",
		"id": 11361901,
		"author": "Bruno Scramgnon",
		"source": "https://www.pexels.com/photo/hand-of-a-person-holding-a-smartphone-11361901/",
		"download": "https://images.pexels.com/photos/11361901/pexels-photo-11361901.jpeg?auto=compress&cs=tinysrgb&w=1440&q=82",
		"file": "/images/mobile.webp",
		"alt": "Hand holding a smartphone displaying financial data",
		"license": "https://www.pexels.com/license/",
		"width": 641,
		"height": 960
	}
].map((p) => [p.key, p]));
var servicePhoto = {
	ai: "cloud",
	"ai-agents": "code",
	"ai-models": "cloud",
	"web-portals": "team",
	ecommerce: "fashion",
	"mobile-apps": "mobile",
	games: "gaming",
	"ar-vr": "vr",
	marketing: "analytics",
	custom: "code",
	plugins: "code",
	erp: "logistics",
	saas: "analytics"
};
var workPhoto = {
	aurum: "jewelry",
	fleetline: "logistics",
	learnloop: "education",
	skyforge: "gaming",
	landmark: "property",
	bloom: "flowers",
	nutribasket: "grocery",
	threadwell: "fashion",
	brewlab: "coffee",
	ledgerly: "analytics",
	clinichub: "healthcare",
	hiretrack: "collaboration",
	schoolsphere: "education",
	harbor: "team",
	atlas: "cloud",
	summit: "construction",
	greenfield: "education",
	fitpulse: "fitness",
	ridenow: "mobile",
	pocketwise: "analytics",
	tablechat: "coffee",
	pixelpirates: "gaming",
	neonracer: "gaming",
	orbitvr: "vr"
};
function productPhoto(crumb) {
	const text = crumb.toLowerCase();
	for (const [pattern, photo] of [
		["clinic|patient|health", "healthcare"],
		["gym|fitness", "fitness"],
		["school|learning|education", "education"],
		["salon|retail|shop|commerce|order", "fashion"],
		["restaurant|dining|kitchen|table|cafe", "coffee"],
		["fleet|stock|inventory|warehouse|asset|dispatch|jobs", "logistics"],
		["property|facility|building|tenant", "property"],
		["vr|ar /|holo|tour", "vr"],
		["security|backup|cloud|vault", "cloud"],
		["people|attendance|leave|staff|visitor", "collaboration"],
		["sales|billing|invoice|finance|payment|analytics|revenue", "analytics"],
		["chat|ai", "code"]
	]) if (new RegExp(pattern).test(text)) return photo;
	return "team";
}
// src/components/Photo.tsx
function Photo({ kind, caption, className = "" }) {
	const photo = photos[kind] || photos.code;
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: `real-photo ${className}`,
		cmsTag: "figure",
		cmsSource: "components/Photo.tsx:1",
		children: [/* @__PURE__ */ jsx(CmsElement, {
			src: photo.file,
			alt: photo.alt,
			width: photo.width,
			height: photo.height,
			loading: "lazy",
			decoding: "async",
			cmsTag: "img",
			cmsSource: "components/Photo.tsx:2"
		}), caption && /* @__PURE__ */ jsx(CmsElement, {
			cmsTag: "figcaption",
			cmsSource: "components/Photo.tsx:3",
			children: caption
		})]
	});
}
// src/components/Services.tsx
var SERVICES$2 = [
	{
		id: "ai",
		title: "AI Automations",
		desc: "AI agents, chatbots and automated workflows that take repetitive work off your team.",
		Icon: Cpu,
		art: /* @__PURE__ */ jsx(Photo, { kind: "cloud" }),
		tone: "lilac",
		size: "lg"
	},
	{
		id: "web-portals",
		title: "Web Portals",
		desc: "Customer, partner and staff portals with dashboards, roles and self-service.",
		Icon: MonitorSmartphone,
		art: /* @__PURE__ */ jsx(Photo, { kind: "team" }),
		tone: "mint",
		size: "md"
	},
	{
		id: "ecommerce",
		title: "Ecommerce",
		desc: "Online stores on Shopify, WooCommerce, Magento and more, or a custom cart, built to sell.",
		Icon: ShoppingCart,
		art: /* @__PURE__ */ jsx(Photo, { kind: "fashion" }),
		tone: "yellow",
		size: "md"
	},
	{
		id: "mobile-apps",
		title: "Mobile Apps",
		desc: "Native and cross-platform apps for iOS and Android, from first sketch to store.",
		Icon: Smartphone,
		art: /* @__PURE__ */ jsx(Photo, { kind: "mobile" }),
		tone: "pink",
		size: "md"
	},
	{
		id: "games",
		title: "Game Development",
		desc: "Mobile, PC and web games, from first prototype to store launch and live updates.",
		Icon: Gamepad2,
		art: /* @__PURE__ */ jsx(Photo, { kind: "gaming" }),
		tone: "blue",
		size: "md"
	},
	{
		id: "ar-vr",
		title: "AR/VR",
		desc: "Augmented and virtual reality for training, retail, property and events.",
		Icon: Glasses,
		art: /* @__PURE__ */ jsx(Photo, { kind: "vr" }),
		tone: "coral",
		size: "wide"
	},
	{
		id: "marketing",
		title: "Digital Marketing",
		desc: "Brand, search, paid, social, content and analytics run as one growth engine.",
		Icon: Megaphone,
		art: /* @__PURE__ */ jsx(Photo, { kind: "analytics" }),
		tone: "mint",
		size: "wide"
	}
];
function Services() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "section services",
		id: "services",
		cmsTag: "section",
		cmsSource: "components/Services.tsx:1",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "What we do",
				title: "Serious skills.",
				em: "Zero stiff vibes.",
				copy: "Design, development and marketing from one team, so you don't have to manage three agencies."
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "service-grid service-grid--bento",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Services.tsx:2",
				children: SERVICES$2.map((s, index) => /* @__PURE__ */ jsxs(CmsElement, {
					href: `/services/${s.id}`,
					className: `service-card service-card--${s.tone} service-card--${s.size}`,
					"data-tilt": true,
					style: { "--stagger": index },
					cmsTag: "a",
					cmsSource: "components/Services.tsx:3",
					children: [
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "service-top",
							cmsTag: "div",
							cmsSource: "components/Services.tsx:4",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/Services.tsx:5",
								children: String(index + 1).padStart(2, "0")
							}), /* @__PURE__ */ jsx(CmsElement, {
								className: "icon-bubble",
								cmsTag: "span",
								cmsSource: "components/Services.tsx:6",
								children: /* @__PURE__ */ jsx(s.Icon, { size: 20 })
							})]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "service-art",
							cmsTag: "div",
							cmsSource: "components/Services.tsx:7",
							children: s.art
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "service-text",
							cmsTag: "div",
							cmsSource: "components/Services.tsx:8",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/Services.tsx:9",
								children: s.title
							}), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "p",
								cmsSource: "components/Services.tsx:10",
								children: s.desc
							})]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "card-arrow",
							cmsTag: "span",
							cmsSource: "components/Services.tsx:11",
							children: /* @__PURE__ */ jsx(ArrowRight$1, { size: 20 })
						})
					]
				}, s.id))
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "services-more",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Services.tsx:12",
				children: /* @__PURE__ */ jsx(CmsElement, {
					href: "/services",
					className: "text-link",
					cmsTag: "a",
					cmsSource: "components/Services.tsx:13",
					children: "See all services, including AI agents, SaaS, custom development and ERP"
				})
			})
		]
	});
}
// src/data/company.ts
var FOUNDED = 2004;
var stats = [
	{
		label: "Projects delivered",
		value: 1e3,
		suffix: "+"
	},
	{
		label: "In-house products",
		value: 28,
		suffix: ""
	},
	{
		label: "Countries where we're present",
		value: 4,
		suffix: ""
	}
];
var milestones = [
	{
		year: 2004,
		tag: "Founding",
		title: "Sybertron begins in Delhi",
		text: "A small team in Delhi, India starts building custom software for local businesses."
	},
	{
		year: 2010,
		tag: "Growth",
		title: "First enterprise clients",
		text: "Larger teams start trusting us with their core systems."
	},
	{
		year: 2012,
		tag: "Product",
		title: "First in-house product",
		text: "We turn repeat client needs into our first reusable product."
	},
	{
		year: 2014,
		tag: "Team",
		title: "Engineering team doubles",
		text: "New design and engineering hires let us run more projects in parallel."
	},
	{
		year: 2015,
		tag: "Expansion",
		title: "Presence in London",
		text: "We start working in London to serve clients across the United Kingdom."
	},
	{
		year: 2016,
		tag: "Product",
		title: "Cloud platform launch",
		text: "Our products move to a cloud-first, subscription model."
	},
	{
		year: 2018,
		tag: "Growth",
		title: "Mobile practice opens",
		text: "iOS and Android apps join our web and software work."
	},
	{
		year: 2019,
		tag: "Expansion",
		title: "Presence in Dubai",
		text: "We open in Dubai to serve clients across the UAE and the wider Gulf region."
	},
	{
		year: 2020,
		tag: "Milestone",
		title: "Fully remote delivery",
		text: "Every project runs on distributed teams without losing pace."
	},
	{
		year: 2022,
		tag: "Product",
		title: "AI automation arrives",
		text: "We add AI agents and automated workflows to our services."
	},
	{
		year: 2024,
		tag: "Growth",
		title: "Marketing joins the team",
		text: "Design, development and marketing now sit under one roof."
	},
	{
		year: "Now",
		tag: "Today",
		title: "Building what's next",
		text: "Software, AI and growth work for businesses that want to scale."
	}
];
var locations = ["India"];
// src/components/Timeline.tsx
var END = (/* @__PURE__ */ new Date()).getFullYear();
var SLOTS = [...Array.from({ length: END - FOUNDED }, (_, i) => FOUNDED + i), "Now"];
var YEARS$2 = END - FOUNDED;
function Timeline() {
	const wrap = useRef(null);
	const inView = useInView(wrap, {
		once: true,
		amount: .25
	});
	const [active, setActive] = useState(Math.min(4, milestones.length - 1));
	const [auto, setAuto] = useState(true);
	const years = useCountUp(YEARS$2, inView);
	const go = (i, manual = true) => {
		setActive((i + milestones.length) % milestones.length);
		if (manual) setAuto(false);
	};
	useEffect(() => {
		if (!inView || !auto || prefersReducedMotion()) return;
		const id = setInterval(() => setActive((a) => (a + 1) % milestones.length), 4200);
		return () => clearInterval(id);
	}, [inView, auto]);
	const m = milestones[active];
	const activeSlot = SLOTS.indexOf(m.year);
	const progress = (activeSlot + .5) / SLOTS.length * 100;
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "section story",
		id: "about",
		ref: wrap,
		cmsTag: "section",
		cmsSource: "components/Timeline.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "story-intro",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Timeline.tsx:2",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/Timeline.tsx:3",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/Timeline.tsx:4"
							}),
							" Delivering solutions since ",
							FOUNDED
						]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "h2",
						cmsSource: "components/Timeline.tsx:5",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								className: "years-count",
								cmsTag: "span",
								cmsSource: "components/Timeline.tsx:6",
								children: years
							}),
							" years of building",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "em",
								cmsSource: "components/Timeline.tsx:7",
								children: "software that scales."
							})
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/Timeline.tsx:8",
						children: "We have grown by staying curious, keeping teams close, and turning what we learn on client work into products of our own."
					})
				]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "metrics",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Timeline.tsx:9",
				children: stats.map((s, index) => /* @__PURE__ */ jsxs(CmsElement, {
					style: { "--stagger": index },
					cmsTag: "div",
					cmsSource: "components/Timeline.tsx:10",
					children: [/* @__PURE__ */ jsx(CountUp, { value: `${s.value}${s.suffix}` }), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Timeline.tsx:11",
						children: s.label
					})]
				}, s.label))
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "year-bars",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Timeline.tsx:12",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "year-bars-inner",
					cmsTag: "div",
					cmsSource: "components/Timeline.tsx:13",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "year-rail",
						cmsTag: "div",
						cmsSource: "components/Timeline.tsx:14",
						children: /* @__PURE__ */ jsx(CmsElement, {
							style: { width: `${progress}%` },
							cmsTag: "i",
							cmsSource: "components/Timeline.tsx:15"
						})
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "year-grid",
						style: { gridTemplateColumns: `repeat(${SLOTS.length}, minmax(0, 1fr))` },
						cmsTag: "div",
						cmsSource: "components/Timeline.tsx:16",
						children: SLOTS.map((y, i) => {
							const idx = milestones.findIndex((x) => x.year === y);
							const has = idx >= 0;
							const isActive = i === activeSlot;
							const cls = `year-bar${has ? " has" : ""}${i <= activeSlot ? " is-past" : ""}${isActive ? " is-active" : ""}`;
							return /* @__PURE__ */ jsx(CmsElement, {
								className: "year-slot",
								cmsTag: "div",
								cmsSource: "components/Timeline.tsx:17",
								children: has ? /* @__PURE__ */ jsxs(CmsElement, {
									type: "button",
									onClick: () => go(idx),
									"aria-label": `Show ${y}`,
									"aria-current": isActive,
									cmsTag: "button",
									cmsSource: "components/Timeline.tsx:18",
									children: [/* @__PURE__ */ jsx(CmsElement, {
										className: cls,
										style: { "--i": i },
										cmsTag: "span",
										cmsSource: "components/Timeline.tsx:19"
									}), /* @__PURE__ */ jsx(CmsElement, {
										className: isActive ? "is-active" : void 0,
										cmsTag: "small",
										cmsSource: "components/Timeline.tsx:20",
										children: y
									})]
								}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(CmsElement, {
									className: cls,
									style: { "--i": i },
									cmsTag: "span",
									cmsSource: "components/Timeline.tsx:21"
								}), /* @__PURE__ */ jsx(CmsElement, {
									"aria-hidden": "true",
									cmsTag: "small",
									cmsSource: "components/Timeline.tsx:22",
									children: "\xA0"
								})] })
							}, String(y));
						})
					})]
				})
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "milestone",
				onMouseEnter: () => setAuto(false),
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Timeline.tsx:23",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "milestone-body",
					cmsTag: "div",
					cmsSource: "components/Timeline.tsx:24",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "milestone-year",
						cmsTag: "span",
						cmsSource: "components/Timeline.tsx:25",
						children: m.year
					}), /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "div",
						cmsSource: "components/Timeline.tsx:26",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								className: "milestone-tag",
								cmsTag: "p",
								cmsSource: "components/Timeline.tsx:27",
								children: m.tag
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/Timeline.tsx:28",
								children: m.title
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "milestone-text",
								cmsTag: "p",
								cmsSource: "components/Timeline.tsx:29",
								children: m.text
							})
						]
					})]
				}, active), /* @__PURE__ */ jsxs(CmsElement, {
					className: "milestone-nav",
					cmsTag: "div",
					cmsSource: "components/Timeline.tsx:30",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						onClick: () => go(active - 1),
						"aria-label": "Previous milestone",
						cmsTag: "button",
						cmsSource: "components/Timeline.tsx:31",
						children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18 })
					}), /* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						onClick: () => go(active + 1),
						"aria-label": "Next milestone",
						cmsTag: "button",
						cmsSource: "components/Timeline.tsx:32",
						children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
					})]
				})]
			})
		]
	});
}
// src/components/ProductMock.tsx
function ProductMock({ m }) {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "pm pm-photo",
		cmsTag: "div",
		cmsSource: "components/ProductMock.tsx:1",
		children: /* @__PURE__ */ jsx(Photo, {
			kind: productPhoto(m.crumb + " " + m.title),
			caption: "Product use-case photography"
		})
	});
}
// src/components/Products.tsx
var DURATION$1 = 6;
function Products() {
	const ref = useRef(null);
	const inView = useInView(ref, { amount: .35 });
	const [i, setI] = useState(0);
	const [hover, setHover] = useState(false);
	const p = products[i];
	const paused = hover || !inView;
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "showcase products",
		id: "products",
		ref,
		cmsTag: "section",
		cmsSource: "components/Products.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "showcase-intro",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Products.tsx:2",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/Products.tsx:3",
					children: "Try a live demo"
				}), /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/Products.tsx:4",
					children: [
						"Our products,",
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "em",
							cmsSource: "components/Products.tsx:5",
							children: "ready to run."
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "browser-card",
				"data-reveal": "scale",
				onMouseEnter: () => setHover(true),
				onMouseLeave: () => setHover(false),
				cmsTag: "div",
				cmsSource: "components/Products.tsx:6",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "browser-bar",
					cmsTag: "div",
					cmsSource: "components/Products.tsx:7",
					children: [
						/* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "div",
							cmsSource: "components/Products.tsx:8",
							children: [
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "i",
									cmsSource: "components/Products.tsx:9"
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "i",
									cmsSource: "components/Products.tsx:10"
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "i",
									cmsSource: "components/Products.tsx:11"
								})
							]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "url-swap",
							cmsTag: "span",
							cmsSource: "components/Products.tsx:12",
							children: p.url
						}, p.id),
						/* @__PURE__ */ jsx(CmsElement, {
							"aria-label": `Open ${p.name}`,
							cmsTag: "button",
							cmsSource: "components/Products.tsx:13",
							children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
						})
					]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "product-stage",
					cmsTag: "div",
					cmsSource: "components/Products.tsx:14",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "product-mock",
						"data-tilt": true,
						cmsTag: "div",
						cmsSource: "components/Products.tsx:15",
						children: /* @__PURE__ */ jsx(CmsElement, {
							className: "product-mock-swap",
							cmsTag: "div",
							cmsSource: "components/Products.tsx:16",
							children: /* @__PURE__ */ jsx(ProductMock, { m: p.mock })
						}, p.id)
					}), /* @__PURE__ */ jsxs(CmsElement, {
						className: "product-copy",
						cmsTag: "div",
						cmsSource: "components/Products.tsx:17",
						children: [
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "product-cat",
								cmsTag: "p",
								cmsSource: "components/Products.tsx:18",
								children: [
									/* @__PURE__ */ jsx(CmsElement, {
										style: { background: p.accent },
										cmsTag: "i",
										cmsSource: "components/Products.tsx:19"
									}),
									" ",
									p.category
								]
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/Products.tsx:20",
								children: p.name
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "product-blurb",
								cmsTag: "p",
								cmsSource: "components/Products.tsx:21",
								children: p.blurb
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "ul",
								cmsSource: "components/Products.tsx:22",
								children: p.bullets.map((b) => /* @__PURE__ */ jsxs(CmsElement, {
									cmsTag: "li",
									cmsSource: "components/Products.tsx:23",
									children: [/* @__PURE__ */ jsx(CmsElement, {
										style: { background: p.accent },
										cmsTag: "i",
										cmsSource: "components/Products.tsx:24"
									}), b]
								}, b))
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "product-platforms",
								cmsTag: "p",
								cmsSource: "components/Products.tsx:25",
								children: p.platforms
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "product-actions",
								cmsTag: "div",
								cmsSource: "components/Products.tsx:26",
								children: [/* @__PURE__ */ jsxs(Button3D, {
									href: "#contact",
									tone: "mint",
									children: ["Explore demo ", /* @__PURE__ */ jsx(ArrowRight, { size: 17 })]
								}), /* @__PURE__ */ jsx(Button3D, {
									href: "#contact",
									tone: "paper",
									children: "Book a demo"
								})]
							})
						]
					}, p.id)]
				})]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "product-tabs",
				role: "tablist",
				"aria-label": "Products",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Products.tsx:27",
				children: products.map((x, k) => {
					const on = k === i;
					return /* @__PURE__ */ jsxs(CmsElement, {
						type: "button",
						role: "tab",
						"aria-selected": on,
						onClick: () => setI(k),
						className: "product-tab",
						cmsTag: "button",
						cmsSource: "components/Products.tsx:28",
						children: [x.name, on && /* @__PURE__ */ jsx(CmsElement, {
							className: "p-fill",
							style: {
								animationDuration: `${DURATION$1}s`,
								animationPlayState: paused ? "paused" : "running"
							},
							onAnimationEnd: () => setI((n) => (n + 1) % products.length),
							cmsTag: "span",
							cmsSource: "components/Products.tsx:29"
						}, x.id)]
					}, x.id);
				})
			})
		]
	});
}
// src/components/Process.tsx
var CARDS = [
	{
		Icon: BadgeCheck,
		title: "Expertise and experience",
		text: `Project managers, analysts, designers, developers and QA engineers who have shipped more than ${stats[0].value.toLocaleString("en-US")} projects together.`
	},
	{
		Icon: FlaskConical,
		title: "New technology, tested first",
		text: "We try new tools on our own products before we suggest them to you, so you only pay for what has proved itself."
	},
	{
		Icon: SlidersHorizontal,
		title: "Built around your business",
		text: "We start by learning how your business runs, then build to fit it, rather than squeezing you into a template."
	},
	{
		Icon: ShieldCheck,
		title: "Reliable support",
		text: "Many of our clients have been with us for years. We look after their sites and apps after launch and fix problems before they cost money."
	}
];
var MENU = [
	{
		c: "Starters",
		n: "Logo & brand kit"
	},
	{
		c: "Starters",
		n: "Social media pages"
	},
	{
		c: "Mains",
		n: "Business website"
	},
	{
		c: "Mains",
		n: "Online store"
	},
	{
		c: "Sides",
		n: "Mobile app"
	},
	{
		c: "Desserts",
		n: "SEO"
	}
];
var DEMO_ORDER = [
	2,
	3,
	0,
	4
];
function Proposal() {
	const sheet = useRef(null);
	const inView = useInView(sheet, {
		once: true,
		amount: .35
	});
	const [picked, setPicked] = useState([]);
	const [auto, setAuto] = useState(true);
	useEffect(() => {
		if (!inView || !auto || prefersReducedMotion()) return;
		const id = setInterval(() => setPicked((p) => p.length >= DEMO_ORDER.length ? [] : [...p, DEMO_ORDER[p.length]]), 1400);
		return () => clearInterval(id);
	}, [inView, auto]);
	const toggle = (i) => {
		setAuto(false);
		setPicked((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
	};
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "proposal",
		id: "proposal",
		cmsTag: "section",
		cmsSource: "components/Process.tsx:1",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			className: "proposal-copy",
			"data-reveal": "left",
			cmsTag: "div",
			cmsSource: "components/Process.tsx:2",
			children: [
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "eyebrow",
					cmsTag: "p",
					cmsSource: "components/Process.tsx:3",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Process.tsx:4"
					}), " Build your project"]
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/Process.tsx:5",
					children: [
						"Prepare",
						/* @__PURE__ */ jsx("br", {}),
						"your own",
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "em",
							cmsSource: "components/Process.tsx:6",
							children: "proposal."
						})
					]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/Process.tsx:7",
					children: "Our services, laid out like a restaurant menu: starters like a logo or social pages, a website or app for your main, then sides, dessert and coffee. Tap a few dishes to start your order, and we'll draft a detailed proposal with a timeline and an estimated cost in about a minute."
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "proposal-cta",
					cmsTag: "div",
					cmsSource: "components/Process.tsx:8",
					children: [/* @__PURE__ */ jsxs(Button3D, {
						href: "/start",
						tone: "mint",
						children: ["Open the full menu ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 17 })]
					}), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Process.tsx:9",
						children: "Free · no sign-up"
					})]
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "proposal-total",
					cmsTag: "div",
					cmsSource: "components/Process.tsx:10",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Process.tsx:11",
						children: "Your selection"
					}), /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "strong",
						cmsSource: "components/Process.tsx:12",
						children: [
							picked.length,
							" ",
							picked.length === 1 ? "course" : "courses"
						]
					})]
				})
			]
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "menu-wrap",
			"data-reveal": "right",
			ref: sheet,
			cmsTag: "div",
			cmsSource: "components/Process.tsx:13",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "menu-sheet",
				cmsTag: "div",
				cmsSource: "components/Process.tsx:14",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "menu-heading",
						cmsTag: "div",
						cmsSource: "components/Process.tsx:15",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/Process.tsx:16",
								children: "Sybertron Technologies"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "b",
								cmsSource: "components/Process.tsx:17",
								children: "Tonight's menu"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "small",
								cmsSource: "components/Process.tsx:18",
								children: "Tap to order"
							})
						]
					}),
					MENU.map(({ c, n }, index) => {
						const selected = picked.includes(index);
						return /* @__PURE__ */ jsxs(CmsElement, {
							type: "button",
							className: selected ? "menu-item is-selected" : "menu-item",
							"aria-pressed": selected,
							onClick: () => toggle(index),
							cmsTag: "button",
							cmsSource: "components/Process.tsx:19",
							children: [
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "span",
									cmsSource: "components/Process.tsx:20",
									children: String(index + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ jsxs(CmsElement, {
									cmsTag: "span",
									cmsSource: "components/Process.tsx:21",
									children: [/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "b",
										cmsSource: "components/Process.tsx:22",
										children: n
									}), /* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "small",
										cmsSource: "components/Process.tsx:23",
										children: c
									})]
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "i",
									cmsSource: "components/Process.tsx:24",
									children: selected ? /* @__PURE__ */ jsx(Check, {
										size: 14,
										strokeWidth: 3
									}) : /* @__PURE__ */ jsx(Plus, { size: 14 })
								})
							]
						}, n);
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "menu-footer",
						cmsTag: "div",
						cmsSource: "components/Process.tsx:25",
						children: "Made fresh for every project"
					})
				]
			}), /* @__PURE__ */ jsxs(CmsElement, {
				className: "receipt",
				cmsTag: "div",
				cmsSource: "components/Process.tsx:26",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "receipt-head",
					cmsTag: "div",
					cmsSource: "components/Process.tsx:27",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Process.tsx:28",
						children: "Your order"
					}), /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Process.tsx:29",
						children: [
							picked.length,
							" ",
							picked.length === 1 ? "item" : "items"
						]
					})]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/Process.tsx:30",
					children: [picked.length === 0 && /* @__PURE__ */ jsx(CmsElement, {
						className: "empty",
						cmsTag: "li",
						cmsSource: "components/Process.tsx:31",
						children: "Nothing yet. Tap a dish."
					}), picked.map((i) => /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/Process.tsx:32",
						children: [
							/* @__PURE__ */ jsx(Check, {
								size: 11,
								strokeWidth: 3
							}),
							" ",
							MENU[i].n
						]
					}, i))]
				})]
			})]
		})]
	});
}
function Process() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(CmsElement, {
		className: "section process",
		id: "how-we-work",
		cmsTag: "section",
		cmsSource: "components/Process.tsx:33",
		children: [/* @__PURE__ */ jsx(SectionHeading, {
			className: "process-heading",
			eyebrow: "How we work",
			title: "Good work needs",
			em: "good chemistry.",
			copy: "What you can expect on every project, whatever its size."
		}), /* @__PURE__ */ jsx(CmsElement, {
			className: "process-steps",
			"data-reveal": true,
			cmsTag: "div",
			cmsSource: "components/Process.tsx:34",
			children: CARDS.map(({ Icon, title, text }, index) => /* @__PURE__ */ jsxs(CmsElement, {
				style: { "--stagger": index },
				cmsTag: "article",
				cmsSource: "components/Process.tsx:35",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Process.tsx:36",
						children: /* @__PURE__ */ jsx(Icon, { size: 18 })
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "h3",
						cmsSource: "components/Process.tsx:37",
						children: title
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/Process.tsx:38",
						children: text
					})
				]
			}, title))
		})]
	}), /* @__PURE__ */ jsx(Proposal, {})] });
}
// src/data/work.ts
var projects = [
	{
		id: "aurum",
		name: "Aurum",
		url: "aurum",
		tags: ["Jewellery & retail", "Online store"],
		summary: "A luxury jewellery store with a rich product gallery, fast checkout and a made-to-order enquiry flow."
	},
	{
		id: "fleetline",
		name: "FleetLine",
		url: "fleetline",
		tags: ["Logistics", "Web portal"],
		summary: "A shipment tracking portal for a logistics company, with live route maps, driver roles and customer self-service."
	},
	{
		id: "learnloop",
		name: "LearnLoop",
		url: "learnloop",
		tags: ["Education & test prep", "Platform"],
		summary: "An exam-prep platform with mock tests, progress reports and a companion mobile app for daily practice."
	},
	{
		id: "skyforge",
		name: "Skyforge",
		url: "skyforge",
		tags: ["Gaming", "Mobile game"],
		summary: "A casual adventure game for iOS and Android, from first prototype to store launch and live events."
	},
	{
		id: "landmark",
		name: "Landmark Realty",
		url: "landmarkrealty",
		tags: ["Real estate", "Business website"],
		summary: "A property website with smart search, map listings and an enquiry system wired into the sales team's CRM."
	}
];
var CATEGORIES = [
	"Online stores",
	"Platforms",
	"Business websites",
	"Mobile apps",
	"Games & AR/VR"
];
var feat = (p, category, kind) => ({
	...p,
	category,
	kind,
	lines: ["", ""],
	colors: [
		"#000",
		"#000",
		"#fff"
	]
});
var allProjects = [
	feat(projects[0], "Online stores", "store"),
	feat(projects[1], "Platforms", "portal"),
	feat(projects[3], "Games & AR/VR", "game"),
	feat(projects[2], "Platforms", "portal"),
	feat(projects[4], "Business websites", "site"),
	{
		id: "bloom",
		name: "Bloom & Co",
		url: "bloomandco",
		category: "Online stores",
		kind: "store",
		tags: ["Florist", "Online store"],
		summary: "Same-day flower delivery with a bouquet builder, delivery-slot picker and subscription plans.",
		lines: ["Fresh blooms,", "delivered daily."],
		colors: [
			"#3a0f2a",
			"#7a2457",
			"#ff9ec7"
		]
	},
	{
		id: "nutribasket",
		name: "NutriBasket",
		url: "nutribasket",
		category: "Online stores",
		kind: "store",
		tags: ["Grocery", "Online store"],
		summary: "A health-food shop with diet filters, repeat-order baskets and a store-pickup option for local customers.",
		lines: ["Eat well,", "every single day."],
		colors: [
			"#0b3a22",
			"#146c3c",
			"#b8f36b"
		]
	},
	{
		id: "threadwell",
		name: "Threadwell",
		url: "threadwell",
		category: "Online stores",
		kind: "store",
		tags: ["Fashion", "Online store"],
		summary: "A fashion label's storefront with size guides, lookbooks and one-page checkout tuned for mobile shoppers.",
		lines: ["Made slow,", "worn forever."],
		colors: [
			"#1a1a2e",
			"#2d2d52",
			"#ffd764"
		]
	},
	{
		id: "brewlab",
		name: "Brew Lab",
		url: "brewlab",
		category: "Online stores",
		kind: "store",
		tags: ["Coffee", "Online store"],
		summary: "A specialty-coffee roaster with grind-size options, subscriptions and a customer portal to pause or swap beans.",
		lines: ["Roasted small,", "shipped fresh."],
		colors: [
			"#2b1608",
			"#5b3416",
			"#f5c58a"
		]
	},
	{
		id: "ledgerly",
		name: "Ledgerly",
		url: "ledgerly",
		category: "Platforms",
		kind: "portal",
		tags: ["Accounting", "SaaS platform"],
		summary: "Invoicing and bookkeeping software for small firms, with bank feeds, tax-ready reports and team roles.",
		lines: ["", ""],
		colors: [
			"#0c1f3f",
			"#17376b",
			"#4ade80"
		]
	},
	{
		id: "clinichub",
		name: "ClinicHub",
		url: "clinichub",
		category: "Platforms",
		kind: "portal",
		tags: ["Healthcare", "Web portal"],
		summary: "Appointment, records and billing in one portal for a group of clinics, with SMS reminders for patients.",
		lines: ["", ""],
		colors: [
			"#06303a",
			"#0e5a6b",
			"#67e8f9"
		]
	},
	{
		id: "hiretrack",
		name: "HireTrack",
		url: "hiretrack",
		category: "Platforms",
		kind: "portal",
		tags: ["Recruitment", "Web platform"],
		summary: "An applicant-tracking platform with pipeline boards, interview scheduling and shareable scorecards.",
		lines: ["", ""],
		colors: [
			"#2a0f4a",
			"#4a1f86",
			"#f0abfc"
		]
	},
	{
		id: "schoolsphere",
		name: "SchoolSphere",
		url: "schoolsphere",
		category: "Platforms",
		kind: "portal",
		tags: ["Education", "School management"],
		summary: "Attendance, fee collection and parent messaging for a school network, with a mobile app for families.",
		lines: ["", ""],
		colors: [
			"#3b1a05",
			"#7a3a0a",
			"#fbbf24"
		]
	},
	{
		id: "harbor",
		name: "Harbor Legal",
		url: "harborlegal",
		category: "Business websites",
		kind: "site",
		tags: ["Legal", "Business website"],
		summary: "A law firm's website with practice-area pages, attorney profiles and a secure consultation request form.",
		lines: ["Counsel you", "can rely on."],
		colors: [
			"#eef1f8",
			"#dbe3f5",
			"#1e3a8a"
		],
		light: true
	},
	{
		id: "atlas",
		name: "Atlas Security",
		url: "atlassecurity",
		category: "Business websites",
		kind: "site",
		tags: ["Security", "Business website"],
		summary: "A corporate site for a security company with service pages, a coverage map and a quote request flow.",
		lines: ["Protection that", "never blinks."],
		colors: [
			"#101418",
			"#1c242c",
			"#22d3ee"
		]
	},
	{
		id: "summit",
		name: "Summit Builders",
		url: "summitbuilders",
		category: "Business websites",
		kind: "site",
		tags: ["Construction", "Business website"],
		summary: "A builder's portfolio site with project galleries, process timelines and an estimate request form.",
		lines: ["We build what", "stands tall."],
		colors: [
			"#fff4e0",
			"#ffe2b0",
			"#ea580c"
		],
		light: true
	},
	{
		id: "greenfield",
		name: "Greenfield Academy",
		url: "greenfieldacademy",
		category: "Business websites",
		kind: "site",
		tags: ["School", "Business website"],
		summary: "A school website with admissions pages, event calendar, news and a virtual campus tour.",
		lines: ["Where curious", "minds grow."],
		colors: [
			"#e7f7e4",
			"#cdeec6",
			"#15803d"
		],
		light: true
	},
	{
		id: "fitpulse",
		name: "FitPulse",
		url: "fitpulse",
		category: "Mobile apps",
		kind: "app",
		tags: ["Fitness", "iOS & Android"],
		summary: "A workout and habit app with trainer plans, streaks, wearable sync and in-app subscriptions.",
		lines: ["Train smarter,", "stay on track."],
		colors: [
			"#1b0b3a",
			"#3b1580",
			"#fb7185"
		]
	},
	{
		id: "ridenow",
		name: "RideNow",
		url: "ridenow",
		category: "Mobile apps",
		kind: "app",
		tags: ["Mobility", "iOS & Android"],
		summary: "A ride-booking app with live driver tracking, fare estimates and wallet payments for city commuters.",
		lines: ["Your ride,", "right on time."],
		colors: [
			"#06222e",
			"#0c4a63",
			"#38bdf8"
		]
	},
	{
		id: "pocketwise",
		name: "Pocketwise",
		url: "pocketwise",
		category: "Mobile apps",
		kind: "app",
		tags: ["Finance", "iOS & Android"],
		summary: "A personal-finance app that tracks spending, sets budgets and nudges users toward their savings goals.",
		lines: ["Know where", "your money goes."],
		colors: [
			"#10251a",
			"#1d4a30",
			"#a3e635"
		]
	},
	{
		id: "tablechat",
		name: "TableChat",
		url: "tablechat",
		category: "Mobile apps",
		kind: "app",
		tags: ["Hospitality", "Web app & WhatsApp"],
		summary: "Table ordering through WhatsApp for cafés, with a kitchen display and GST-ready billing.",
		lines: ["Scan, order,", "enjoy."],
		colors: [
			"#3a1408",
			"#7c2d12",
			"#fdba74"
		]
	},
	{
		id: "pixelpirates",
		name: "Pixel Pirates",
		url: "pixelpirates",
		category: "Games & AR/VR",
		kind: "game",
		tags: ["Gaming", "Mobile game"],
		summary: "A pixel-art treasure-hunt game with co-op raids, daily quests and seasonal events.",
		lines: ["Pixel Pirates", ""],
		colors: [
			"#0a2a4a",
			"#0e7490",
			"#fcd34d"
		]
	},
	{
		id: "neonracer",
		name: "Neon Racer",
		url: "neonracer",
		category: "Games & AR/VR",
		kind: "game",
		tags: ["Gaming", "PC & console"],
		summary: "An arcade racing game with ghost laps, weekly leaderboards and a track editor.",
		lines: ["Neon Racer", ""],
		colors: [
			"#1a0536",
			"#7e22ce",
			"#22d3ee"
		]
	},
	{
		id: "orbitvr",
		name: "Orbit VR Classroom",
		url: "orbitvr",
		category: "Games & AR/VR",
		kind: "game",
		tags: ["VR", "Education"],
		summary: "An immersive VR classroom where students explore the solar system together with a live teacher.",
		lines: ["Orbit VR", ""],
		colors: [
			"#020617",
			"#1e1b4b",
			"#a78bfa"
		]
	}
];
// src/components/WorkMocks.tsx
var visual = (id) => /* @__PURE__ */ jsx(Photo, {
	kind: workPhoto[id] || "code",
	caption: "Industry photography"
});
var mocks = {
	aurum: () => visual("aurum"),
	fleetline: () => visual("fleetline"),
	learnloop: () => visual("learnloop"),
	skyforge: () => visual("skyforge"),
	landmark: () => visual("landmark")
};
function WorkVisual({ item }) {
	return visual(item.id);
}
function BrowserFrame({ url, children }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "frame",
		cmsTag: "div",
		cmsSource: "components/WorkMocks.tsx:1",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			className: "frame-bar",
			cmsTag: "div",
			cmsSource: "components/WorkMocks.tsx:2",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "div",
				cmsSource: "components/WorkMocks.tsx:3",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/WorkMocks.tsx:4"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/WorkMocks.tsx:5"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/WorkMocks.tsx:6"
					})
				]
			}), /* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "span",
				cmsSource: "components/WorkMocks.tsx:7",
				children: url
			})]
		}), /* @__PURE__ */ jsx(CmsElement, {
			className: "frame-body",
			cmsTag: "div",
			cmsSource: "components/WorkMocks.tsx:8",
			children
		})]
	});
}
// src/components/Work.tsx
var BUBBLES = [
	[
		"8%",
		".9rem",
		"0s"
	],
	[
		"22%",
		".5rem",
		"1.4s"
	],
	[
		"41%",
		"1.2rem",
		"2.6s"
	],
	[
		"63%",
		".6rem",
		".7s"
	],
	[
		"79%",
		"1rem",
		"3.3s"
	],
	[
		"92%",
		".5rem",
		"2s"
	]
];
var TONES$1 = [
	"blue",
	"green",
	"pink",
	"yellow",
	"lilac"
];
function Work() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "projects",
		id: "work",
		cmsTag: "section",
		cmsSource: "components/Work.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "projects-heading",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Work.tsx:2",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/Work.tsx:3",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/Work.tsx:4"
						}), " Recent work"]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "h2",
						cmsSource: "components/Work.tsx:5",
						children: [
							"Stores, platforms",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "em",
								cmsSource: "components/Work.tsx:6",
								children: "and games we shipped."
							})
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "projects-sub",
						cmsTag: "p",
						cmsSource: "components/Work.tsx:7",
						children: "Online stores, platforms, business websites and games we've designed and built for our clients."
					})
				]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "project-stack",
				cmsTag: "div",
				cmsSource: "components/Work.tsx:8",
				children: projects.map((p, index) => {
					const Mock = mocks[p.id];
					return /* @__PURE__ */ jsxs(CmsElement, {
						className: `project-card project-card--${TONES$1[index % TONES$1.length]}`,
						"data-tilt": true,
						"data-cursor": "View",
						style: { "--card-index": index },
						cmsTag: "article",
						cmsSource: "components/Work.tsx:9",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								className: "bubbles",
								"aria-hidden": "true",
								cmsTag: "div",
								cmsSource: "components/Work.tsx:10",
								children: BUBBLES.map(([x, size, delay], b) => /* @__PURE__ */ jsx(CmsElement, {
									style: {
										"--x": x,
										"--s": size,
										"--d": delay
									},
									cmsTag: "i",
									cmsSource: "components/Work.tsx:11"
								}, b))
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "project-card-copy",
								cmsTag: "div",
								cmsSource: "components/Work.tsx:12",
								children: [
									/* @__PURE__ */ jsxs(CmsElement, {
										cmsTag: "span",
										cmsSource: "components/Work.tsx:13",
										children: [
											String(index + 1).padStart(2, "0"),
											" /",
											" ",
											String(projects.length).padStart(2, "0")
										]
									}),
									/* @__PURE__ */ jsx(CmsElement, {
										className: p.name.length > 9 ? "is-long" : void 0,
										cmsTag: "h3",
										cmsSource: "components/Work.tsx:14",
										children: p.name
									}),
									/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "p",
										cmsSource: "components/Work.tsx:15",
										children: p.summary
									}),
									/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "div",
										cmsSource: "components/Work.tsx:16",
										children: p.tags.map((t) => /* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "span",
											cmsSource: "components/Work.tsx:17",
											children: t
										}, t))
									})
								]
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "project-visual",
								cmsTag: "div",
								cmsSource: "components/Work.tsx:18",
								children: /* @__PURE__ */ jsx(CmsElement, {
									className: "project-frame",
									cmsTag: "div",
									cmsSource: "components/Work.tsx:19",
									children: /* @__PURE__ */ jsx(BrowserFrame, {
										url: p.url,
										children: /* @__PURE__ */ jsx(Mock, {})
									})
								})
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "projects-more",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/Work.tsx:20",
				children: /* @__PURE__ */ jsxs(Button3D, {
					href: "/work",
					tone: "ink",
					children: ["See all work ", /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 17 })]
				})
			})
		]
	});
}
// src/data/testimonials.ts
var testimonials = [
	{
		quote: "Sybertron has been my go-to for all my web development needs. As a designer I always wanted my own development team for the back end, and now I run a full web agency because of them. A great team to work with.",
		name: "A Sample",
		role: "CEO, Sample Studio"
	},
	{
		quote: "The team is amazing. They know what they're doing. I'm not tech-savvy, and building an online presence wasn't easy. They guided me through every stage, from the logo to the store to a successful launch.",
		name: "R Sample",
		role: "Founder & CEO"
	},
	{
		quote: "We needed a portal our customers could actually use. They listened, built it in phases and never let a deadline slip. Support after launch has been just as good as the build.",
		name: "K Sample",
		role: "Operations Head, Sample Logistics"
	},
	{
		quote: "They took a messy spreadsheet process and turned it into a clean system our whole team uses every day. Fewer errors, faster reports and no more chasing people for updates.",
		name: "M Sample",
		role: "Managing Director"
	},
	{
		quote: "Honest about timelines and costs from the first call. The estimate they gave us was the amount we paid, which has not been my experience with other agencies.",
		name: "S Sample",
		role: "Co-founder, Sample Retail"
	},
	{
		quote: "Our mobile app went from sketch to the store in a few months. Updates since then have been quick, and our users keep telling us how smooth it feels.",
		name: "P Sample",
		role: "Product Lead"
	}
];
// src/components/Testimonials.tsx
var DURATION = 8;
function Testimonials() {
	const ref = useRef(null);
	const inView = useInView(ref, { amount: .3 });
	const [per, setPer] = useState(2);
	const [page, setPage] = useState(0);
	const [hover, setHover] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(min-width: 900px)");
		const set = () => {
			setPer(mq.matches ? 2 : 1);
			setPage(0);
		};
		set();
		mq.addEventListener("change", set);
		return () => mq.removeEventListener("change", set);
	}, []);
	const pages = Math.ceil(testimonials.length / per);
	const go = (n) => setPage((n + pages) % pages);
	const items = testimonials.slice(page * per, page * per + per);
	const paused = hover || !inView;
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "section testimonials",
		id: "testimonials",
		ref,
		cmsTag: "section",
		cmsSource: "components/Testimonials.tsx:1",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Nice things, unprompted",
				title: "What our clients",
				em: "say.",
				copy: "Good partnerships make better work. Here is what a few of ours have told us."
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "testimonial-grid is-visible",
				onMouseEnter: () => setHover(true),
				onMouseLeave: () => setHover(false),
				"aria-live": "polite",
				cmsTag: "div",
				cmsSource: "components/Testimonials.tsx:2",
				children: items.map((t, index) => /* @__PURE__ */ jsxs(CmsElement, {
					className: "quote-card",
					style: { "--stagger": index },
					cmsTag: "figure",
					cmsSource: "components/Testimonials.tsx:3",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							className: "quote-mark",
							cmsTag: "div",
							cmsSource: "components/Testimonials.tsx:4",
							children: "“"
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "blockquote",
							cmsSource: "components/Testimonials.tsx:5",
							children: t.quote.split(" ").map((w, i) => /* @__PURE__ */ jsx(CmsElement, {
								className: "q-word",
								style: { "--w": `${.25 + index * .14 + i * .018}s` },
								cmsTag: "span",
								cmsSource: "components/Testimonials.tsx:6",
								children: w
							}, i))
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "figcaption",
							cmsSource: "components/Testimonials.tsx:7",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "b",
								cmsSource: "components/Testimonials.tsx:8",
								children: t.name
							}), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/Testimonials.tsx:9",
								children: t.role
							})]
						})
					]
				}, `${per}-${page}-${t.name}`))
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "t-controls",
				cmsTag: "div",
				cmsSource: "components/Testimonials.tsx:10",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						onClick: () => go(page - 1),
						"aria-label": "Previous testimonials",
						cmsTag: "button",
						cmsSource: "components/Testimonials.tsx:11",
						children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18 })
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "t-dots",
						role: "tablist",
						"aria-label": "Testimonial pages",
						cmsTag: "div",
						cmsSource: "components/Testimonials.tsx:12",
						children: Array.from({ length: pages }).map((_, n) => {
							const on = n === page;
							return /* @__PURE__ */ jsx(CmsElement, {
								type: "button",
								role: "tab",
								"aria-selected": on,
								"aria-label": `Page ${n + 1}`,
								onClick: () => go(n),
								className: on ? "is-on" : void 0,
								cmsTag: "button",
								cmsSource: "components/Testimonials.tsx:13",
								children: on && /* @__PURE__ */ jsx(CmsElement, {
									className: "p-fill",
									style: {
										animationDuration: `${DURATION}s`,
										animationPlayState: paused ? "paused" : "running"
									},
									onAnimationEnd: () => setPage((p) => (p + 1) % pages),
									cmsTag: "span",
									cmsSource: "components/Testimonials.tsx:14"
								}, `${per}-${page}`)
							}, n);
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						onClick: () => go(page + 1),
						"aria-label": "Next testimonials",
						cmsTag: "button",
						cmsSource: "components/Testimonials.tsx:15",
						children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
					})
				]
			})
		]
	});
}
// src/data/offices.ts
var MON_FRI = [
	1,
	2,
	3,
	4,
	5
];
var offices = [
	{
		id: "california",
		city: "California",
		country: "USA",
		lat: 36.78,
		lon: -119.42,
		tz: "America/Los_Angeles",
		open: 540,
		close: 1080,
		workDays: MON_FRI,
		label: "left"
	},
	{
		id: "london",
		city: "London",
		country: "UK",
		lat: 51.51,
		lon: -.13,
		tz: "Europe/London",
		open: 540,
		close: 1080,
		workDays: MON_FRI,
		label: "right"
	},
	{
		id: "dubai",
		city: "Dubai",
		country: "UAE",
		lat: 25.2,
		lon: 55.27,
		tz: "Asia/Dubai",
		open: 540,
		close: 1080,
		workDays: MON_FRI,
		label: "left"
	},
	{
		id: "delhi",
		city: "Delhi",
		country: "India",
		lat: 28.61,
		lon: 77.21,
		tz: "Asia/Kolkata",
		open: 540,
		close: 1080,
		workDays: MON_FRI,
		label: "right"
	}
];
var urgentHelp = {
	lead: "Something broken in your tech or marketing?",
	rest: "We can help today.",
	cta: {
		label: "RAPID RESPONSE",
		href: "/urgent"
	},
	whatsapp: {
		label: "Chat on WhatsApp",
		href: "https://wa.me/10000000000"
	}
};
// src/data/worldMask.ts
var MAP_STEP_DEG = 2.4;
var LAND_ROWS = [
	"000000000000000000000000000000000000011111111111011111111111111111001000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	"000000000000000000000000000000000001111111110000111111111111111111100000000000011110000000000000000000000000000000111000000000000000000000000000000000",
	"000000000000000000000000011000000001001111100111111111111111111111100000000000000100000000000000000000000000000000000110000000000000000000000000000000",
	"000000000000000000000000000010000000011110000000000111111111111111100000000000000000000000000000001100000000000111111111100000000000000000000000000000",
	"000000000000000000000001101111100111011110110000000011111111111110000000000000000000000000000000010000001011011111111111111111111000011110000000000000",
	"000000011111111100001100001111111011100100011110000011111111111110000000000000000001111110000000000000011011111111111111111111111111111111111100001100",
	"110000011111111111111111111111111111110110010111000001111111100000000000000000000111111111110101111111111011111111111111111111111111111111111111111111",
	"001000111111111111111111111111111111111100111110000001111100000001111000000000001111011111101111111111111111111111111111111111111111111111111111111111",
	"000000111111111111111111111111111111100010000010000000111000000000000000000001111100111111111111111111111111111111111111111111111111111111111111111111",
	"000001111110100111111111111111111111000000011100000000001000000000000000000001111110100111111111111111111111111111111111111111111111111111110011100000",
	"000000000100000000011111111111111111000000011111100000000000000000000000000000001100011111111111111111111111111111111111111111111111100000001110000000",
	"000000010000000000001111111111111111111000011111110000000000000000000000010000101000111111111111111111111111111111111111111111111111000000001100000000",
	"000000000000000000000111111111111111111110111111111100000000000000000001011001111111111111111111111111111111111111111111111111111111111000001000000000",
	"000000000000000000000111111111111111111111111111110100000000000000000000010011111111111111111111111111111111111111111111111111111111111000000000000000",
	"000000000000000000000000111111111111111111111111001110000000000000000000011111111111111111111111111111111111111111111111111111111111100000000000000000",
	"000000000000000000000001111111111111111111111111110000000000000000000000001111111111111101011110011111111111111111111111111111111111000000000000000000",
	"000000000000000000000001111111111111111111111100000000000000000000000001111111011011111000001110111111111111111111111111111111111110001100000000000000",
	"000000000000000000000001111111111111111111110000000000000000000000000001111000000101111111111111001111111111111111111111111111111000010000000000000000",
	"000000000000000000000000111111111111111111110000000000000000000000000001111000000000101111111110011111111111111111111111111100010000010000000000000000",
	"000000000000000000000000111111111111111111100000000000000000000000000000100111100000000110111111111111111111111111111111111110001000110000000000000000",
	"000000000000000000000000001111111111111111000000000000000000000000000000111111100000000000111111111111111111111111111111111110000111000000000000000000",
	"000000000000000000000000001011111111111110000000000000000000000000000001111111111101110101111111111111111111111111111111111111000100000000000000000000",
	"000000000000000000000000000111111110000010000000000000000000000000000001111111111111111110111110111111111111111111111111111111000000000000000000000000",
	"000000000000000000000000000011111100000001100000000000000000000000000111111111111111111110111111000111111111111111111111111110000000000000000000000000",
	"000000000000000000000000000000111100000000000000000000000000000000000111111111111111111111011111101000011111111111111111111101000000000000000000000000",
	"000000000000000000000000000000011100000000100000000000000000000000001111111111111111111111011111111100001111111101111111110000000000000000000000000000",
	"000000000000000000000000000000011110011000000100000000000000000000001111111111111111111111101111111000000111110000111110100000000000000000000000000000",
	"000000000000000000000000000000000111110000000000000000000000000000001111111111111111111111100111110000000011100000111111000001000000000000000000000000",
	"000000000000000000000000000000000000011100000000000000000000000000001111111111111111111111110111000000000011000000001111000001000000000000000000000000",
	"000000000000000000000000000000000000000100000000000000000000000000001111111111111111111111111000000000000011000000001011100000000000000000000000000000",
	"000000000000000000000000000000000000000100011111100000000000000000000111111111111111111111111111000000000001000000000000000010000000000000000000000000",
	"000000000000000000000000000000000000000001111111111000000000000000000011111111111111111111111111000000000000100000001000000000010000000000000000000000",
	"000000000000000000000000000000000000000000011111111110000000000000000001101001111111111111111110000000000000000000010100000110000000000000000000000000",
	"000000000000000000000000000000000000000000111111111111000000000000000000000000011111111111111100000000000000000000001100011100000000000000000000000000",
	"000000000000000000000000000000000000000000111111111111000000000000000000000000011111111111111000000000000000000000001100111100000000000000000000000000",
	"000000000000000000000000000000000000000001111111111111110000000000000000000000011111111111110000000000000000000000000110011101000010100000000000000000",
	"000000000000000000000000000000000000000001111111111111111110000000000000000000001111111111100000000000000000000000000010000000000000111100000000000000",
	"000000000000000000000000000000000000000000111111111111111111000000000000000000001111111111100000000000000000000000000001110000000000011100000000000000",
	"000000000000000000000000000000000000000000111111111111111111000000000000000000001111111111110000000000000000000000000000000000000000000010000000000000",
	"000000000000000000000000000000000000000000011111111111111110000000000000000000000111111111110000000000000000000000000000000000000010001000000000000000",
	"000000000000000000000000000000000000000000011111111111111110000000000000000000001111111111110001000000000000000000000000000000000111001000000000000000",
	"000000000000000000000000000000000000000000000111111111111110000000000000000000001111111111100111000000000000000000000000000000111111101100000000000001",
	"000000000000000000000000000000000000000000000011111111111100000000000000000000001111111111000110000000000000000000000000000000111111111100000000000000",
	"000000000000000000000000000000000000000000000011111111111100000000000000000000000111111111000110000000000000000000000000000111111111111110000000000000",
	"000000000000000000000000000000000000000000000011111111110000000000000000000000000111111111000110000000000000000000000000001111111111111111000000000000",
	"000000000000000000000000000000000000000000000011111111100000000000000000000000000111111110000000000000000000000000000000001111111111111111100000000000",
	"000000000000000000000000000000000000000000000111111111100000000000000000000000000011111100000000000000000000000000000000000111111111111111100000000000",
	"000000000000000000000000000000000000000000000111111111000000000000000000000000000011111100000000000000000000000000000000000111111111111111100000000000",
	"000000000000000000000000000000000000000000000111111110000000000000000000000000000001110000000000000000000000000000000000000111100001111111000000000000",
	"000000000000000000000000000000000000000000000111111000000000000000000000000000000000000000000000000000000000000000000000000000000000011111000000000100",
	"000000000000000000000000000000000000000000001111111000000000000000000000000000000000000000000000000000000000000000000000000000000000001100000000000010",
	"000000000000000000000000000000000000000000001111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010",
	"000000000000000000000000000000000000000000000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000",
	"000000000000000000000000000000000000000000001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000",
	"000000000000000000000000000000000000000000001111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	"000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	"000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	"000000000000000000000000000000000000000000000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
];
// src/components/GlobalPresence.tsx
var CELL = 10;
var W = 150 * CELL;
var H = 59 * CELL;
var LAT_SPAN = 59 * MAP_STEP_DEG;
var ARC_TIME = 1.1;
var project = (lat, lon) => ({
	x: (lon + 180) / 360 * W,
	y: (83 - lat) / LAT_SPAN * H
});
var LAND_PATH = LAND_ROWS.flatMap((row, j) => Array.from(row).flatMap((c, i) => c === "1" ? [`M${i * CELL + CELL / 2} ${j * CELL + CELL / 2}h0`] : [])).join("");
function arc(a, b) {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const len = Math.hypot(dx, dy);
	const cx = (a.x + b.x) / 2 + dy / len * len * .24;
	const cy = (a.y + b.y) / 2 - dx / len * len * .24;
	return `M${a.x} ${a.y}Q${cx} ${cy} ${b.x} ${b.y}`;
}
var DAYS$1 = {
	Sun: 0,
	Mon: 1,
	Tue: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6
};
function localStatus(o, now) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: o.tz,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
		weekday: "short"
	}).formatToParts(now);
	const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
	const hh = get("hour");
	const mm = get("minute");
	const mins = Number(hh) * 60 + Number(mm);
	const isOpen = o.workDays.includes(DAYS$1[get("weekday")]) && mins >= o.open && mins < o.close;
	return {
		time: `${hh}:${mm}`,
		isOpen
	};
}
function useNow() {
	const [now, setNow] = useState(null);
	useEffect(() => {
		setNow(/* @__PURE__ */ new Date());
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e4);
		return () => clearInterval(id);
	}, []);
	return now;
}
function GlobalPresence({ talk, urgentHref = urgentHelp.cta.href }) {
	const ref = useRef(null);
	const inView = useInView(ref, {
		once: true,
		amount: .35
	});
	const reduce = prefersReducedMotion();
	const now = useNow();
	const [hot, setHot] = useState(null);
	const pins = useMemo(() => offices.map((o) => ({
		o,
		...project(o.lat, o.lon)
	})), []);
	const arcs = useMemo(() => pins.slice(1).map((p, i) => arc(pins[i], p)), [pins]);
	const status = useMemo(() => Object.fromEntries(offices.map((o) => [o.id, now ? localStatus(o, now) : null])), [now]);
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: inView ? "presence is-visible" : "presence",
		id: "locations",
		"aria-labelledby": "locations-title",
		ref,
		cmsTag: "section",
		cmsSource: "components/GlobalPresence.tsx:1",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				id: "locations-title",
				className: "sr-only",
				cmsTag: "h2",
				cmsSource: "components/GlobalPresence.tsx:2",
				children: "Our offices and opening hours"
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "urgent",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/GlobalPresence.tsx:3",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/GlobalPresence.tsx:4",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "urgent-dot",
						"aria-hidden": "true",
						cmsTag: "span",
						cmsSource: "components/GlobalPresence.tsx:5"
					}), /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/GlobalPresence.tsx:6",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "strong",
								cmsSource: "components/GlobalPresence.tsx:7",
								children: urgentHelp.lead
							}),
							" ",
							urgentHelp.rest
						]
					})]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "div",
					cmsSource: "components/GlobalPresence.tsx:8",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "button-3d button-3d--coral",
						href: urgentHref,
						cmsTag: "a",
						cmsSource: "components/GlobalPresence.tsx:9",
						children: urgentHelp.cta.label
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "text-link",
						href: urgentHelp.whatsapp.href,
						target: "_blank",
						rel: "noopener noreferrer",
						cmsTag: "a",
						cmsSource: "components/GlobalPresence.tsx:10",
						children: urgentHelp.whatsapp.label
					})]
				})]
			}),
			talk,
			/* @__PURE__ */ jsx(CmsElement, {
				className: "map-band",
				cmsTag: "div",
				cmsSource: "components/GlobalPresence.tsx:11",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "map",
					style: { aspectRatio: `${W} / ${H}` },
					cmsTag: "div",
					cmsSource: "components/GlobalPresence.tsx:12",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						viewBox: `0 0 ${W} ${H}`,
						role: "img",
						"aria-label": `World map linking our offices in ${offices.map((o) => o.city).join(", ")}`,
						cmsTag: "svg",
						cmsSource: "components/GlobalPresence.tsx:13",
						children: [
							/* @__PURE__ */ jsx("path", {
								d: LAND_PATH,
								fill: "none",
								stroke: "var(--ink)",
								strokeOpacity: .28,
								strokeWidth: 4.2,
								strokeLinecap: "round"
							}),
							arcs.map((d, i) => {
								const begin = 3.6400000000000006 + i * 1.4;
								return /* @__PURE__ */ jsxs("g", { children: [
									/* @__PURE__ */ jsx("path", {
										d,
										fill: "none",
										stroke: "var(--line)",
										strokeWidth: 2
									}),
									/* @__PURE__ */ jsx("path", {
										className: "map-arc",
										d,
										pathLength: 1,
										fill: "none",
										stroke: "var(--lilac-deep)",
										strokeWidth: 3,
										strokeLinecap: "round",
										style: {
											strokeDasharray: 1,
											strokeDashoffset: inView || reduce ? 0 : 1,
											transition: reduce ? "none" : `stroke-dashoffset ${ARC_TIME}s cubic-bezier(.16,1,.3,1) ${.2 + i * ARC_TIME * .8}s`
										}
									}),
									inView && !reduce && /* @__PURE__ */ jsxs("circle", {
										r: 5,
										fill: "var(--coral)",
										stroke: "var(--ink)",
										strokeWidth: 1.5,
										children: [/* @__PURE__ */ jsx("animateMotion", {
											dur: "5.5s",
											begin: `${begin}s`,
											repeatCount: "indefinite",
											path: d,
											keyPoints: "0;1",
											keyTimes: "0;1",
											calcMode: "linear"
										}), /* @__PURE__ */ jsx("animate", {
											attributeName: "opacity",
											values: "0;1;1;0",
											keyTimes: "0;0.15;0.85;1",
											dur: "5.5s",
											begin: `${begin}s`,
											repeatCount: "indefinite"
										})]
									})
								] }, d);
							}),
							pins.map(({ o, x, y }, i) => {
								const open = status[o.id]?.isOpen;
								const color = open ? "var(--lilac-deep)" : "var(--muted)";
								return /* @__PURE__ */ jsxs("g", {
									className: "map-pin",
									style: {
										opacity: inView || reduce ? 1 : 0,
										transition: `opacity .5s ${.1 + i * ARC_TIME * .8}s`
									},
									children: [
										open && /* @__PURE__ */ jsx("circle", {
											className: "a-ring",
											cx: x,
											cy: y,
											r: 9,
											fill: "none",
											stroke: color,
											strokeWidth: 1.5
										}),
										/* @__PURE__ */ jsx("circle", {
											cx: x,
											cy: y,
											r: hot === o.id ? 13 : 10,
											fill: "var(--white)",
											stroke: "var(--ink)",
											strokeWidth: 2,
											style: { transition: "r .25s" }
										}),
										/* @__PURE__ */ jsx("circle", {
											cx: x,
											cy: y,
											r: 4.5,
											fill: open ? "var(--mint-deep)" : color
										})
									]
								}, o.id);
							})
						]
					}), pins.map(({ o, x, y }) => /* @__PURE__ */ jsx(CmsElement, {
						onMouseEnter: () => setHot(o.id),
						onMouseLeave: () => setHot(null),
						className: hot === o.id ? "map-label is-hot" : "map-label",
						style: {
							top: `${y / H * 100}%`,
							...o.label === "left" ? { right: `${100 - x / W * 100 + 1.6}%` } : { left: `${x / W * 100 + 1.6}%` }
						},
						cmsTag: "span",
						cmsSource: "components/GlobalPresence.tsx:14",
						children: o.city
					}, o.id))]
				})
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "offices",
				"data-reveal": true,
				cmsTag: "ul",
				cmsSource: "components/GlobalPresence.tsx:15",
				children: offices.map((o, index) => {
					const s = status[o.id];
					return /* @__PURE__ */ jsxs(CmsElement, {
						className: hot === o.id ? "is-hot" : void 0,
						style: { "--stagger": index },
						onMouseEnter: () => setHot(o.id),
						onMouseLeave: () => setHot(null),
						cmsTag: "li",
						cmsSource: "components/GlobalPresence.tsx:16",
						children: [
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "office-top",
								cmsTag: "div",
								cmsSource: "components/GlobalPresence.tsx:17",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "span",
									cmsSource: "components/GlobalPresence.tsx:18",
									children: o.country
								}), /* @__PURE__ */ jsxs(CmsElement, {
									"aria-live": "polite",
									cmsTag: "span",
									cmsSource: "components/GlobalPresence.tsx:19",
									children: [/* @__PURE__ */ jsx(CmsElement, {
										className: s ? s.isOpen ? "open" : "closed" : void 0,
										cmsTag: "i",
										cmsSource: "components/GlobalPresence.tsx:20"
									}), s ? s.isOpen ? "Open now" : "Closed now" : "\xA0"]
								})]
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "office-city",
								cmsTag: "p",
								cmsSource: "components/GlobalPresence.tsx:21",
								children: o.city
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "office-time",
								cmsTag: "p",
								cmsSource: "components/GlobalPresence.tsx:22",
								children: /* @__PURE__ */ jsx(CmsElement, {
									dateTime: s?.time,
									cmsTag: "time",
									cmsSource: "components/GlobalPresence.tsx:23",
									children: s ? s.time : "--:--"
								})
							})
						]
					}, o.id);
				})
			})
		]
	});
}
// src/components/CallToAction.tsx
var ROTATING = [
	"AI system?",
	"online store?",
	"mobile app?",
	"ERP?",
	"SaaS product?"
];
var SERVICES$1 = [
	"AI agent development",
	"Shopify & ecommerce development",
	"iOS & Android app development",
	"Web portal development",
	"SaaS product development",
	"Digital marketing & SEO",
	"AI automation",
	"Custom software development"
];
function CallToAction() {
	const ref = useRef(null);
	const inView = useInView(ref, { amount: .3 });
	const [w, setW] = useState(0);
	useEffect(() => {
		if (!inView || prefersReducedMotion()) return;
		const id = setInterval(() => setW((n) => (n + 1) % ROTATING.length), 2400);
		return () => clearInterval(id);
	}, [inView]);
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "cta-section",
		id: "contact",
		"data-reveal": true,
		ref,
		cmsTag: "section",
		cmsSource: "components/CallToAction.tsx:1",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "cta-star",
				"data-parallax": "0.12",
				cmsTag: "div",
				cmsSource: "components/CallToAction.tsx:2",
				children: /* @__PURE__ */ jsx(Sparkles$1, { size: 32 })
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "eyebrow",
				cmsTag: "p",
				cmsSource: "components/CallToAction.tsx:3",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/CallToAction.tsx:4"
					}),
					" Software development company",
					locations.map((l) => ` · ${l}`)
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "h2",
				cmsSource: "components/CallToAction.tsx:5",
				children: [
					"Ready to build your",
					/* @__PURE__ */ jsx("br", {}),
					"website, app or",
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "rotator",
						cmsTag: "em",
						cmsSource: "components/CallToAction.tsx:6",
						children: /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/CallToAction.tsx:7",
							children: ROTATING[w]
						}, w)
					})
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "p",
				cmsSource: "components/CallToAction.tsx:8",
				children: [
					"Since ",
					FOUNDED,
					" we have delivered more than",
					" ",
					stats[0].value.toLocaleString("en-US"),
					" projects: custom websites and web portals, Shopify and WooCommerce stores, iOS and Android apps, AI agents and automations, SaaS products, ERP systems and digital marketing. Tell us what you need and we will reply within one business day."
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "cta-actions",
				cmsTag: "div",
				cmsSource: "components/CallToAction.tsx:9",
				children: [/* @__PURE__ */ jsxs(Button3D, {
					href: "#quote",
					tone: "mint",
					children: ["Get a free project quote ", /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 17 })]
				}), /* @__PURE__ */ jsx(Button3D, {
					href: "#products",
					tone: "paper",
					children: "Try a product demo"
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "cta-services",
				cmsTag: "div",
				cmsSource: "components/CallToAction.tsx:10",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/CallToAction.tsx:11",
					children: "Popular services"
				}), /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/CallToAction.tsx:12",
					children: SERVICES$1.map((s) => /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/CallToAction.tsx:13",
						children: /* @__PURE__ */ jsx(CmsElement, {
							className: "text-link",
							href: "#services",
							cmsTag: "a",
							cmsSource: "components/CallToAction.tsx:14",
							children: s
						})
					}, s))
				})]
			})
		]
	});
}
// src/data/footer.ts
var footerGroups = [
	{
		title: "Services",
		links: [
			"AI Automations",
			"AI Agent Development",
			"AI Model Integration",
			"Web Portals",
			"Ecommerce",
			"Mobile Apps",
			"Game Development",
			"AR/VR",
			"Digital Marketing",
			"Custom Development",
			"Plugin Development",
			"ERP Systems",
			"SaaS Product Development"
		].map((label, i) => ({
			label,
			href: `/services/${[
				"ai",
				"ai-agents",
				"ai-models",
				"web-portals",
				"ecommerce",
				"mobile-apps",
				"games",
				"ar-vr",
				"marketing",
				"custom",
				"plugins",
				"erp",
				"saas"
			][i]}`
		}))
	},
	{
		title: "Products",
		links: [
			{
				label: "PeopleDesk",
				href: "/products/peopledesk"
			},
			{
				label: "LeadFlow CRM",
				href: "/products/leadflow"
			},
			{
				label: "DineOS",
				href: "/products/dineos"
			},
			{
				label: "StockPilot",
				href: "/products/stockpilot"
			},
			{
				label: "All products",
				href: "/products"
			}
		]
	},
	{
		title: "Company",
		links: [
			{
				label: "Work",
				href: "/work"
			},
			{
				label: "About",
				href: "/about"
			},
			{
				label: "Careers",
				href: "/careers"
			},
			{
				label: "Blog",
				href: "/blog"
			},
			{
				label: "Contact",
				href: "#contact"
			},
			{
				label: "RAPID RESPONSE",
				href: "/urgent"
			}
		]
	}
];
var socials = [
	{
		id: "facebook",
		label: "Sybertron on Facebook",
		href: "https://facebook.com"
	},
	{
		id: "instagram",
		label: "Sybertron on Instagram",
		href: "https://instagram.com"
	},
	{
		id: "linkedin",
		label: "Sybertron on LinkedIn",
		href: "https://linkedin.com"
	}
];
var legalLinks = [
	{
		label: "Privacy policy",
		href: "/privacy"
	},
	{
		label: "Terms and conditions",
		href: "/terms"
	},
	{
		label: "Cookie policy",
		href: "/cookies"
	}
];
var utilityLinks = [{
	label: "Cookie settings",
	href: "#cookie-settings"
}, {
	label: "Lite version",
	href: "/lite"
}];
// src/components/Footer.tsx
var ICONS$2 = {
	facebook: FaFacebook,
	instagram: FaInstagram,
	linkedin: FaLinkedin
};
function Footer({ route = "home" }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		cmsTag: "footer",
		cmsSource: "components/Footer.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "footer-brand",
				cmsTag: "div",
				cmsSource: "components/Footer.tsx:2",
				children: [
					/* @__PURE__ */ jsx(Wordmark, { footer: true }),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/Footer.tsx:3",
						children: [
							"Websites, apps, AI and marketing for growing businesses since ",
							FOUNDED,
							"."
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "footer-socials",
						cmsTag: "ul",
						cmsSource: "components/Footer.tsx:4",
						children: socials.map((s) => {
							const Icon = ICONS$2[s.id];
							return /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "li",
								cmsSource: "components/Footer.tsx:5",
								children: /* @__PURE__ */ jsx(CmsElement, {
									href: s.href,
									target: "_blank",
									rel: "noopener noreferrer",
									"aria-label": s.label,
									cmsTag: "a",
									cmsSource: "components/Footer.tsx:6",
									children: /* @__PURE__ */ jsx(Icon, {
										size: 17,
										"aria-hidden": true
									})
								})
							}, s.id);
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "footer-groups",
				"aria-label": "Footer",
				cmsTag: "nav",
				cmsSource: "components/Footer.tsx:7",
				children: footerGroups.map((g) => /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "div",
					cmsSource: "components/Footer.tsx:8",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "h2",
						cmsSource: "components/Footer.tsx:9",
						children: g.title
					}), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "ul",
						cmsSource: "components/Footer.tsx:10",
						children: g.links.map((l) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/Footer.tsx:11",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: hrefFor(l.href, route),
								cmsTag: "a",
								cmsSource: "components/Footer.tsx:12",
								children: l.label
							})
						}, l.label))
					})]
				}, g.title))
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "footer-meta",
				cmsTag: "div",
				cmsSource: "components/Footer.tsx:13",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/Footer.tsx:14",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Sybertron Technologies. All rights reserved."
						]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "ul",
						cmsSource: "components/Footer.tsx:15",
						children: [legalLinks.map((l) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/Footer.tsx:16",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: l.href,
								cmsTag: "a",
								cmsSource: "components/Footer.tsx:17",
								children: l.label
							})
						}, l.label)), utilityLinks.map((l) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/Footer.tsx:18",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: l.href,
								cmsTag: "a",
								cmsSource: "components/Footer.tsx:19",
								children: l.label
							})
						}, l.label))]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "ul",
						cmsSource: "components/Footer.tsx:20",
						children: offices.map((o) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/Footer.tsx:21",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: "#locations",
								cmsTag: "a",
								cmsSource: "components/Footer.tsx:22",
								children: o.city
							})
						}, o.id))
					})
				]
			})
		]
	});
}
// src/data/careers.ts
var roles = [
	{
		id: "sales",
		title: "Sales / Business Development Executive",
		team: "Sales",
		type: "Full-time",
		location: "Delhi (on-site)",
		summary: "Find and win new clients for our websites, apps and software, by phone and in person.",
		open: true
	},
	{
		id: "social",
		title: "Social Media Executive",
		team: "Marketing",
		type: "Full-time",
		summary: "Grow our presence across platforms with 3+ years of content and performance marketing experience.",
		open: true
	},
	{
		id: "ecom",
		title: "E-commerce Expert",
		team: "Commerce",
		type: "Full-time",
		summary: "Grow sales on Amazon, eBay and Shopify through listings, ads, inventory and service.",
		open: true
	},
	{
		id: "video",
		title: "Video Editor & Animator",
		team: "Creative",
		type: "Junior–Mid",
		summary: "Create AI-assisted and traditionally edited videos, plus basic graphic design.",
		open: true
	},
	{
		id: "qa-intern",
		title: "Quality Assurance (QA) Intern",
		team: "Quality",
		type: "Internship",
		summary: "Learn manual and automated testing with our product quality team.",
		open: true
	},
	{
		id: "anim-intern",
		title: "Animator / Graphic Designer Intern",
		team: "Creative",
		type: "Internship",
		summary: "Bring visual stories to life with animation and design.",
		open: true
	},
	{
		id: "mern",
		title: "Full Stack MERN Developer",
		team: "Engineering",
		type: "Full-time",
		summary: "Own projects end to end, from architecture to deployment, with minimal supervision.",
		open: false
	},
	{
		id: "ml",
		title: "AI/ML Engineer",
		team: "Engineering",
		type: "Full-time",
		summary: "Design, build and deploy machine learning solutions that work with large-scale data.",
		open: false
	},
	{
		id: "qa",
		title: "Quality Assurance (QA) Engineer",
		team: "Quality",
		type: "Full-time",
		summary: "Plan and run manual and automated testing across web and mobile products.",
		open: false
	},
	{
		id: "unity",
		title: "Game Development Intern (Unity)",
		team: "Engineering",
		type: "Internship · On-site",
		summary: "Build and test games in Unity and C# alongside experienced developers.",
		open: false
	},
	{
		id: "ux",
		title: "UI/UX Intern",
		team: "Design",
		type: "Internship",
		summary: "Help design user flows and interfaces with our product design team.",
		open: false
	}
];
// src/data/about.ts
var officeNotes = {
	california: "US clients, since 2010",
	london: "Client team, since 2015",
	dubai: "UAE and Gulf region, since 2019",
	delhi: `Where it started, in ${FOUNDED}`
};
var chapters = [
	{
		year: FOUNDED,
		label: "Founded",
		title: "Sybertron is founded in Delhi, India",
		text: "We start out with a focus on custom websites and web development for growing businesses."
	},
	{
		year: 2010,
		label: "California",
		title: "Presence in California",
		text: "Our first base outside India brings us closer to clients in the United States."
	},
	{
		year: 2012,
		label: "First product",
		title: "Our first product: timesheet management",
		text: "We develop our first in-house product, a timesheet management system for tracking staff hours and project time."
	},
	{
		year: 2014,
		label: "100 websites",
		title: "100 websites delivered",
		text: "We reach 100 websites delivered to clients."
	},
	{
		year: 2015,
		label: "London",
		title: "Presence in London",
		text: "We start working in London to serve clients across the United Kingdom."
	},
	{
		year: 2016,
		label: "Mobile",
		title: "First mobile app launched",
		text: "We develop our first mobile app, and mobile development becomes a core service."
	},
	{
		year: 2018,
		label: "Enterprise",
		title: "Enterprise systems and ERP",
		text: "We extend our services to ERP, dashboards and workflow platforms for larger organisations."
	},
	{
		year: 2019,
		label: "Dubai",
		title: "Presence in Dubai",
		text: "We set up in Dubai to support clients in the UAE and the wider Gulf region."
	},
	{
		year: 2020,
		label: "Marketing",
		title: "360° digital marketing",
		text: "We add SEO, paid media and content, so clients can build and grow with one team."
	},
	{
		year: 2021,
		label: "SaaS",
		title: "Our SaaS range launches",
		text: "We launch software for SMEs, shaped by what we keep hearing from client teams."
	},
	{
		year: 2023,
		label: "AI",
		title: "AI development practice",
		text: "We introduce AI agents, chatbots and document automation for clients and our own products."
	},
	{
		year: (/* @__PURE__ */ new Date()).getFullYear(),
		label: "Today",
		title: "28 in-house products",
		text: "Today we offer 28 in-house products alongside client work, with a presence in four countries."
	}
];
var promises = [
	{
		title: "Expertise and experience",
		text: "Project managers, analysts, designers, developers and QA engineers who have shipped more than 1,000 projects together."
	},
	{
		title: "New technology, tested first",
		text: "We try new tools on our own products before we suggest them to you, so you only pay for what has proved itself."
	},
	{
		title: "Built around your business",
		text: "We start by learning how your business runs, then build to fit it, rather than squeezing you into a template."
	},
	{
		title: "Reliable support",
		text: "Many of our clients have been with us for years. We look after their sites and apps after launch and fix problems before they cost money."
	}
];
var mission = {
	tag: "Mission",
	when: "Today",
	title: "Help every business run better, and keep getting better at it ourselves.",
	points: [
		{
			icon: "cpu",
			text: "Learn new technology early, and use it carefully"
		},
		{
			icon: "bulb",
			text: "A team that cares about the details"
		},
		{
			icon: "trend",
			text: "Help clients run smoother and get more done"
		}
	]
};
var vision = {
	tag: "Vision",
	when: "Tomorrow",
	title: "Technology that once took a big budget, within reach of every business.",
	points: [
		{
			icon: "rocket",
			text: "Custom software, cloud and AI at small-business prices"
		},
		{
			icon: "users",
			text: "Better ways to reach and keep customers"
		},
		{
			icon: "support",
			text: "Real people who answer when you need them"
		}
	]
};
var openRoles = roles.filter((r) => r.open).length;
var contactInfo = {
	email: "hello@sybertron.com",
	whatsapp: "https://wa.me/10000000000"
};
// src/components/about/AboutPage.tsx
var TEAM_PHOTO = "/images/team.webp";
var YEARS$1 = (/* @__PURE__ */ new Date()).getFullYear() - FOUNDED;
var SERVICES_COUNT = 13;
var COUNTRIES$1 = new Set(offices.map((o) => o.country)).size;
var stagger = (i) => ({ "--stagger": i });
function TeamPanel() {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "about-photo",
		"data-reveal": "scale",
		cmsTag: "figure",
		cmsSource: "components/about/AboutPage.tsx:1",
		children: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(CmsElement, {
			src: TEAM_PHOTO,
			alt: "Professionals collaborating around a laptop in an office",
			cmsTag: "img",
			cmsSource: "components/about/AboutPage.tsx:2"
		}), /* @__PURE__ */ jsx(CmsElement, {
			className: "team-photo-note",
			cmsTag: "figcaption",
			cmsSource: "components/about/AboutPage.tsx:3",
			children: "Representative team photography"
		})] })
	});
}
function AboutHero() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-hero",
		style: { "--intro": intro },
		cmsTag: "section",
		cmsSource: "components/about/AboutPage.tsx:10",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:11"
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--two",
				"data-parallax": "-0.1",
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:12"
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-hero-inner",
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:13",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/about/AboutPage.tsx:14",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/about/AboutPage.tsx:15"
							}),
							" About Sybertron · since ",
							FOUNDED
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						"aria-label": `${YEARS$1} years. Four cities. One team.`,
						cmsTag: "h1",
						cmsSource: "components/about/AboutPage.tsx:16",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:17",
							children: [
								/* @__PURE__ */ jsx(SplitWords, { text: `${YEARS$1} years.` }),
								/* @__PURE__ */ jsx(SplitWords, {
									text: "Four cities.",
									start: 2
								}),
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx(SplitWords, {
									text: "One team.",
									start: 4,
									em: true
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "about-lede",
						cmsTag: "p",
						cmsSource: "components/about/AboutPage.tsx:18",
						children: [
							"We started as a small web studio in Delhi, India in ",
							FOUNDED,
							". Today we have a presence in California, London, Dubai and Delhi, building websites, apps, AI and our own software products."
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "about-offices rv-stagger",
						"data-reveal": true,
						cmsTag: "ul",
						cmsSource: "components/about/AboutPage.tsx:19",
						children: offices.map((o, i) => /* @__PURE__ */ jsxs(CmsElement, {
							style: stagger(i),
							cmsTag: "li",
							cmsSource: "components/about/AboutPage.tsx:20",
							children: [
								/* @__PURE__ */ jsxs(CmsElement, {
									className: "about-office-country",
									cmsTag: "span",
									cmsSource: "components/about/AboutPage.tsx:21",
									children: [
										/* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "i",
											cmsSource: "components/about/AboutPage.tsx:22"
										}),
										" ",
										o.country
									]
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "h3",
									cmsSource: "components/about/AboutPage.tsx:23",
									children: o.city
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "p",
									cmsSource: "components/about/AboutPage.tsx:24",
									children: officeNotes[o.id]
								})
							]
						}, o.id))
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "metrics about-stats",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/about/AboutPage.tsx:25",
						children: [
							{
								label: "Years building software",
								value: `${YEARS$1}`
							},
							{
								label: "Projects delivered",
								value: `${stats[0].value}+`
							},
							{
								label: "In-house products",
								value: `${stats[1].value}`
							},
							{
								label: "Services under one roof",
								value: `${SERVICES_COUNT}`
							},
							{
								label: "Countries on three continents",
								value: `${COUNTRIES$1}`
							}
						].map((s, i) => /* @__PURE__ */ jsxs(CmsElement, {
							style: stagger(i),
							cmsTag: "div",
							cmsSource: "components/about/AboutPage.tsx:26",
							children: [/* @__PURE__ */ jsx(CountUp, { value: s.value }), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/about/AboutPage.tsx:27",
								children: s.label
							})]
						}, s.label))
					}),
					/* @__PURE__ */ jsx(TeamPanel, {})
				]
			})
		]
	});
}
function Story() {
	const items = useRef([]);
	const [active, setActive] = useState(0);
	const [seen, setSeen] = useState(/* @__PURE__ */ new Set());
	useEffect(() => {
		const els = items.current.filter(Boolean);
		const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
			if (e.isIntersecting) setActive(Number(e.target.dataset.i));
		}), { rootMargin: "-45% 0px -50% 0px" });
		const enter = new IntersectionObserver((entries) => entries.forEach((e) => {
			if (!e.isIntersecting) return;
			const i = Number(e.target.dataset.i);
			setSeen((s) => new Set(s).add(i));
			enter.unobserve(e.target);
		}), { threshold: .2 });
		els.forEach((el) => {
			spy.observe(el);
			enter.observe(el);
		});
		return () => {
			spy.disconnect();
			enter.disconnect();
		};
	}, []);
	const c = chapters[active];
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "section about-story",
		id: "story",
		cmsTag: "section",
		cmsSource: "components/about/AboutPage.tsx:28",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-story-grid",
			cmsTag: "div",
			cmsSource: "components/about/AboutPage.tsx:29",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-story-side",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:30",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/about/AboutPage.tsx:31",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:32"
						}), " The story so far"]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "h2",
						cmsSource: "components/about/AboutPage.tsx:33",
						children: [
							"From one studio to four countries,",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "em",
								cmsSource: "components/about/AboutPage.tsx:34",
								children: "one chapter at a time."
							})
						]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "about-year",
						"aria-hidden": "true",
						cmsTag: "div",
						cmsSource: "components/about/AboutPage.tsx:35",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:36",
							children: c.year
						}, c.year), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "small",
							cmsSource: "components/about/AboutPage.tsx:37",
							children: c.label
						}, c.label)]
					})
				]
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "about-chapters",
				style: { "--story-p": (active + 1) / chapters.length },
				cmsTag: "ol",
				cmsSource: "components/about/AboutPage.tsx:38",
				children: chapters.map((ch, i) => /* @__PURE__ */ jsxs(CmsElement, {
					"data-i": i,
					ref: (el) => {
						items.current[i] = el;
					},
					className: `chapter${i === active ? " is-active" : ""}${i < active ? " is-past" : ""}${seen.has(i) ? " is-seen" : ""}`,
					cmsTag: "li",
					cmsSource: "components/about/AboutPage.tsx:39",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "time",
							cmsSource: "components/about/AboutPage.tsx:40",
							children: ch.year
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "h3",
							cmsSource: "components/about/AboutPage.tsx:41",
							children: ch.title
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/about/AboutPage.tsx:42",
							children: ch.text
						})
					]
				}, ch.year))
			})]
		})
	});
}
var toneOf = (id) => categories.find((c) => c.id === id)?.tone ?? "var(--lilac)";
var labelOf = (id) => categories.find((c) => c.id === id)?.label ?? "";
function ProductTile({ p }) {
	const ref = useRef(null);
	useInView(ref, {
		once: true,
		amount: .2
	});
	return /* @__PURE__ */ jsxs(CmsElement, {
		ref,
		className: "ap-card",
		"data-reveal": true,
		style: { "--tone": toneOf(p.cat) },
		cmsTag: "article",
		cmsSource: "components/about/AboutPage.tsx:43",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "ap-mock",
				"data-tilt": true,
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:44",
				children: /* @__PURE__ */ jsx(CmsElement, {
					className: "ap-mock-inner",
					cmsTag: "div",
					cmsSource: "components/about/AboutPage.tsx:45",
					children: /* @__PURE__ */ jsx(ProductMock, { m: p.mock })
				})
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "ap-family",
				cmsTag: "p",
				cmsSource: "components/about/AboutPage.tsx:46",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						style: { background: p.accent },
						cmsTag: "i",
						cmsSource: "components/about/AboutPage.tsx:47"
					}),
					" ",
					labelOf(p.cat)
				]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "h3",
				cmsSource: "components/about/AboutPage.tsx:48",
				children: p.name
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "ap-blurb",
				cmsTag: "p",
				cmsSource: "components/about/AboutPage.tsx:49",
				children: p.blurb
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "ul",
				cmsSource: "components/about/AboutPage.tsx:50",
				children: p.bullets.map((b) => /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "li",
					cmsSource: "components/about/AboutPage.tsx:51",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						style: { background: p.accent },
						cmsTag: "i",
						cmsSource: "components/about/AboutPage.tsx:52"
					}), b]
				}, b))
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "ap-platforms",
				cmsTag: "p",
				cmsSource: "components/about/AboutPage.tsx:53",
				children: p.platforms
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "ap-actions",
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:54",
				children: [/* @__PURE__ */ jsxs(Button3D, {
					tone: "ink",
					onClick: () => goToContact(`Demo of ${p.name}`),
					children: ["Explore demo ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
				}), /* @__PURE__ */ jsx(Button3D, {
					tone: "paper",
					href: productHref(p.id),
					children: "Details"
				})]
			})
		]
	});
}
function BuiltHere() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "section about-work",
		id: "built",
		cmsTag: "section",
		cmsSource: "components/about/AboutPage.tsx:55",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Built here",
				title: "Client work and our own",
				em: "products, side by side.",
				copy: `We build websites, online stores, mobile apps and business software, and we test and look after them once they're live. Our clients range from one-person startups to companies with thousands of staff. Alongside client projects we design, build and support ${stats[1].value} products of our own.`
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-work-grid rv-stagger",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:56",
				children: [projects.map((p, i) => {
					const Mock = mocks[p.id];
					return /* @__PURE__ */ jsxs(CmsElement, {
						className: "about-work-card",
						href: "/work",
						style: stagger(i),
						"data-cursor": "View",
						cmsTag: "a",
						cmsSource: "components/about/AboutPage.tsx:57",
						children: [/* @__PURE__ */ jsx(BrowserFrame, {
							url: p.url,
							children: /* @__PURE__ */ jsx(Mock, {})
						}), /* @__PURE__ */ jsxs(CmsElement, {
							className: "about-work-meta",
							cmsTag: "div",
							cmsSource: "components/about/AboutPage.tsx:58",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/about/AboutPage.tsx:59",
								children: p.name
							}), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/about/AboutPage.tsx:60",
								children: p.tags[0]
							})]
						})]
					}, p.id);
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "about-work-card about-work-card--next",
					href: "/start",
					style: stagger(projects.length),
					cmsTag: "a",
					cmsSource: "components/about/AboutPage.tsx:61",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						className: "about-next",
						cmsTag: "div",
						cmsSource: "components/about/AboutPage.tsx:62",
						children: [
							/* @__PURE__ */ jsx(Sparkles$1, { size: 26 }),
							/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "strong",
								cmsSource: "components/about/AboutPage.tsx:63",
								children: ["Your project, ", /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "em",
									cmsSource: "components/about/AboutPage.tsx:64",
									children: "next."
								})]
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "about-next-arrow",
								cmsTag: "span",
								cmsSource: "components/about/AboutPage.tsx:65",
								children: /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 20 })
							})
						]
					}), /* @__PURE__ */ jsxs(CmsElement, {
						className: "about-work-meta",
						cmsTag: "div",
						cmsSource: "components/about/AboutPage.tsx:66",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "h3",
							cmsSource: "components/about/AboutPage.tsx:67",
							children: "Start a project"
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:68",
							children: "Reply within one business day"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-products",
				id: "our-products",
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:69",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "about-products-head",
					cmsTag: "div",
					cmsSource: "components/about/AboutPage.tsx:70",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "about-label",
						cmsTag: "p",
						cmsSource: "components/about/AboutPage.tsx:71",
						children: "Our products"
					}), /* @__PURE__ */ jsxs(CmsElement, {
						className: "about-products-all",
						href: "/products",
						cmsTag: "a",
						cmsSource: "components/about/AboutPage.tsx:72",
						children: [
							"See all ",
							catalog.length,
							" products ",
							/* @__PURE__ */ jsx(ArrowUpRight$1, { size: 16 })
						]
					})]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "ap-grid",
					cmsTag: "div",
					cmsSource: "components/about/AboutPage.tsx:73",
					children: [catalog.map((p) => /* @__PURE__ */ jsx(ProductTile, { p }, p.id)), /* @__PURE__ */ jsxs(CmsElement, {
						className: "ap-card ap-card--fit",
						"data-reveal": true,
						cmsTag: "aside",
						cmsSource: "components/about/AboutPage.tsx:74",
						children: [
							/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/about/AboutPage.tsx:75",
								children: ["Not sure which ", /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "em",
									cmsSource: "components/about/AboutPage.tsx:76",
									children: "one fits?"
								})]
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "ap-blurb",
								cmsTag: "p",
								cmsSource: "components/about/AboutPage.tsx:77",
								children: "Tell us about your business and we'll recommend a product, or a custom build."
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "ap-actions",
								cmsTag: "div",
								cmsSource: "components/about/AboutPage.tsx:78",
								children: /* @__PURE__ */ jsxs(Button3D, {
									tone: "mint",
									onClick: () => goToContact("Help me choose a product"),
									children: ["Ask us ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
								})
							})
						]
					})]
				})]
			})
		]
	});
}
function Promises() {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "about-promises",
		id: "promises",
		cmsTag: "section",
		cmsSource: "components/about/AboutPage.tsx:79",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-inner",
			cmsTag: "div",
			cmsSource: "components/about/AboutPage.tsx:80",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:81",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "eyebrow",
					cmsTag: "p",
					cmsSource: "components/about/AboutPage.tsx:82",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/about/AboutPage.tsx:83"
					}), " How we work"]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/about/AboutPage.tsx:84",
					children: [
						"Four promises we hold",
						/* @__PURE__ */ jsx("br", {}),
						"ourselves to."
					]
				})]
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "about-promise-list rv-stagger",
				"data-reveal": true,
				cmsTag: "ol",
				cmsSource: "components/about/AboutPage.tsx:85",
				children: promises.map((p, i) => /* @__PURE__ */ jsxs(CmsElement, {
					className: "about-promise",
					style: stagger(i),
					cmsTag: "li",
					cmsSource: "components/about/AboutPage.tsx:86",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "h3",
						cmsSource: "components/about/AboutPage.tsx:87",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:88",
							children: String(i + 1).padStart(2, "0")
						}), p.title]
					}), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/about/AboutPage.tsx:89",
						children: p.text
					})]
				}, p.title))
			})]
		})
	});
}
var ICONS$1 = {
	cpu: Cpu,
	bulb: Lightbulb,
	trend: TrendingUp,
	rocket: Rocket,
	users: Users,
	support: LifeBuoy
};
function MV({ data, variant }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: `mv-card mv-card--${variant}`,
		cmsTag: "article",
		cmsSource: "components/about/AboutPage.tsx:90",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "header",
				cmsSource: "components/about/AboutPage.tsx:91",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/about/AboutPage.tsx:92",
					children: data.tag
				}), /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "small",
					cmsSource: "components/about/AboutPage.tsx:93",
					children: data.when
				})]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "h3",
				cmsSource: "components/about/AboutPage.tsx:94",
				children: data.title
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "ul",
				cmsSource: "components/about/AboutPage.tsx:95",
				children: data.points.map((pt) => {
					const Icon = ICONS$1[pt.icon];
					return /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/about/AboutPage.tsx:96",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							className: "mv-icon",
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:97",
							children: /* @__PURE__ */ jsx(Icon, {
								size: 17,
								"aria-hidden": true
							})
						}), pt.text]
					}, pt.text);
				})
			})
		]
	});
}
function WhyWeExist() {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "about-why",
		id: "why",
		cmsTag: "section",
		cmsSource: "components/about/AboutPage.tsx:98",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-inner",
			cmsTag: "div",
			cmsSource: "components/about/AboutPage.tsx:99",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:100",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "eyebrow",
					cmsTag: "p",
					cmsSource: "components/about/AboutPage.tsx:101",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/about/AboutPage.tsx:102"
					}), " Why we exist"]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/about/AboutPage.tsx:103",
					children: [
						"We succeed when our",
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "em",
							cmsSource: "components/about/AboutPage.tsx:104",
							children: "customers do."
						})
					]
				})]
			}), /* @__PURE__ */ jsxs(CmsElement, {
				className: "about-mv rv-stagger",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:105",
				children: [
					/* @__PURE__ */ jsx(MV, {
						data: mission,
						variant: "mission"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "mv-link",
						style: stagger(1),
						"aria-hidden": "true",
						cmsTag: "div",
						cmsSource: "components/about/AboutPage.tsx:106",
						children: /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:107",
							children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						style: stagger(2),
						className: "mv-wrap",
						cmsTag: "div",
						cmsSource: "components/about/AboutPage.tsx:108",
						children: /* @__PURE__ */ jsx(MV, {
							data: vision,
							variant: "vision"
						})
					})
				]
			})]
		})
	});
}
var TEAMS = [
	"Engineering",
	"Design",
	"QA",
	"Marketing",
	"Support"
];
function Careers() {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "about-careers",
		id: "join",
		cmsTag: "section",
		cmsSource: "components/about/AboutPage.tsx:109",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-careers-card",
			"data-reveal": "scale",
			cmsTag: "div",
			cmsSource: "components/about/AboutPage.tsx:110",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-careers-copy",
				cmsTag: "div",
				cmsSource: "components/about/AboutPage.tsx:111",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/about/AboutPage.tsx:112",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:113"
						}), " Want to build with us?"]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "h2",
						cmsSource: "components/about/AboutPage.tsx:114",
						children: [
							/* @__PURE__ */ jsx(CountUp, { value: `${openRoles}` }),
							" open roles across ",
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "em",
								cmsSource: "components/about/AboutPage.tsx:115",
								children: "our teams."
							})
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "ul",
						cmsSource: "components/about/AboutPage.tsx:116",
						children: TEAMS.map((t) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/about/AboutPage.tsx:117",
							children: t
						}, t))
					})
				]
			}), /* @__PURE__ */ jsxs(Button3D, {
				href: "/careers",
				tone: "ink",
				children: ["See careers ", /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 17 })]
			})]
		})
	});
}
function Talk() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-talk",
		id: "contact",
		"data-reveal": true,
		cmsTag: "div",
		cmsSource: "components/about/AboutPage.tsx:118",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			cmsTag: "div",
			cmsSource: "components/about/AboutPage.tsx:119",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "h2",
				cmsSource: "components/about/AboutPage.tsx:120",
				children: ["Let's talk about ", /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "em",
					cmsSource: "components/about/AboutPage.tsx:121",
					children: "your project"
				})]
			}), /* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "p",
				cmsSource: "components/about/AboutPage.tsx:122",
				children: "Tell us what you need and we'll reply within one business day."
			})]
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-talk-actions",
			cmsTag: "div",
			cmsSource: "components/about/AboutPage.tsx:123",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "ul",
				cmsSource: "components/about/AboutPage.tsx:124",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "li",
					cmsSource: "components/about/AboutPage.tsx:125",
					children: /* @__PURE__ */ jsxs(CmsElement, {
						href: `mailto:${contactInfo.email}`,
						cmsTag: "a",
						cmsSource: "components/about/AboutPage.tsx:126",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:127",
							children: /* @__PURE__ */ jsx(Mail, {
								size: 16,
								"aria-hidden": true
							})
						}), contactInfo.email]
					})
				}), /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "li",
					cmsSource: "components/about/AboutPage.tsx:128",
					children: /* @__PURE__ */ jsxs(CmsElement, {
						href: contactInfo.whatsapp,
						target: "_blank",
						rel: "noopener noreferrer",
						cmsTag: "a",
						cmsSource: "components/about/AboutPage.tsx:129",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/about/AboutPage.tsx:130",
							children: /* @__PURE__ */ jsx(MessageCircle, {
								size: 16,
								"aria-hidden": true
							})
						}), "Chat on WhatsApp"]
					})
				})]
			}), /* @__PURE__ */ jsxs(Button3D, {
				href: "/start",
				tone: "mint",
				children: ["Start a project ", /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 17 })]
			})]
		})]
	});
}
function AboutPage() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(AboutHero, {}),
		/* @__PURE__ */ jsx(Story, {}),
		/* @__PURE__ */ jsx(BuiltHere, {}),
		/* @__PURE__ */ jsx(Promises, {}),
		/* @__PURE__ */ jsx(WhyWeExist, {}),
		/* @__PURE__ */ jsx(Careers, {}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/components/services/ServicesPage.tsx
var SERVICES = [
	{
		id: "ai",
		title: "AI Automations",
		desc: "AI agents, chatbots and automated workflows that take repetitive work off your team.",
		Icon: Cpu,
		art: /* @__PURE__ */ jsx(Photo, { kind: "cloud" }),
		tone: "lilac",
		size: "lg"
	},
	{
		id: "ai-agents",
		title: "AI Agent Development",
		desc: "Custom AI agents that plan, act and finish multi-step work across your tools.",
		Icon: Bot,
		art: /* @__PURE__ */ jsx(Photo, { kind: "code" }),
		tone: "blue"
	},
	{
		id: "ai-models",
		title: "AI Model Integration",
		desc: "Bring GPT, Claude, Gemini and open-source models into your products and systems.",
		Icon: Workflow,
		art: /* @__PURE__ */ jsx(Photo, { kind: "cloud" }),
		tone: "pink"
	},
	{
		id: "web-portals",
		title: "Web Portals",
		desc: "Customer, partner and staff portals with dashboards, roles and self-service.",
		Icon: MonitorSmartphone,
		art: /* @__PURE__ */ jsx(Photo, { kind: "team" }),
		tone: "mint"
	},
	{
		id: "ecommerce",
		title: "Ecommerce",
		desc: "Online stores on Shopify, WooCommerce, Magento and more, or a custom cart, built to sell.",
		Icon: ShoppingCart,
		art: /* @__PURE__ */ jsx(Photo, { kind: "fashion" }),
		tone: "yellow"
	},
	{
		id: "mobile-apps",
		title: "Mobile Apps",
		desc: "Native and cross-platform apps for iOS and Android, from first sketch to store.",
		Icon: Smartphone,
		art: /* @__PURE__ */ jsx(Photo, { kind: "mobile" }),
		tone: "pink"
	},
	{
		id: "games",
		title: "Game Development",
		desc: "Mobile, PC and web games, from first prototype to store launch and live updates.",
		Icon: Gamepad2,
		art: /* @__PURE__ */ jsx(Photo, { kind: "gaming" }),
		tone: "blue"
	},
	{
		id: "ar-vr",
		title: "AR/VR",
		desc: "Augmented and virtual reality for training, retail, property and events.",
		Icon: Glasses,
		art: /* @__PURE__ */ jsx(Photo, { kind: "vr" }),
		tone: "coral"
	},
	{
		id: "marketing",
		title: "Digital Marketing",
		desc: "Brand, search, paid, social, content and analytics run as one growth engine.",
		Icon: Megaphone,
		art: /* @__PURE__ */ jsx(Photo, { kind: "analytics" }),
		tone: "mint"
	},
	{
		id: "custom",
		title: "Custom Development",
		desc: "Software built the way you work, from a small internal tool to a full platform.",
		Icon: Code2,
		art: /* @__PURE__ */ jsx(Photo, { kind: "code" }),
		tone: "yellow"
	},
	{
		id: "plugins",
		title: "Plugin Development",
		desc: "Plugins and apps that extend WordPress, Shopify, Magento and Wix.",
		Icon: Puzzle,
		art: /* @__PURE__ */ jsx(Photo, { kind: "code" }),
		tone: "lilac"
	},
	{
		id: "erp",
		title: "ERP Systems",
		desc: "Enterprise resource planning built for your business, at a price you can afford.",
		Icon: Server,
		art: /* @__PURE__ */ jsx(Photo, { kind: "logistics" }),
		tone: "blue"
	},
	{
		id: "saas",
		title: "SaaS Product Development",
		desc: "Subscription software built to launch, sell and scale, from MVP to multi-tenant platform.",
		Icon: Sparkles,
		art: /* @__PURE__ */ jsx(Photo, { kind: "analytics" }),
		tone: "mint"
	}
];
var GROUPS = [
	{
		label: "Ecommerce & CMS",
		items: [
			["Shopify", SiShopify],
			["WooCommerce", SiWoocommerce],
			["Magento", ShoppingBag],
			["WordPress", SiWordpress],
			["Wix", SiWix]
		]
	},
	{
		label: "Web & SaaS",
		items: [
			["Laravel", SiLaravel],
			["React", SiReact],
			["Next.js", SiNextdotjs],
			["Node.js", SiNodedotjs],
			["Express", SiExpress],
			["Tailwind CSS", SiTailwindcss]
		]
	},
	{
		label: "Mobile apps",
		items: [
			["React Native", SiReact],
			["iOS", SiApple],
			["Android", SiAndroid],
			["Firebase", SiFirebase]
		]
	},
	{
		label: "AI models",
		items: [
			["OpenAI", Bot],
			["Claude", SiAnthropic],
			["Google Gemini", SiGooglegemini]
		]
	},
	{
		label: "Cloud & data",
		items: [
			["AWS", Cloud],
			["Google Cloud", SiGooglecloud],
			["MySQL", SiMysql],
			["PostgreSQL", SiPostgresql],
			["MongoDB", SiMongodb]
		]
	},
	{
		label: "Games & AR/VR",
		items: [["Unity", SiUnity], ["Meta Quest", SiMeta]]
	},
	{
		label: "Marketing",
		items: [
			["Google Ads", SiGoogleads],
			["Google Analytics", SiGoogleanalytics],
			["Meta Ads", SiMeta]
		]
	}
];
function ServicesHero() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-hero services-hero",
		style: { "--intro": intro },
		cmsTag: "section",
		cmsSource: "components/services/ServicesPage.tsx:1",
		children: [/* @__PURE__ */ jsx(CmsElement, {
			className: "hero-blob hero-blob--one",
			"data-parallax": "0.14",
			cmsTag: "div",
			cmsSource: "components/services/ServicesPage.tsx:2"
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-hero-inner",
			cmsTag: "div",
			cmsSource: "components/services/ServicesPage.tsx:3",
			children: [
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "eyebrow",
					cmsTag: "p",
					cmsSource: "components/services/ServicesPage.tsx:4",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/services/ServicesPage.tsx:5"
					}), " What we do"]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					"aria-label": "Our services",
					cmsTag: "h1",
					cmsSource: "components/services/ServicesPage.tsx:6",
					children: /* @__PURE__ */ jsxs(CmsElement, {
						"aria-hidden": "true",
						cmsTag: "span",
						cmsSource: "components/services/ServicesPage.tsx:7",
						children: [/* @__PURE__ */ jsx(SplitWords, { text: "Our" }), /* @__PURE__ */ jsx(SplitWords, {
							text: "services",
							start: 1,
							em: true
						})]
					})
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "about-lede",
					cmsTag: "p",
					cmsSource: "components/services/ServicesPage.tsx:8",
					children: "Pick a discipline to see what we deliver, or tell us the problem and we'll point the right people at it."
				})
			]
		})]
	});
}
function ServiceGrid() {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "section services services-page-grid",
		id: "services",
		cmsTag: "section",
		cmsSource: "components/services/ServicesPage.tsx:9",
		children: /* @__PURE__ */ jsx(CmsElement, {
			className: "service-grid service-grid--bento",
			"data-reveal": true,
			cmsTag: "div",
			cmsSource: "components/services/ServicesPage.tsx:10",
			children: SERVICES.map((s, index) => /* @__PURE__ */ jsxs(CmsElement, {
				href: `/services/${s.id}`,
				id: s.id,
				className: `service-card service-card--${s.tone}${s.size ? ` service-card--${s.size}` : ""}`,
				"data-tilt": true,
				style: { "--stagger": index },
				cmsTag: "a",
				cmsSource: "components/services/ServicesPage.tsx:11",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "service-top",
						cmsTag: "div",
						cmsSource: "components/services/ServicesPage.tsx:12",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/services/ServicesPage.tsx:13",
							children: String(index + 1).padStart(2, "0")
						}), /* @__PURE__ */ jsx(CmsElement, {
							className: "icon-bubble",
							cmsTag: "span",
							cmsSource: "components/services/ServicesPage.tsx:14",
							children: /* @__PURE__ */ jsx(s.Icon, { size: 20 })
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "service-art",
						cmsTag: "div",
						cmsSource: "components/services/ServicesPage.tsx:15",
						children: s.art
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "service-text",
						cmsTag: "div",
						cmsSource: "components/services/ServicesPage.tsx:16",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "h3",
							cmsSource: "components/services/ServicesPage.tsx:17",
							children: s.title
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/services/ServicesPage.tsx:18",
							children: s.desc
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "card-arrow",
						cmsTag: "span",
						cmsSource: "components/services/ServicesPage.tsx:19",
						children: /* @__PURE__ */ jsx(ArrowRight$1, { size: 20 })
					})
				]
			}, s.id))
		})
	});
}
function Stack() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "section stack",
		id: "technologies",
		cmsTag: "section",
		cmsSource: "components/services/ServicesPage.tsx:20",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "section-heading",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/services/ServicesPage.tsx:21",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "div",
					cmsSource: "components/services/ServicesPage.tsx:22",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/services/ServicesPage.tsx:23",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/services/ServicesPage.tsx:24"
						}), " Our toolbox"]
					}), /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "h2",
						cmsSource: "components/services/ServicesPage.tsx:25",
						children: [
							"Platforms and technologies",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "em",
								cmsSource: "components/services/ServicesPage.tsx:26",
								children: "we build with"
							})
						]
					})]
				}), /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/services/ServicesPage.tsx:27",
					children: "The tools behind our client projects and our own products, grouped by the service they power."
				})]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "stack-list rv-stagger",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/services/ServicesPage.tsx:28",
				children: GROUPS.map((g, gi) => /* @__PURE__ */ jsxs(CmsElement, {
					className: "stack-row",
					style: { "--stagger": gi },
					cmsTag: "div",
					cmsSource: "components/services/ServicesPage.tsx:29",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "h3",
						cmsSource: "components/services/ServicesPage.tsx:30",
						children: g.label
					}), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "ul",
						cmsSource: "components/services/ServicesPage.tsx:31",
						children: g.items.map(([name, Icon]) => /* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/services/ServicesPage.tsx:32",
							children: [/* @__PURE__ */ jsx(Icon, { size: 16 }), name]
						}, name))
					})]
				}, g.label))
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "stack-note",
				cmsTag: "p",
				cmsSource: "components/services/ServicesPage.tsx:33",
				children: "Product names and logos are trademarks of their owners and are shown only to describe what we build with."
			})
		]
	});
}
function ServicesPage() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(ServicesHero, {}),
		/* @__PURE__ */ jsx(ServiceGrid, {}),
		/* @__PURE__ */ jsx(Proposal, {}),
		/* @__PURE__ */ jsx(Stack, {}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/chat/engine.ts
var norm = (s) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9+&/\s-]/g, " ").replace(/\s+/g, " ").trim();
var squash = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
var has = (t, re) => re.test(t);
var STOP$1 = new Set("the a an and or of to for in on at is are do you we can how what does your our with it my me i be about any have has will would could should this that there from by as if so not no yes please tell us".split(" "));
var words$1 = (s) => norm(s).split(" ").filter((w) => w.length > 2 && !STOP$1.has(w));
var FIRST_CHIPS = [
	"What do you build?",
	"Show me your products",
	"Where are your offices?",
	"Start a project"
];
var HOME_CHIPS = [
	"Our services",
	"Our products",
	"Pricing",
	"Talk to a person"
];
var DAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function localNow(tz, now) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz,
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).formatToParts(now);
	const get = (t) => parts.find((p) => p.type === t)?.value ?? "0";
	const hour = Number(get("hour")) % 24;
	return {
		day: DAYS.indexOf(get("weekday")),
		minutes: hour * 60 + Number(get("minute")),
		label: `${String(hour).padStart(2, "0")}:${get("minute")}`
	};
}
function officeStatus(o, now = /* @__PURE__ */ new Date()) {
	const l = localNow(o.tz, now);
	return {
		open: o.workDays.includes(l.day) && l.minutes >= o.open && l.minutes < o.close,
		time: l.label
	};
}
var hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
function officesReply() {
	const lines = offices.map((o) => {
		const s = officeStatus(o);
		const days = o.workDays.includes(0) ? "Sun to Thu" : "Mon to Fri";
		return `• ${o.city}, ${o.country}: ${s.open ? "open now" : "closed now"} (local time ${s.time}), ${days} ${hhmm(o.open)} to ${hhmm(o.close)}`;
	});
	return {
		text: `We work from ${offices.length} cities: ${offices.map((o) => o.city).join(", ")}.\n${lines.join("\n")}\nDelhi, India is where we started in ${FOUNDED}. Messages sent outside office hours are answered within one business day.`,
		links: [{
			label: "See the map",
			href: "/about#locations"
		}],
		chips: ["Contact details", "Start a project"]
	};
}
var ALIASES = {
	invoicehub: /invoic|gst|billing software/,
	retailpos: /\bpos\b|point of sale|retail|checkout|barcode/,
	dineos: /restaurant|cafe|dine|kitchen|menu/,
	salonplanner: /salon|spa\b|barber/,
	stockpilot: /inventory|stock|warehouse|purchase order/,
	smartfacility: /facility|building|tenant|lease/,
	fleettracker: /fleet|vehicle|driver|truck/,
	assettracker: /asset/,
	fieldservice: /field service|technician|work order|dispatch/,
	propertymanager: /property|rental|landlord|real estate/,
	peopledesk: /\bhr\b|payroll|attendance|leave|employee/,
	visitorpass: /visitor|reception|gate pass/,
	clinicdesk: /clinic|doctor|patient|hospital|medical/,
	gymmanager: /\bgym|fitness|membership/,
	leadflow: /\bcrm\b|\blead|sales pipeline|follow.?up/,
	bookingengine: /booking|appointment|reservation|schedul/,
	orderportal: /order portal|wholesale|b2b order|reorder/,
	aichatbot: /ai chatbot|chatbot product/,
	aianalytics: /analytics|insights|forecast/,
	documentvault: /document vault|document storage|e-?sign|paperwork/,
	securitysuite: /security|compliance|audit|iso\b|soc ?2/,
	cloudbackup: /cloud infra|backup|hosting|devops|disaster/,
	vrshowroom: /showroom/,
	virtualtours: /virtual tour|360 tour|walkthrough/,
	vrgaming: /vr gam/,
	hologuide: /holo|hologram/,
	school360: /school|student|teacher|parents?\b/,
	learningplatform: /\blms\b|e-?learning|learning platform|courses?\b/
};
function findProducts(t) {
	const sq = squash(t);
	const exact = catalog.filter((p) => sq.includes(squash(p.name)));
	if (exact.length) return exact;
	return catalog.filter((p) => ALIASES[p.id]?.test(t));
}
var catLabel$1 = (id) => categories.find((c) => c.id === id)?.label ?? "";
function productReply(p) {
	return {
		text: `${p.name} (${catLabel$1(p.cat)}): ${p.blurb}\n${p.bullets.map((b) => `• ${b}`).join("\n")}\nAvailable as: ${p.platforms}. We set it up for your business, so you are not stuck with a template.`,
		links: [{
			label: `${p.name} details`,
			href: productHref(p.id)
		}],
		chips: [
			`Book a demo of ${p.name}`,
			`Pricing for ${p.name}`,
			"Other products"
		]
	};
}
function productsOverview() {
	const lines = categories.map((c) => `• ${c.label}: ${catalog.filter((p) => p.cat === c.id).map((p) => p.name).join(", ")}`);
	return {
		text: `We build and support ${catalog.length} ready-made products. Each one can be set up for your business.\n${lines.join("\n")}\nTell me what you do (a restaurant, a clinic, a warehouse...) and I'll suggest one.`,
		links: [{
			label: "Browse all products",
			href: "/products"
		}],
		chips: [
			"I run a restaurant",
			"I need invoicing and GST",
			"I need an HR system"
		]
	};
}
var SERVICE_KEYS = [
	["ai-agents", /agent/],
	["ai-models", /\bmodels?\b|gpt|claude|gemini|llm|openai|llama/],
	["ai", /\bai\b|artificial|automat|chatbot|machine learning|\bml\b/],
	["ecommerce", /shopify|woocommerce|magento|e-?commerce|online (store|shop)|\bstore\b/],
	["mobile-apps", /mobile|android|\bios\b|iphone|flutter|react native|\bapps?\b/],
	["games", /\bgam(e|es|ing)\b|unity|unreal/],
	["ar-vr", /\bar\b|\bvr\b|augmented|virtual reality|metaverse/],
	["marketing", /marketing|\bseo\b|\bads?\b|social media|branding|ppc|content|growth/],
	["plugins", /plugin|wordpress|\bwix\b|extension/],
	["erp", /\berp\b|resource planning|tally/],
	["saas", /saas|subscription|\bmvp\b|multi.?tenant|startup/],
	["web-portals", /portal|dashboard|web ?app|website|web site|web development/],
	["custom", /custom|bespoke|software development|tailor|internal tool/]
];
var svcTitle = (id) => SERVICES.find((s) => s.id === id)?.title ?? id;
function bestFaq(t, ids) {
	const w = new Set(words$1(t));
	let best = null;
	for (const id of ids) for (const [q, a] of getService(id)?.faq ?? []) {
		const s = words$1(q).filter((x) => w.has(x)).length;
		if (s >= 2 && (!best || s > best.s)) best = {
			q,
			a,
			id,
			s
		};
	}
	return best;
}
function serviceReply(id, t) {
	const d = getService(id);
	const s = SERVICES.find((x) => x.id === id);
	const faq = bestFaq(t, [id]);
	const more = d?.more.slice(0, 2).map((m) => svcTitle(m)) ?? [];
	const text = faq ? `${faq.a}` : `${svcTitle(id)}: ${d?.lede ?? s?.desc ?? ""}${d ? `\nHow we work: ${d.steps.join(" → ")}` : ""}`;
	const prods = (d?.prods ?? []).map((pid) => catalog.find((p) => p.id === pid)?.name).filter(Boolean);
	return {
		text: faq ? text : text + (prods.length ? `\nRelated products: ${prods.join(", ")}.` : ""),
		links: [{
			label: `${svcTitle(id)} page`,
			href: serviceHref(id)
		}],
		chips: [`Start a project: ${svcTitle(id)}`, ...more.map((m) => `Tell me about ${m}`)].slice(0, 3)
	};
}
function servicesOverview() {
	return {
		text: `We cover ${SERVICES.length} services under one roof:\n${SERVICES.map((s) => `• ${s.title}`).join("\n")}\nTell me what you're trying to build and I'll point you to the right one.`,
		links: [{
			label: "All services",
			href: "/services"
		}],
		chips: [
			"AI automation",
			"Mobile apps",
			"Ecommerce",
			"ERP systems"
		]
	};
}
var contactReply = () => ({
	text: `You can reach the team here:\n• Email: ${contactInfo.email}\n• WhatsApp: use the button below\nWe reply within one business day. Something broken right now? Use the RAPID RESPONSE page.`,
	links: [
		{
			label: "Email us",
			href: `mailto:${contactInfo.email}`,
			external: true
		},
		{
			label: "WhatsApp",
			href: contactInfo.whatsapp,
			external: true
		},
		{
			label: "RAPID RESPONSE",
			href: urgentHelp.cta.href
		}
	],
	chips: ["Start a project", "Where are your offices?"]
});
function careersReply() {
	const open = roles.filter((r) => r.open);
	return {
		text: `We have ${open.length} open roles:\n${open.map((r) => `• ${r.title} (${r.type}${r.location ? `, ${r.location}` : ""})`).join("\n")}\nSee the careers page for details and how to apply.`,
		links: [{
			label: "Careers",
			href: "/careers"
		}],
		chips: ["What do you build?", "Where are your offices?"]
	};
}
function aboutReply() {
	return {
		text: `Sybertron started in Delhi, India in ${FOUNDED}, so we have been building software for ${(/* @__PURE__ */ new Date()).getFullYear() - FOUNDED} years. Today that's ${stats[0].value.toLocaleString("en-US")}+ projects delivered, ${stats[1].value} in-house products and a presence in ${stats[2].value} countries (USA, UK, UAE and India).`,
		links: [{
			label: "Our story",
			href: "/about"
		}, {
			label: "Our work",
			href: "/work"
		}],
		chips: ["What do you build?", "We're hiring?"]
	};
}
var pricingReply = (name) => ({
	text: `${name ? `${name} is` : "Projects are"} priced to fit the scope, so I don't want to guess a number. Price depends on what you need built, how many people use it and how quickly you need it. Give us a few details and the team will come back with a clear quote within one business day, no obligation.`,
	chips: name ? [`Book a demo of ${name}`, "Start a project"] : ["Start a project", "How long does a project take?"]
});
var timelineReply = () => ({
	text: "It depends on the size. A focused website or small tool is a matter of weeks. A mobile app, portal or ERP is usually months, delivered in stages so you can use and test it along the way. Ready-made products from our catalogue can be set up much faster. Share your idea and we'll give you a realistic plan.",
	chips: ["Start a project", "Pricing"]
});
var urgentReply = () => ({
	text: `${urgentHelp.lead} ${urgentHelp.rest} Use RAPID RESPONSE and tell us what's broken, or message us on WhatsApp for the fastest reply.`,
	links: [{
		label: urgentHelp.cta.label,
		href: urgentHelp.cta.href
	}, {
		label: "WhatsApp",
		href: contactInfo.whatsapp,
		external: true
	}]
});
var fallbackReply = () => ({
	text: "I'm not sure I have a good answer to that one. I can tell you about our services, products, offices and jobs, or I can pass your question to the team and they'll reply within one business day.",
	chips: [
		"What do you build?",
		"Show me your products",
		"Talk to a person"
	],
	links: [{
		label: "Email the team",
		href: `mailto:${contactInfo.email}`,
		external: true
	}]
});
function reply(input, ctx = {}) {
	const t = norm(input);
	const done = (bot, c = {}) => ({
		bot,
		ctx: {
			...ctx,
			...c
		}
	});
	if (!t) return done(fallbackReply());
	const short = t.split(" ").length <= 4;
	if (short && has(t, /^(hi|hey|hello|hola|salam|assalam|namaste|good (morning|afternoon|evening)|yo)\b/)) return done({
		text: "Hi! I'm the Sybertron assistant. Ask me about our services, products, offices or jobs, or tell me about your project.",
		chips: FIRST_CHIPS
	});
	if (short && has(t, /^(thanks|thank you|thx|ty|cheers|great|perfect|awesome|cool|ok(ay)?)\b/)) return done({
		text: "Happy to help. Anything else you'd like to know?",
		chips: HOME_CHIPS
	});
	if (short && has(t, /^(bye|goodbye|see you|cya|good night)\b/)) return done({
		text: "Thanks for stopping by. If you want to talk to the team, we reply within one business day.",
		chips: ["Start a project"]
	});
	if (has(t, /urgent|emergency|asap|broken|\bdown\b|crash|hacked|not working|outage|bug fix|site is down/)) return done(urgentReply());
	const prodForDemo = findProducts(t)[0];
	if (has(t, /\bdemo\b|book a (call|meeting)|schedule a call/)) {
		const p = prodForDemo ?? catalog.find((x) => x.id === ctx.lastProduct);
		return done({
			text: `Great, let's set up ${p ? `a demo of ${p.name}` : "a demo"}. I just need a few details.`,
			lead: { need: p ? `Demo of ${p.name}` : "Book a demo" }
		});
	}
	if (has(t, /start (a|my|the)? ?(\w+ )?project|get a quote|request a quote|free quote|hire (you|us|sybertron)|work with (you|us)|get started|build (me|us) |i (want|need|would like) (to )?(build|make|develop|hire)|talk to (sales|someone)|get in touch|contact sales|proposal/)) {
		const sid = SERVICE_KEYS.find(([, re]) => re.test(t))?.[0];
		return done({
			text: "Happy to help. A few quick questions and I'll package it for the team.",
			lead: { need: sid ? svcTitle(sid) : void 0 }
		});
	}
	if (has(t, /career|\bjobs?\b|hiring|vacanc|openings?|internship|work (for|at|with) sybertron|join (the )?team|we.?re hiring/)) return done(careersReply());
	if (has(t, /talk to (a )?(person|human|someone|agent|team)|real person|human|speak to|live (agent|chat)|call (me|you)|phone|whatsapp|e-?mail|contact (details|info|us)|how (can|do) i (reach|contact)/)) return done(contactReply());
	if (has(t, /office|location|where are you|based|address|city|country|countries|timezone|time zone|open now|working hours|office hours|business hours|when (are|do) you (open|work)/)) return done(officesReply());
	const prods = findProducts(t);
	if (has(t, /pric|cost|how much|budget|rate|fee|quote|afford|cheap|expens|charge/)) return done(pricingReply((prods[0] ?? (prods.length === 0 ? catalog.find((x) => x.id === ctx.lastProduct && /\b(it|this|that)\b/.test(t)) : void 0))?.name));
	if (has(t, /how long|timeline|turnaround|deliver(y)? time|how fast|how soon|deadline|duration|weeks|months/)) return done(timelineReply());
	if (prods.length === 1) return done(productReply(prods[0]), { lastProduct: prods[0].id });
	if (prods.length > 1 && !has(t, /\bservices?\b/)) return done({
		text: `A few of our products could fit: ${prods.slice(0, 4).map((p) => p.name).join(", ")}. Which one would you like to know more about?`,
		chips: prods.slice(0, 4).map((p) => `Tell me about ${p.name}`)
	});
	const cat = categories.find((c) => t.includes(norm(c.label)));
	if (cat) {
		const list = catalog.filter((p) => p.cat === cat.id);
		return done({
			text: `${cat.label} products:\n${list.map((p) => `• ${p.name}: ${p.blurb}`).join("\n")}`,
			chips: list.slice(0, 3).map((p) => `Tell me about ${p.name}`),
			links: [{
				label: "Browse all products",
				href: "/products"
			}]
		});
	}
	const sid = SERVICE_KEYS.find(([, re]) => re.test(t))?.[0];
	if (sid && !has(t, /^(what do you (build|do|make|offer)|services?)\??$/)) return done(serviceReply(sid, t), { lastService: sid });
	const faq = bestFaq(t, DETAILS.map((d) => d.id));
	if (faq) return done({
		text: faq.a,
		links: [{
			label: `${svcTitle(faq.id)} page`,
			href: serviceHref(faq.id)
		}],
		chips: ["Start a project", "Talk to a person"]
	}, { lastService: faq.id });
	if (has(t, /product|software|solutions?|catalog/) && !has(t, /\bservices?\b/)) return done(productsOverview());
	if (has(t, /service|what do you (build|do|make|offer)|what can you|capabilit|offer|help me with|specialis|expertise/)) return done(servicesOverview());
	if (has(t, /about|who are you|who is sybertron|company|history|story|founded|since when|how (old|long have)|experience|team size|clients?|portfolio|case stud|work you.?ve done|past work|projects/)) return done(aboutReply());
	if (has(t, /\bi (run|own|have|manage) (a |an |the )?\w+|for my (business|shop|store|company)|small business|\bsme\b/)) return done(productsOverview());
	return done(fallbackReply());
}
// src/components/ChatLauncher.tsx
var KEY$1 = "syb-chat-v1";
var GREETING = {
	role: "bot",
	text: "Hi, I'm the Sybertron assistant. Ask me about our services, products, offices or jobs, or tell me about your project and I'll pass it to the team.",
	chips: FIRST_CHIPS
};
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var NEEDS = [
	"Website or portal",
	"Mobile app",
	"AI automation",
	"Ecommerce store",
	"ERP or SaaS",
	"Something else"
];
function load() {
	try {
		const raw = sessionStorage.getItem(KEY$1);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
var reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? 80 : ms));
function ChatLauncher() {
	const saved = useRef(load()).current;
	const [open, setOpen] = useState(saved?.open ?? false);
	const [msgs, setMsgs] = useState(saved?.msgs ?? [{
		id: 0,
		...GREETING
	}]);
	const [lead, setLead] = useState(saved?.lead ?? null);
	const [ctx, setCtx] = useState(saved?.ctx ?? {});
	const [typing, setTyping] = useState(false);
	const [text, setText] = useState("");
	const nextId = useRef(Math.max(0, ...(saved?.msgs ?? []).map((m) => m.id)) + 1);
	const logRef = useRef(null);
	const inputRef = useRef(null);
	const panelRef = useRef(null);
	const busy = useRef(false);
	useEffect(() => {
		try {
			sessionStorage.setItem(KEY$1, JSON.stringify({
				msgs,
				lead,
				ctx,
				open
			}));
		} catch {}
	}, [
		msgs,
		lead,
		ctx,
		open
	]);
	useEffect(() => {
		const el = logRef.current;
		if (el) el.scrollTo({
			top: el.scrollHeight,
			behavior: reduced() ? "auto" : "smooth"
		});
	}, [
		msgs,
		typing,
		open
	]);
	useEffect(() => {
		if (open) inputRef.current?.focus({ preventScroll: true });
	}, [open]);
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && setOpen(false);
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	const push = useCallback((m) => setMsgs((list) => [...list, {
		...m,
		id: nextId.current++
	}]), []);
	const say = useCallback(async (b) => {
		setTyping(true);
		await wait(420 + Math.min(700, b.text.length * 3));
		setTyping(false);
		push({
			role: "bot",
			text: b.text,
			links: b.links,
			chips: b.chips
		});
	}, [push]);
	const startLead = useCallback(async (need) => {
		setLead({
			step: "name",
			name: "",
			email: "",
			need: need ?? "",
			details: ""
		});
		await say({
			text: "First, what's your name?",
			chips: ["Cancel"]
		});
	}, [say]);
	const finishLead = useCallback(async (l) => {
		setLead(null);
		const page = location.pathname;
		const summary = `New project enquiry\nName: ${l.name}\nEmail: ${l.email}\nNeed: ${l.need}\nDetails: ${l.details || "(none)"}\nSent from: ${location.origin}${page}`;
		try {
			sessionStorage.setItem("project-idea", `${l.need}${l.details ? `: ${l.details}` : ""}`);
		} catch {}
		const mail = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`Project enquiry: ${l.need}`)}&body=${encodeURIComponent(summary)}`;
		const wa = `${contactInfo.whatsapp}${contactInfo.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(summary)}`;
		await say({
			text: `Thanks ${l.name.split(" ")[0]}, your request is ready. Tap one of these to send it to the team, and we'll reply to ${l.email} within one business day.`,
			links: [
				{
					label: "Send by email",
					href: mail,
					external: true
				},
				{
					label: "Send on WhatsApp",
					href: wa,
					external: true
				},
				{
					label: "Use the full form",
					href: "/start"
				}
			],
			chips: ["Our services", "Our products"]
		});
	}, [say]);
	const handleLead = useCallback(async (input, l) => {
		const v = input.trim();
		if (/^(cancel|stop|never ?mind|exit|quit)$/i.test(v)) {
			setLead(null);
			return say({
				text: "No problem, I've cleared that. What else can I help with?",
				chips: [
					"Our services",
					"Our products",
					"Contact details"
				]
			});
		}
		if (l.step === "name") {
			const next = {
				...l,
				name: v.slice(0, 80),
				step: "email"
			};
			setLead(next);
			return say({
				text: `Nice to meet you, ${next.name.split(" ")[0]}. What's the best email to reach you on?`,
				chips: ["Cancel"]
			});
		}
		if (l.step === "email") {
			if (!EMAIL_RE.test(v)) return say({
				text: "That doesn't look like a valid email. It should look like name@company.com.",
				chips: ["Cancel"]
			});
			const next = {
				...l,
				email: v,
				step: l.need ? "details" : "need"
			};
			setLead(next);
			return say(l.need ? {
				text: `Got it. Anything else the team should know about "${l.need}"? Budget, deadline, links, anything helps.`,
				chips: ["Skip", "Cancel"]
			} : {
				text: "What do you need help with?",
				chips: [...NEEDS, "Cancel"]
			});
		}
		if (l.step === "need") {
			const next = {
				...l,
				need: v.slice(0, 120),
				step: "details"
			};
			setLead(next);
			return say({
				text: "Thanks. Anything else the team should know? Budget, deadline, links, anything helps.",
				chips: ["Skip", "Cancel"]
			});
		}
		const done = {
			...l,
			details: /^skip$/i.test(v) ? "" : v.slice(0, 1e3)
		};
		return finishLead(done);
	}, [say, finishLead]);
	const send = useCallback(async (raw) => {
		const v = raw.trim();
		if (!v || busy.current) return;
		busy.current = true;
		setText("");
		push({
			role: "user",
			text: v
		});
		try {
			if (lead) await handleLead(v, lead);
			else {
				const r = reply(v, ctx);
				setCtx(r.ctx);
				if (r.bot.lead) {
					await say(r.bot);
					await startLead(r.bot.lead.need);
				} else await say(r.bot);
			}
		} finally {
			busy.current = false;
			inputRef.current?.focus({ preventScroll: true });
		}
	}, [
		lead,
		ctx,
		msgs,
		push,
		say,
		handleLead,
		startLead
	]);
	const onSubmit = (e) => {
		e.preventDefault();
		send(text);
	};
	const reset = () => {
		setMsgs([{
			id: nextId.current++,
			...GREETING
		}]);
		setLead(null);
		setCtx({});
		setTyping(false);
	};
	const onLink = (e, l) => {
		if (l.external || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
		e.preventDefault();
		const [path, hash] = l.href.split("#");
		navigate(path || location.pathname);
		if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 120);
		if (window.matchMedia("(max-width: 640px)").matches) setOpen(false);
	};
	const lastBot = [...msgs].reverse().find((m) => m.role === "bot");
	const placeholder = lead ? {
		name: "Your name",
		email: "you@company.com",
		need: "What do you need?",
		details: "Budget, deadline, links (or type skip)"
	}[lead.step] : "Ask about services, products, offices...";
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [open && /* @__PURE__ */ jsxs(CmsElement, {
		ref: panelRef,
		className: "chat-panel",
		role: "dialog",
		"aria-label": "Chat with Sybertron",
		"aria-modal": "false",
		cmsTag: "section",
		cmsSource: "components/ChatLauncher.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "chat-head",
				cmsTag: "header",
				cmsSource: "components/ChatLauncher.tsx:2",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "chat-bot chat-bot--lg",
						cmsTag: "span",
						cmsSource: "components/ChatLauncher.tsx:3",
						children: [/* @__PURE__ */ jsx(Bot, {
							size: 20,
							"aria-hidden": true
						}), /* @__PURE__ */ jsx(CmsElement, {
							"aria-hidden": true,
							cmsTag: "i",
							cmsSource: "components/ChatLauncher.tsx:4"
						})]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "div",
						cmsSource: "components/ChatLauncher.tsx:5",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "strong",
							cmsSource: "components/ChatLauncher.tsx:6",
							children: "Sybertron assistant"
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "small",
							cmsSource: "components/ChatLauncher.tsx:7",
							children: "Answers instantly, team replies within a business day"
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						className: "chat-icon",
						onClick: reset,
						"aria-label": "Start a new chat",
						title: "New chat",
						cmsTag: "button",
						cmsSource: "components/ChatLauncher.tsx:8",
						children: /* @__PURE__ */ jsx(RotateCcw, {
							size: 16,
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						className: "chat-icon",
						onClick: () => setOpen(false),
						"aria-label": "Close chat",
						cmsTag: "button",
						cmsSource: "components/ChatLauncher.tsx:9",
						children: /* @__PURE__ */ jsx(X, {
							size: 18,
							"aria-hidden": true
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "chat-log",
				ref: logRef,
				role: "log",
				"aria-live": "polite",
				"aria-relevant": "additions",
				cmsTag: "div",
				cmsSource: "components/ChatLauncher.tsx:10",
				children: [msgs.map((m) => /* @__PURE__ */ jsxs(CmsElement, {
					className: `chat-msg chat-msg--${m.role}`,
					cmsTag: "div",
					cmsSource: "components/ChatLauncher.tsx:11",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/ChatLauncher.tsx:12",
						children: m.text
					}), m.links && /* @__PURE__ */ jsx(CmsElement, {
						className: "chat-links",
						cmsTag: "div",
						cmsSource: "components/ChatLauncher.tsx:13",
						children: m.links.map((l) => /* @__PURE__ */ jsxs(CmsElement, {
							href: l.href,
							onClick: (e) => onLink(e, l),
							...l.external ? {
								target: "_blank",
								rel: "noopener noreferrer"
							} : {},
							cmsTag: "a",
							cmsSource: "components/ChatLauncher.tsx:14",
							children: [
								l.label,
								" ",
								/* @__PURE__ */ jsx(ArrowUpRight, {
									size: 14,
									"aria-hidden": true
								})
							]
						}, l.label + l.href))
					})]
				}, m.id)), typing && /* @__PURE__ */ jsxs(CmsElement, {
					className: "chat-msg chat-msg--bot chat-typing",
					"aria-label": "Assistant is typing",
					cmsTag: "div",
					cmsSource: "components/ChatLauncher.tsx:15",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "i",
							cmsSource: "components/ChatLauncher.tsx:16"
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "i",
							cmsSource: "components/ChatLauncher.tsx:17"
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "i",
							cmsSource: "components/ChatLauncher.tsx:18"
						})
					]
				})]
			}),
			lastBot?.chips && !typing && /* @__PURE__ */ jsx(CmsElement, {
				className: "chat-chips",
				cmsTag: "div",
				cmsSource: "components/ChatLauncher.tsx:19",
				children: lastBot.chips.map((c) => /* @__PURE__ */ jsx(CmsElement, {
					type: "button",
					onClick: () => void send(c),
					cmsTag: "button",
					cmsSource: "components/ChatLauncher.tsx:20",
					children: c
				}, c))
			}, lastBot.id),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "chat-form",
				onSubmit,
				cmsTag: "form",
				cmsSource: "components/ChatLauncher.tsx:21",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					ref: inputRef,
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder,
					"aria-label": "Your message",
					maxLength: 500,
					autoComplete: lead?.step === "email" ? "email" : lead?.step === "name" ? "name" : "off",
					inputMode: lead?.step === "email" ? "email" : "text",
					cmsTag: "input",
					cmsSource: "components/ChatLauncher.tsx:22"
				}), /* @__PURE__ */ jsx(CmsElement, {
					type: "submit",
					disabled: !text.trim(),
					"aria-label": "Send message",
					cmsTag: "button",
					cmsSource: "components/ChatLauncher.tsx:23",
					children: /* @__PURE__ */ jsx(Send, {
						size: 17,
						"aria-hidden": true
					})
				})]
			})
		]
	}), /* @__PURE__ */ jsxs(CmsElement, {
		type: "button",
		className: "chat-launcher",
		onClick: () => setOpen((o) => !o),
		"aria-expanded": open,
		"aria-label": open ? "Close chat" : "Open chat",
		cmsTag: "button",
		cmsSource: "components/ChatLauncher.tsx:24",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			className: "chat-bot",
			cmsTag: "span",
			cmsSource: "components/ChatLauncher.tsx:25",
			children: [open ? /* @__PURE__ */ jsx(X, {
				size: 18,
				"aria-hidden": true
			}) : /* @__PURE__ */ jsx(Bot, {
				size: 18,
				"aria-hidden": true
			}), /* @__PURE__ */ jsx(CmsElement, {
				"aria-hidden": true,
				cmsTag: "i",
				cmsSource: "components/ChatLauncher.tsx:26"
			})]
		}), open ? "Close" : "Talk to us"]
	})] });
}
// src/components/products/ProductsPage.tsx
var catLabel = (id) => categories.find((c) => c.id === id)?.label ?? "";
function ProductCard({ p, flip }) {
	const ref = useRef(null);
	useInView(ref, {
		once: true,
		amount: .3
	});
	return /* @__PURE__ */ jsxs(CmsElement, {
		id: `p-${p.id}`,
		ref,
		className: flip ? "pp-card is-flip" : "pp-card",
		"data-reveal": true,
		cmsTag: "article",
		cmsSource: "components/products/ProductsPage.tsx:1",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			className: "pp-copy",
			cmsTag: "div",
			cmsSource: "components/products/ProductsPage.tsx:2",
			children: [
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "pp-family",
					cmsTag: "p",
					cmsSource: "components/products/ProductsPage.tsx:3",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							style: { background: p.accent },
							cmsTag: "i",
							cmsSource: "components/products/ProductsPage.tsx:4"
						}),
						" ",
						catLabel(p.cat)
					]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h3",
					cmsSource: "components/products/ProductsPage.tsx:5",
					children: p.name
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "pp-blurb",
					cmsTag: "p",
					cmsSource: "components/products/ProductsPage.tsx:6",
					children: p.blurb
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/products/ProductsPage.tsx:7",
					children: p.bullets.map((b) => /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/products/ProductsPage.tsx:8",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							style: { background: p.accent },
							cmsTag: "i",
							cmsSource: "components/products/ProductsPage.tsx:9"
						}), b]
					}, b))
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "pp-platforms",
					cmsTag: "p",
					cmsSource: "components/products/ProductsPage.tsx:10",
					children: p.platforms
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "pp-actions",
					cmsTag: "div",
					cmsSource: "components/products/ProductsPage.tsx:11",
					children: [/* @__PURE__ */ jsxs(Button3D, {
						tone: "ink",
						onClick: () => goToContact(`Demo of ${p.name}`),
						children: ["Explore demo ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
					}), /* @__PURE__ */ jsx(Button3D, {
						tone: "paper",
						href: productHref(p.id),
						children: "Details"
					})]
				})
			]
		}), /* @__PURE__ */ jsx(CmsElement, {
			className: "pp-mock",
			"data-tilt": true,
			"data-cursor": "Demo",
			cmsTag: "div",
			cmsSource: "components/products/ProductsPage.tsx:12",
			children: /* @__PURE__ */ jsx(CmsElement, {
				className: "pp-mock-inner",
				cmsTag: "div",
				cmsSource: "components/products/ProductsPage.tsx:13",
				children: /* @__PURE__ */ jsx(ProductMock, { m: p.mock })
			})
		})]
	});
}
function ProductsPage() {
	const [active, setActive] = useState(categories[0].id);
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	const groups = useRef([]);
	useEffect(() => {
		const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
			if (e.isIntersecting) setActive(e.target.dataset.cat ?? "");
		}), { rootMargin: "-25% 0px -65% 0px" });
		groups.current.forEach((g) => g && spy.observe(g));
		return () => spy.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs(CmsElement, {
			className: "pp-hero",
			style: { "--intro": intro },
			cmsTag: "section",
			cmsSource: "components/products/ProductsPage.tsx:14",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/products/ProductsPage.tsx:15"
			}), /* @__PURE__ */ jsxs(CmsElement, {
				className: "pp-hero-inner",
				cmsTag: "div",
				cmsSource: "components/products/ProductsPage.tsx:16",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/products/ProductsPage.tsx:17",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/products/ProductsPage.tsx:18"
							}),
							" ",
							catalog.length,
							" ready-made products"
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						"aria-label": "Our products, ready to run.",
						cmsTag: "h1",
						cmsSource: "components/products/ProductsPage.tsx:19",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/products/ProductsPage.tsx:20",
							children: [
								/* @__PURE__ */ jsx(SplitWords, { text: "Our products," }),
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx(SplitWords, {
									text: "ready to run.",
									start: 2,
									em: true
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "pp-lede",
						cmsTag: "p",
						cmsSource: "components/products/ProductsPage.tsx:21",
						children: "Ready-made software we build and support ourselves. Each one can be set up for your business. Try any of them yourself, or book a guided demo."
					})
				]
			})]
		}),
		/* @__PURE__ */ jsxs(CmsElement, {
			className: "pp-layout",
			cmsTag: "div",
			cmsSource: "components/products/ProductsPage.tsx:22",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "pp-cats",
				"aria-label": "Product categories",
				cmsTag: "nav",
				cmsSource: "components/products/ProductsPage.tsx:23",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/products/ProductsPage.tsx:24",
					children: "Categories"
				}), /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/products/ProductsPage.tsx:25",
					children: categories.map((c) => /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/products/ProductsPage.tsx:26",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							href: `#cat-${c.id}`,
							className: active === c.id ? "is-active" : void 0,
							cmsTag: "a",
							cmsSource: "components/products/ProductsPage.tsx:27",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/products/ProductsPage.tsx:28",
								children: c.label
							}), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "b",
								cmsSource: "components/products/ProductsPage.tsx:29",
								children: catalog.filter((p) => p.cat === c.id).length
							})]
						})
					}, c.id))
				})]
			}), /* @__PURE__ */ jsxs(CmsElement, {
				className: "pp-groups",
				cmsTag: "div",
				cmsSource: "components/products/ProductsPage.tsx:30",
				children: [categories.map((c, ci) => /* @__PURE__ */ jsxs(CmsElement, {
					id: `cat-${c.id}`,
					"data-cat": c.id,
					ref: (el) => {
						groups.current[ci] = el;
					},
					className: "pp-group",
					style: { "--tone": c.tone },
					cmsTag: "section",
					cmsSource: "components/products/ProductsPage.tsx:31",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						className: "pp-group-title",
						"data-reveal": true,
						cmsTag: "h2",
						cmsSource: "components/products/ProductsPage.tsx:32",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "i",
								cmsSource: "components/products/ProductsPage.tsx:33"
							}),
							" ",
							c.label
						]
					}), catalog.filter((p) => p.cat === c.id).map((p, i) => /* @__PURE__ */ jsx(ProductCard, {
						p,
						flip: i % 2 === 1
					}, p.id))]
				}, c.id)), /* @__PURE__ */ jsxs(CmsElement, {
					className: "pp-fit",
					"data-reveal": "scale",
					cmsTag: "aside",
					cmsSource: "components/products/ProductsPage.tsx:34",
					children: [
						/* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "h2",
							cmsSource: "components/products/ProductsPage.tsx:35",
							children: ["Not sure which ", /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "em",
								cmsSource: "components/products/ProductsPage.tsx:36",
								children: "one fits?"
							})]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/products/ProductsPage.tsx:37",
							children: "Tell us about your business and we'll recommend the right product, or a custom build."
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "pp-actions",
							cmsTag: "div",
							cmsSource: "components/products/ProductsPage.tsx:38",
							children: [/* @__PURE__ */ jsxs(Button3D, {
								tone: "mint",
								onClick: () => goToContact("Book a guided demo"),
								children: ["Book a guided demo ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
							}), /* @__PURE__ */ jsx(Button3D, {
								tone: "paper",
								onClick: () => goToContact("Help me choose a product"),
								children: "Ask us"
							})]
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/data/productDetail.ts
var TPL = {
	"finance-pos": {
		builtFor: "Shops, restaurants, salons, small businesses and finance teams",
		compliance: "GST invoices · e-way bills · UPI",
		tags: [
			"Retail & stores",
			"Small businesses",
			"Finance teams",
			"Growing brands"
		],
		overview: (n) => `${n} connects billing, payments and stock so every sale is recorded once and shows up everywhere it should: the till, the ledger, the GST return and the owner's phone.`,
		problems: [
			"Paper bills and spreadsheet totals",
			"GST and tax rules that keep changing",
			"Cash, card and UPI counted in different places",
			"No clear view of profit, stock and dues"
		],
		modules: [
			["Billing & invoicing", "GST-ready bills and invoices with QR codes, discounts, returns and PDF or WhatsApp sharing."],
			["Customers & ledger", "Customer and supplier balances, credit limits, reminders and a full statement for every account."],
			["Stock & purchasing", "Live stock by branch, purchase orders, supplier bills and low-stock alerts."],
			["Payments", "UPI, card and cash in one place, with end-of-day cash count and settlement reports."],
			["Staff & shifts", "Cashier logins, shift handover, commissions and permission levels."],
			["Offers & loyalty", "Coupons, memberships and loyalty points that apply at checkout automatically."],
			["Reports", "Sales, profit, tax, expense and stock reports you can export for your accountant."],
			["Control", "Several branches under one login, with roles, approvals and a full activity log."]
		],
		features: [
			"Multi-branch dashboard",
			"QR codes on every bill",
			"Sales, tax and profit reports",
			"Customer and supplier ledgers",
			"Staff roles and permissions",
			"Coupons and memberships",
			"Share bills on WhatsApp and email",
			"Backups and activity log",
			"Data import from Excel"
		],
		price: [999, 2499],
		unit: "month",
		trial: "a free 14-day trial with sample data"
	},
	operations: {
		builtFor: "Operations heads, facility teams, warehouses and field managers",
		compliance: "Audit trail · role-based access",
		tags: [
			"Operations teams",
			"Facility managers",
			"Warehouses",
			"Service companies"
		],
		overview: (n) => `${n} replaces scattered sheets and phone calls with one live record of what you own, where it is and what needs doing next, so nothing is chased by hand.`,
		problems: [
			"Updates that live in WhatsApp and spreadsheets",
			"No clear owner for each task or asset",
			"Surprises: late jobs, missing items, expired services",
			"Reports that take a day to put together"
		],
		modules: [
			["Live dashboard", "One screen for status, open work, exceptions and what needs attention today."],
			["Records & registry", "Every item, site, vehicle or job with its history, documents and owner."],
			["Tasks & scheduling", "Assign, schedule and track work with reminders that escalate when something slips."],
			["Mobile apps", "Field staff update status, scan codes and capture photos or signatures from a phone."],
			["Alerts & reminders", "Service dates, expiries and delays reach the right person before they become a problem."],
			["Vendors & purchasing", "Vendors, quotes, orders and costs linked back to the work they belong to."],
			["Reports", "Utilisation, cost, turnaround and compliance reports, scheduled to your inbox."],
			["Control", "Roles, approvals and a complete activity log across every site and team."]
		],
		features: [
			"Live status dashboard",
			"QR and barcode scanning",
			"Task assignment and reminders",
			"Photo and signature capture",
			"Maintenance and service schedules",
			"Vendor and cost tracking",
			"Scheduled email reports",
			"Multi-site support",
			"Roles, approvals and activity log"
		],
		price: [1499, 3499],
		unit: "month",
		trial: "a free 14-day trial with sample data"
	},
	people: {
		builtFor: "Front desks, clinics, gyms, HR teams and offices",
		compliance: "Role-based access · data privacy controls",
		tags: [
			"Front desk teams",
			"Clinics & studios",
			"HR & admin",
			"Multi-branch groups"
		],
		overview: (n) => `${n} takes the paperwork out of dealing with people: sign-ins, appointments, records and reminders run themselves, and your team sees who needs attention right now.`,
		problems: [
			"Registers and notebooks nobody can search",
			"Missed appointments, renewals and follow-ups",
			"Records that sit with one person",
			"No audit trail of who came, who left and who approved"
		],
		modules: [
			["Check-in & registration", "QR, kiosk or desk check-in with pre-registration and instant confirmation."],
			["People & records", "A searchable profile for every person with notes, documents and history."],
			["Scheduling", "Appointments, shifts and classes with waitlists and automatic reminders."],
			["Billing & plans", "Fees, memberships and packages with online payment and receipts."],
			["Notifications", "SMS, WhatsApp and email alerts to the host, staff member or customer."],
			["Staff & roles", "Reception, manager and admin logins, each seeing only what they should."],
			["Reports", "Footfall, attendance, revenue and no-show reports by day, branch or team."],
			["Control", "Privacy settings, data export and a full activity log for audits."]
		],
		features: [
			"QR check-in",
			"Searchable people records",
			"Automatic reminders",
			"Waitlists and rescheduling",
			"Online payments and receipts",
			"SMS, WhatsApp and email alerts",
			"Attendance and footfall reports",
			"Multi-branch support",
			"Privacy controls and audit log"
		],
		price: [899, 2199],
		unit: "month",
		trial: "a free 14-day trial with sample data"
	},
	commerce: {
		builtFor: "Distributors, wholesalers, service businesses and online sellers",
		compliance: "GST invoicing · secure payments",
		tags: [
			"Distributors",
			"Service businesses",
			"Online sellers",
			"Sales teams"
		],
		overview: (n) => `${n} turns enquiries into paid orders without the back-and-forth, with prices, availability and follow-ups handled in one place your customers can also use.`,
		problems: [
			"Orders arriving by phone, chat and email",
			"Price lists and credit limits kept in someone's head",
			"Follow-ups that depend on memory",
			"No view of what is booked, paid or pending"
		],
		modules: [
			["Orders & bookings", "Take orders or bookings online with live availability and instant confirmation."],
			["Customers & CRM", "Every enquiry, customer and conversation on one timeline with owners and reminders."],
			["Pricing & rules", "Customer-specific prices, tiers, deposits, credit limits and approval rules."],
			["Payments", "Deposits, prepayment and invoices with online payment links."],
			["Customer portal", "Customers reorder, rebook and track status without calling you."],
			["Reminders", "SMS, WhatsApp and email nudges that cut no-shows and late payments."],
			["Reports", "Pipeline, order value, conversion and no-show reports by team and channel."],
			["Control", "Roles, approvals and an activity log across every sales channel."]
		],
		features: [
			"Online order and booking pages",
			"Customer-specific price lists",
			"Deposits and prepayment",
			"Credit limits and approvals",
			"Reorder from past orders",
			"WhatsApp, SMS and email reminders",
			"Sales rep mobile access",
			"Order and conversion reports",
			"Roles and activity log"
		],
		price: [1299, 2999],
		unit: "month",
		trial: "a free 14-day trial with sample data"
	},
	"ai-data": {
		builtFor: "Support, operations and leadership teams with data or documents to put to work",
		compliance: "Your data stays yours · role-based access",
		tags: [
			"Support teams",
			"Operations",
			"Leadership",
			"Data teams"
		],
		overview: (n) => `${n} puts AI to work on your own content and data, with answers you can trace back to the source and a person always able to step in.`,
		problems: [
			"Answers buried in documents nobody reads",
			"The same questions asked again and again",
			"Reports that wait for an analyst",
			"AI tools with no control over what they see"
		],
		modules: [
			["Knowledge base", "Connect documents, sites and databases. Answers cite the source they came from."],
			["Ask in plain language", "Anyone on the team asks a question and gets an answer, a chart or a draft."],
			["Automations", "Route, tag, extract and summarise automatically, and flag anything uncertain."],
			["Human handover", "Low-confidence cases go to a person with the full context attached."],
			["Channels", "Website widget, WhatsApp, email and an API for your own apps."],
			["Accuracy tools", "Review queues, feedback buttons and test sets to keep answers reliable."],
			["Reports", "Usage, resolution, accuracy and saved-time reports, scheduled or on demand."],
			["Control", "Access rules per team, data retention settings and a full audit log."]
		],
		features: [
			"Answers with source links",
			"Documents, sites and database connectors",
			"Plain-language questions",
			"Human handover with context",
			"WhatsApp and website channels",
			"Review queue for low-confidence cases",
			"Scheduled reports",
			"Access control by team",
			"Audit log and data retention"
		],
		price: [2999, 7999],
		unit: "month",
		trial: "a free pilot on a sample of your own content"
	},
	"security-cloud": {
		builtFor: "IT teams, compliance owners and companies running business-critical systems",
		compliance: "Encrypted at rest and in transit · audit-ready",
		tags: [
			"IT teams",
			"Compliance owners",
			"Growing companies",
			"Regulated sectors"
		],
		overview: (n) => `${n} keeps a steady eye on the things that cannot go wrong, and gives your team clear alerts, clean evidence and fast recovery when something does.`,
		problems: [
			"Alerts everywhere and no single view",
			"Backups nobody has ever tested",
			"Audit season that takes weeks of screenshots",
			"Cloud bills that creep up unnoticed"
		],
		modules: [
			["Overview dashboard", "Health, alerts and risk across every system on a single screen."],
			["Monitoring", "Logins, access changes and unusual activity, with alerts to email or chat."],
			["Backups & recovery", "Scheduled, encrypted backups with tested one-click restores."],
			["Compliance checklists", "Policies, controls and evidence tracked against the standards you follow."],
			["Access control", "Who can reach what, reviewed regularly and revoked in one click."],
			["Cost control", "Usage and cost by workload, with spike alerts and savings suggestions."],
			["Reports", "Audit-ready exports and scheduled summaries for management."],
			["Control", "Roles, approvals and a tamper-evident activity log."]
		],
		features: [
			"Login and access monitoring",
			"Alerts by email and chat",
			"Scheduled encrypted backups",
			"One-click restore",
			"Compliance checklists and evidence",
			"Access reviews",
			"Usage and cost reports",
			"Audit-ready exports",
			"Tamper-evident activity log"
		],
		price: [3499, 8999],
		unit: "month",
		trial: "a free 14-day trial on a non-production workload"
	},
	"ar-vr": {
		builtFor: "Brands, developers, venues, trainers and real-estate teams",
		compliance: "Comfort-tested · privacy-first analytics",
		tags: [
			"Brands & retail",
			"Real estate",
			"Training teams",
			"Venues & events"
		],
		overview: (n) => `${n} turns spaces and products into experiences people can step into, from a headset, a phone or a browser, and measures what they actually look at.`,
		problems: [
			"Products and spaces that are hard to show remotely",
			"Training that does not stick",
			"Content that is expensive to update",
			"No data on what visitors actually do"
		],
		modules: [
			["Scene builder", "Assemble scenes from your 3D models, 360° photos and video without writing code."],
			["Interaction", "Hotspots, guided steps, product swaps and calls to action inside the scene."],
			["Device support", "Headsets, phones, tablets and the browser from one published build."],
			["Content updates", "Edit text, models and media yourself and publish without a new release."],
			["Embeds & sharing", "Drop an experience into your website or share it as a link or QR code."],
			["Analytics", "Sessions, time per scene, hotspot clicks and completion rates."],
			["Comfort & performance", "Frame-rate and motion-comfort tuning for affordable hardware."],
			["Control", "Roles, versioning and an approval step before anything goes live."]
		],
		features: [
			"Drag-and-drop scene builder",
			"Hotspots and guided steps",
			"Headset, phone and browser support",
			"Update content without a release",
			"Website embeds and QR links",
			"Session and engagement analytics",
			"Comfort-first performance tuning",
			"Versioning and approvals",
			"Multi-language support"
		],
		price: [24999, 74999],
		unit: "project",
		trial: "a free sample scene built from your own material"
	},
	education: {
		builtFor: "Schools, academies, coaching centres and training providers",
		compliance: "Student data privacy · parent-safe access",
		tags: [
			"Schools",
			"Academies",
			"Coaching centres",
			"Training providers"
		],
		overview: (n) => `${n} brings admissions, teaching, fees and communication into one system that staff, students and parents all actually use.`,
		problems: [
			"Fees chased by hand every month",
			"Attendance and marks in different files",
			"Parents who never see what is going on",
			"Results and reports that take days to prepare"
		],
		modules: [
			["Admissions", "Enquiries, applications and enrolment with documents and fee set-up."],
			["Students & classes", "Profiles, sections, timetables and attendance in a few taps."],
			["Fees & payments", "Fee vouchers, instalments, online payment and automatic reminders."],
			["Learning", "Courses, lessons, question banks, assignments and live classes."],
			["Exams & results", "Marks entry, grading rules, report cards and ranked results."],
			["Parent & student app", "Notices, homework, attendance, fees and results on a phone."],
			["Reports", "Attendance, collection, performance and teacher workload reports."],
			["Control", "Roles for admin, teacher, parent and student, with a full activity log."]
		],
		features: [
			"Online admissions",
			"Attendance by class and subject",
			"Fee vouchers and online payments",
			"Report cards and results",
			"Question banks and tests",
			"Live classes",
			"Parent and student app",
			"Notices by SMS and app",
			"Roles and activity log"
		],
		price: [1499, 3499],
		unit: "month",
		trial: "a free 14-day trial with sample data"
	}
};
var SPARE = [
	"Data export to Excel and CSV",
	"Custom branding",
	"Mobile-friendly interface",
	"Regular updates included",
	"Email and chat support",
	"Import from your existing data"
];
var STOP = /* @__PURE__ */ new Set([
	"and",
	"the",
	"for",
	"your",
	"with",
	"per",
	"by",
	"in",
	"on",
	"of",
	"to",
	"a"
]);
var words = (f) => new Set(f.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));
var similar = (a, b) => {
	const A = words(a), B = words(b);
	const common = [...A].filter((w) => B.has(w)).length;
	return common > 0 && common / Math.min(A.size, B.size) >= .6;
};
function pickFeatures(own, extra) {
	const out = [];
	for (const f of [
		...own,
		...extra,
		...SPARE
	]) if (!out.some((o) => similar(o, f))) out.push(f);
	return out.slice(0, 12);
}
var fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
var OVERRIDES = {};
function getProduct(id) {
	const item = catalog.find((p) => p.id === id);
	if (!item) return null;
	const t = TPL[item.cat];
	const family = categories.find((c) => c.id === item.cat)?.label ?? "";
	const n = item.name;
	const [lo, hi] = t.price;
	const platforms = item.platforms.split(" · ");
	const hasMobile = /phone|app|tablet|kiosk|handheld/i.test(item.platforms);
	const features = pickFeatures(item.bullets, t.features);
	const plans = [
		{
			name: "Starter",
			price: `${t.unit === "project" ? "From " : ""}${fmt(lo)}`,
			unit: t.unit,
			note: `For small teams getting started with ${n}.`,
			items: [
				features[0],
				features[1],
				"Core reports",
				"Email support"
			],
			cta: "Try it free"
		},
		{
			name: "Pro",
			price: `${t.unit === "project" ? "From " : ""}${fmt(hi)}`,
			unit: t.unit,
			note: "For businesses that want full control and automation.",
			items: [
				"Everything in Starter",
				features[2],
				"Multi-branch and roles",
				`All ${features.length} features`
			],
			cta: "Try it free",
			featured: true
		},
		{
			name: "Enterprise",
			price: "On request",
			unit: "",
			note: "For larger companies with custom needs. Yearly billing.",
			items: [
				"Everything in Pro",
				"Custom set-up and integrations",
				"Dedicated support"
			],
			cta: "Talk to us"
		}
	];
	const faq = [
		{
			q: `What is ${n}?`,
			a: `${item.blurb} It is built and supported by Sybertron, so the people who answer your questions are the people who wrote the software.`
		},
		{
			q: `Is ${n} secure?`,
			a: `Yes. Data is encrypted in transit and at rest, access is controlled by role, and every important action is written to an activity log. ${t.compliance}.`
		},
		{
			q: `Can I try ${n} before subscribing?`,
			a: `Yes. We offer ${t.trial}. You can also book a 30-minute guided walkthrough, online or on-site.`
		},
		{
			q: "Is there a mobile app?",
			a: hasMobile ? `${n} runs on ${platforms.join(", ")}. Everything stays in sync, so staff can work from whichever device is closest.` : `${n} runs on ${platforms.join(", ")}, and the web version works in the browser on phones and tablets as well.`
		},
		{
			q: "Can it be set up for my business?",
			a: "Yes. We set it up with your products, branches, roles and branding, import your existing data, and can add custom features or integrations when you need them."
		}
	];
	const same = catalog.filter((p) => p.cat === item.cat && p.id !== id);
	const rest = catalog.filter((p) => p.cat !== item.cat);
	const idx = catalog.findIndex((p) => p.id === id);
	const related = [...same, ...rest.slice(idx % Math.max(rest.length - 3, 1))].slice(0, 3);
	return {
		item,
		family,
		host: `${id}.sybertron.com`,
		runsOn: item.platforms,
		builtFor: t.builtFor,
		compliance: t.compliance,
		headline: item.blurb,
		overview: t.overview(n),
		tags: t.tags,
		problems: t.problems,
		modules: t.modules.map(([title, d]) => ({
			t: title,
			d
		})),
		features,
		plans,
		faq,
		related,
		...OVERRIDES[id]
	};
}
var LIST_P = [
	92,
	85,
	78,
	96,
	70,
	88
];
var TILE_P = [
	90,
	20,
	60,
	5,
	60,
	90,
	20,
	5,
	60,
	90,
	5,
	20
];
var CHART_P = [
	28,
	36,
	30,
	48,
	44,
	58,
	52,
	70
];
function asVariant(m, variant, crumbTail) {
	const rows = variant === "list" ? [
		"Team A",
		"Team B",
		"Team C",
		"Team D",
		"Team E",
		"Team F"
	].map((n, k) => ({
		n,
		p: LIST_P[k],
		t: `${LIST_P[k]}%`
	})) : variant === "chart" ? CHART_P.map((p, k) => ({
		n: `W${k + 1}`,
		p,
		t: ""
	})) : TILE_P.map((p, k) => ({
		n: `T${k + 1}`,
		p,
		t: ""
	}));
	const head = m.crumb.split(" / ")[0];
	return {
		...m,
		variant,
		rows,
		crumb: `${head} / ${crumbTail}`,
		title: crumbTail
	};
}
// src/components/products/ProductDetailPage.tsx
var MODULE_ICONS = [
	FileText,
	Users,
	Boxes,
	Wallet,
	LayoutGrid,
	BarChart3,
	ShieldCheck,
	Settings2
];
var pad$1 = (n) => String(n + 1).padStart(2, "0");
function LiveMock({ m, amount = .25 }) {
	const ref = useRef(null);
	useInView(ref, {
		once: true,
		amount
	});
	return /* @__PURE__ */ jsx(CmsElement, {
		ref,
		className: "pd-live",
		cmsTag: "div",
		cmsSource: "components/products/ProductDetailPage.tsx:1",
		children: /* @__PURE__ */ jsx(ProductMock, { m })
	});
}
function Block({ id, className = "", children }) {
	return /* @__PURE__ */ jsx(CmsElement, {
		id,
		className: `pd-block ${className}`,
		cmsTag: "section",
		cmsSource: "components/products/ProductDetailPage.tsx:2",
		children: /* @__PURE__ */ jsx(CmsElement, {
			className: "pd-wrap",
			cmsTag: "div",
			cmsSource: "components/products/ProductDetailPage.tsx:3",
			children
		})
	});
}
function Problem({ text, i, on }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		style: { "--i": i },
		className: on ? "is-on" : void 0,
		cmsTag: "li",
		cmsSource: "components/products/ProductDetailPage.tsx:4",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "pd-prob-ic",
				"aria-hidden": "true",
				cmsTag: "span",
				cmsSource: "components/products/ProductDetailPage.tsx:5",
				children: /* @__PURE__ */ jsx(Minus, { size: 14 })
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "pd-prob-t",
				cmsTag: "span",
				cmsSource: "components/products/ProductDetailPage.tsx:6",
				children: text
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "pd-switch",
				"aria-hidden": "true",
				cmsTag: "span",
				cmsSource: "components/products/ProductDetailPage.tsx:7",
				children: /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "i",
					cmsSource: "components/products/ProductDetailPage.tsx:8"
				})
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "sr-only",
				cmsTag: "span",
				cmsSource: "components/products/ProductDetailPage.tsx:9",
				children: on ? "Solved" : "Problem"
			})
		]
	});
}
function Faq({ q, a, open, onToggle, i }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: open ? "pd-faq is-open" : "pd-faq",
		style: { "--i": i },
		cmsTag: "div",
		cmsSource: "components/products/ProductDetailPage.tsx:10",
		children: [/* @__PURE__ */ jsx(CmsElement, {
			cmsTag: "h3",
			cmsSource: "components/products/ProductDetailPage.tsx:11",
			children: /* @__PURE__ */ jsxs(CmsElement, {
				type: "button",
				"aria-expanded": open,
				onClick: onToggle,
				cmsTag: "button",
				cmsSource: "components/products/ProductDetailPage.tsx:12",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/products/ProductDetailPage.tsx:13",
					children: q
				}), open ? /* @__PURE__ */ jsx(Minus, {
					size: 16,
					"aria-hidden": true
				}) : /* @__PURE__ */ jsx(Plus, {
					size: 16,
					"aria-hidden": true
				})]
			})
		}), /* @__PURE__ */ jsx(CmsElement, {
			className: "pd-faq-body",
			cmsTag: "div",
			cmsSource: "components/products/ProductDetailPage.tsx:14",
			children: /* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "p",
				cmsSource: "components/products/ProductDetailPage.tsx:15",
				children: a
			})
		})]
	});
}
function ProductDetailPage() {
	const d = getProduct(productIdOf(useRouter().path) ?? "");
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	const [open, setOpen] = useState(0);
	const probRef = useRef(null);
	const probOn = useInView(probRef, {
		once: true,
		amount: .5
	});
	const featRef = useRef(null);
	const featIn = useInView(featRef, {
		once: true,
		amount: .35
	});
	const count = useCountUp(d?.features.length ?? 0, featIn);
	useEffect(() => {}, [d]);
	if (!d) return null;
	const { item } = d;
	const style = {
		"--tone": categories.find((c) => c.id === item.cat)?.tone ?? "#c9b7ff",
		"--accent": item.accent
	};
	const m = item.mock;
	const gallery = [
		{
			m,
			cap: `${item.name} dashboard, live view`,
			cls: "pd-shot--lg"
		},
		{
			m: asVariant(m, m.variant === "list" ? "chart" : "list", "Reports"),
			cap: "Reports ready to share",
			cls: ""
		},
		{
			m: asVariant(m, m.variant === "tiles" ? "chart" : "tiles", "Overview"),
			cap: "Status at a glance",
			cls: ""
		},
		{
			m: asVariant(m, m.variant === "chart" ? "list" : "chart", "Teams"),
			cap: "Work by team and branch",
			cls: "pd-shot--wide"
		}
	];
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "pd",
		style,
		cmsTag: "div",
		cmsSource: "components/products/ProductDetailPage.tsx:16",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "pd-hero",
				style: { "--intro": intro },
				cmsTag: "section",
				cmsSource: "components/products/ProductDetailPage.tsx:17",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						className: "hero-blob hero-blob--one",
						"data-parallax": "0.14",
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:18"
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "pd-wrap pd-hero-grid",
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:19",
						children: [/* @__PURE__ */ jsxs(CmsElement, {
							className: "pd-hero-copy",
							cmsTag: "div",
							cmsSource: "components/products/ProductDetailPage.tsx:20",
							children: [
								/* @__PURE__ */ jsxs(CmsElement, {
									className: "pd-crumb",
									"aria-label": "Breadcrumb",
									cmsTag: "nav",
									cmsSource: "components/products/ProductDetailPage.tsx:21",
									children: [
										/* @__PURE__ */ jsx(CmsElement, {
											href: "/products",
											cmsTag: "a",
											cmsSource: "components/products/ProductDetailPage.tsx:22",
											children: "Products"
										}),
										/* @__PURE__ */ jsx(CmsElement, {
											"aria-hidden": "true",
											cmsTag: "span",
											cmsSource: "components/products/ProductDetailPage.tsx:23",
											children: "/"
										}),
										/* @__PURE__ */ jsx(CmsElement, {
											"aria-current": "page",
											cmsTag: "span",
											cmsSource: "components/products/ProductDetailPage.tsx:24",
											children: item.name
										})
									]
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									"aria-label": item.name,
									cmsTag: "h1",
									cmsSource: "components/products/ProductDetailPage.tsx:25",
									children: /* @__PURE__ */ jsx(CmsElement, {
										"aria-hidden": "true",
										cmsTag: "span",
										cmsSource: "components/products/ProductDetailPage.tsx:26",
										children: /* @__PURE__ */ jsx(SplitWords, { text: item.name })
									})
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									className: "pd-lede",
									cmsTag: "p",
									cmsSource: "components/products/ProductDetailPage.tsx:27",
									children: d.headline
								}),
								/* @__PURE__ */ jsxs(CmsElement, {
									className: "pd-actions",
									cmsTag: "div",
									cmsSource: "components/products/ProductDetailPage.tsx:28",
									children: [/* @__PURE__ */ jsxs(Button3D, {
										tone: "mint",
										onClick: () => goToContact(`Demo of ${item.name}`),
										children: ["Explore demo ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
									}), /* @__PURE__ */ jsx(Button3D, {
										tone: "paper",
										onClick: () => goToContact(`Book a demo of ${item.name}`),
										children: "Book a demo"
									})]
								}),
								/* @__PURE__ */ jsxs(CmsElement, {
									className: "text-link pd-visit",
									href: `https://${d.host}`,
									target: "_blank",
									rel: "noopener noreferrer",
									cmsTag: "a",
									cmsSource: "components/products/ProductDetailPage.tsx:29",
									children: [
										"Visit ",
										d.host,
										" ",
										/* @__PURE__ */ jsx(ArrowUpRight, {
											size: 14,
											"aria-hidden": true
										})
									]
								})
							]
						}), /* @__PURE__ */ jsx(CmsElement, {
							className: "pd-hero-mock",
							"data-tilt": true,
							"data-cursor": "Demo",
							cmsTag: "div",
							cmsSource: "components/products/ProductDetailPage.tsx:30",
							children: /* @__PURE__ */ jsx(CmsElement, {
								className: "pp-mock-inner",
								cmsTag: "div",
								cmsSource: "components/products/ProductDetailPage.tsx:31",
								children: /* @__PURE__ */ jsx(ProductMock, { m })
							})
						})]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "pd-wrap pd-meta",
						"data-reveal": true,
						cmsTag: "dl",
						cmsSource: "components/products/ProductDetailPage.tsx:32",
						children: [
							/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "div",
								cmsSource: "components/products/ProductDetailPage.tsx:33",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dt",
									cmsSource: "components/products/ProductDetailPage.tsx:34",
									children: "Category"
								}), /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dd",
									cmsSource: "components/products/ProductDetailPage.tsx:35",
									children: d.family
								})]
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "div",
								cmsSource: "components/products/ProductDetailPage.tsx:36",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dt",
									cmsSource: "components/products/ProductDetailPage.tsx:37",
									children: "Runs on"
								}), /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dd",
									cmsSource: "components/products/ProductDetailPage.tsx:38",
									children: d.runsOn
								})]
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "div",
								cmsSource: "components/products/ProductDetailPage.tsx:39",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dt",
									cmsSource: "components/products/ProductDetailPage.tsx:40",
									children: "Built for"
								}), /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dd",
									cmsSource: "components/products/ProductDetailPage.tsx:41",
									children: d.builtFor
								})]
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "div",
								cmsSource: "components/products/ProductDetailPage.tsx:42",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dt",
									cmsSource: "components/products/ProductDetailPage.tsx:43",
									children: "Compliance"
								}), /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "dd",
									cmsSource: "components/products/ProductDetailPage.tsx:44",
									children: d.compliance
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs(Block, {
				id: "overview",
				className: "pd-overview",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "pd-overview-top",
					"data-reveal": true,
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:45",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						className: "pd-title",
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:46",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								className: "pd-ic",
								"aria-hidden": "true",
								cmsTag: "span",
								cmsSource: "components/products/ProductDetailPage.tsx:47",
								children: /* @__PURE__ */ jsx(FileText, { size: 20 })
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h2",
								cmsSource: "components/products/ProductDetailPage.tsx:48",
								children: "Overview"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "pd-tags",
								cmsTag: "ul",
								cmsSource: "components/products/ProductDetailPage.tsx:49",
								children: d.tags.map((t) => /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "li",
									cmsSource: "components/products/ProductDetailPage.tsx:50",
									children: t
								}, t))
							})
						]
					}), /* @__PURE__ */ jsxs(CmsElement, {
						className: "pd-overview-copy",
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:51",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							className: "pd-pull",
							cmsTag: "p",
							cmsSource: "components/products/ProductDetailPage.tsx:52",
							children: d.headline
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/products/ProductDetailPage.tsx:53",
							children: d.overview
						})]
					})]
				}), /* @__PURE__ */ jsx(CmsElement, {
					className: "pd-gallery",
					"data-reveal": true,
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:54",
					children: gallery.map((g, i) => /* @__PURE__ */ jsxs(CmsElement, {
						className: `pd-shot ${g.cls}`,
						style: { "--i": i },
						cmsTag: "figure",
						cmsSource: "components/products/ProductDetailPage.tsx:55",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							className: "pd-shot-frame",
							"data-tilt": true,
							cmsTag: "div",
							cmsSource: "components/products/ProductDetailPage.tsx:56",
							children: /* @__PURE__ */ jsx(LiveMock, {
								m: g.m,
								amount: .2
							})
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "figcaption",
							cmsSource: "components/products/ProductDetailPage.tsx:57",
							children: g.cap
						})]
					}, g.cap))
				})]
			}),
			/* @__PURE__ */ jsxs(Block, {
				id: "problems",
				className: "pd-problems",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "pd-h",
						"data-reveal": true,
						cmsTag: "h2",
						cmsSource: "components/products/ProductDetailPage.tsx:58",
						children: ["Problems it ", /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "em",
							cmsSource: "components/products/ProductDetailPage.tsx:59",
							children: "solves"
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "pd-probs",
						ref: probRef,
						cmsTag: "ul",
						cmsSource: "components/products/ProductDetailPage.tsx:60",
						children: d.problems.map((p, i) => /* @__PURE__ */ jsx(Problem, {
							text: p,
							i,
							on: probOn
						}, p))
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "pd-kicker",
						"data-reveal": true,
						cmsTag: "p",
						cmsSource: "components/products/ProductDetailPage.tsx:61",
						children: "How it fits together"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "pd-modules",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:62",
						children: d.modules.map((x, i) => {
							const Icon = MODULE_ICONS[i % MODULE_ICONS.length];
							return /* @__PURE__ */ jsxs(CmsElement, {
								style: { "--i": i },
								cmsTag: "article",
								cmsSource: "components/products/ProductDetailPage.tsx:63",
								children: [
									/* @__PURE__ */ jsx(CmsElement, {
										className: "pd-mod-no",
										cmsTag: "span",
										cmsSource: "components/products/ProductDetailPage.tsx:64",
										children: pad$1(i)
									}),
									/* @__PURE__ */ jsx(CmsElement, {
										className: "pd-mod-ic",
										"aria-hidden": "true",
										cmsTag: "span",
										cmsSource: "components/products/ProductDetailPage.tsx:65",
										children: /* @__PURE__ */ jsx(Icon, { size: 18 })
									}),
									/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "h3",
										cmsSource: "components/products/ProductDetailPage.tsx:66",
										children: x.t
									}),
									/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "p",
										cmsSource: "components/products/ProductDetailPage.tsx:67",
										children: x.d
									})
								]
							}, x.t);
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Block, {
				id: "features",
				className: "pd-features",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "pd-features-grid",
					ref: featRef,
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:68",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						className: "pd-features-lead",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:69",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								className: "pd-h",
								cmsTag: "h2",
								cmsSource: "components/products/ProductDetailPage.tsx:70",
								children: "Features"
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "pd-count",
								cmsTag: "div",
								cmsSource: "components/products/ProductDetailPage.tsx:71",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									"aria-label": `${d.features.length} features`,
									cmsTag: "strong",
									cmsSource: "components/products/ProductDetailPage.tsx:72",
									children: count
								}), /* @__PURE__ */ jsxs(CmsElement, {
									cmsTag: "p",
									cmsSource: "components/products/ProductDetailPage.tsx:73",
									children: [
										"features, ready",
										/* @__PURE__ */ jsx("br", {}),
										"on day one"
									]
								})]
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "pd-features-note",
								cmsTag: "p",
								cmsSource: "components/products/ProductDetailPage.tsx:74",
								children: [
									"What ",
									item.name,
									" does out of the box. Anything missing can be added for your business."
								]
							})
						]
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: featIn ? "pd-flist is-in" : "pd-flist",
						cmsTag: "ol",
						cmsSource: "components/products/ProductDetailPage.tsx:75",
						children: d.features.map((f, i) => /* @__PURE__ */ jsxs(CmsElement, {
							style: { "--i": i },
							cmsTag: "li",
							cmsSource: "components/products/ProductDetailPage.tsx:76",
							children: [
								/* @__PURE__ */ jsx(CmsElement, {
									className: "pd-f-no",
									cmsTag: "span",
									cmsSource: "components/products/ProductDetailPage.tsx:77",
									children: pad$1(i)
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									className: "pd-f-ic",
									"aria-hidden": "true",
									cmsTag: "span",
									cmsSource: "components/products/ProductDetailPage.tsx:78",
									children: /* @__PURE__ */ jsx(Check, { size: 15 })
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "span",
									cmsSource: "components/products/ProductDetailPage.tsx:79",
									children: f
								})
							]
						}, f))
					})]
				})
			}),
			/* @__PURE__ */ jsxs(Block, {
				id: "plans",
				className: "pd-plans",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "pd-plans-head",
					"data-reveal": true,
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:80",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "pd-h",
						cmsTag: "h2",
						cmsSource: "components/products/ProductDetailPage.tsx:81",
						children: "Plans"
					}), /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/products/ProductDetailPage.tsx:82",
						children: [
							"Prices as listed on ",
							d.host,
							". Yearly billing saves around 17%."
						]
					})]
				}), /* @__PURE__ */ jsx(CmsElement, {
					className: "pd-plan-grid",
					"data-reveal": true,
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:83",
					children: d.plans.map((p, i) => /* @__PURE__ */ jsxs(CmsElement, {
						className: p.featured ? "pd-plan is-featured" : "pd-plan",
						style: { "--i": i },
						cmsTag: "article",
						cmsSource: "components/products/ProductDetailPage.tsx:84",
						children: [
							p.featured && /* @__PURE__ */ jsx(CmsElement, {
								className: "pd-badge",
								cmsTag: "span",
								cmsSource: "components/products/ProductDetailPage.tsx:85",
								children: "Most popular"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/products/ProductDetailPage.tsx:86",
								children: p.name
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "pd-price",
								cmsTag: "p",
								cmsSource: "components/products/ProductDetailPage.tsx:87",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "strong",
									cmsSource: "components/products/ProductDetailPage.tsx:88",
									children: p.price
								}), p.unit && /* @__PURE__ */ jsxs(CmsElement, {
									cmsTag: "span",
									cmsSource: "components/products/ProductDetailPage.tsx:89",
									children: [" / ", p.unit]
								})]
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "pd-plan-note",
								cmsTag: "p",
								cmsSource: "components/products/ProductDetailPage.tsx:90",
								children: p.note
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "ul",
								cmsSource: "components/products/ProductDetailPage.tsx:91",
								children: p.items.map((it) => /* @__PURE__ */ jsxs(CmsElement, {
									cmsTag: "li",
									cmsSource: "components/products/ProductDetailPage.tsx:92",
									children: [
										/* @__PURE__ */ jsx(Check, {
											size: 14,
											"aria-hidden": true
										}),
										" ",
										it
									]
								}, it))
							}),
							/* @__PURE__ */ jsx(Button3D, {
								tone: p.featured ? "mint" : "paper",
								onClick: () => goToContact(`${p.name} plan: ${item.name}`),
								children: p.cta
							})
						]
					}, p.name))
				})]
			}),
			/* @__PURE__ */ jsx(Block, {
				id: "faq",
				className: "pd-faqs",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "pd-faq-grid",
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:93",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "pd-h",
						"data-reveal": true,
						cmsTag: "h2",
						cmsSource: "components/products/ProductDetailPage.tsx:94",
						children: "Questions"
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "pd-faq-list",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:95",
						children: d.faq.map((f, i) => /* @__PURE__ */ jsx(Faq, {
							...f,
							i,
							open: open === i,
							onToggle: () => setOpen(open === i ? -1 : i)
						}, f.q))
					})]
				})
			}),
			/* @__PURE__ */ jsx(Block, {
				id: "live",
				className: "pd-see",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "pd-see-card",
					"data-reveal": "scale",
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:96",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:97",
						children: [/* @__PURE__ */ jsxs(CmsElement, {
							className: "pd-h",
							cmsTag: "h2",
							cmsSource: "components/products/ProductDetailPage.tsx:98",
							children: [
								"See ",
								item.name,
								" ",
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "em",
									cmsSource: "components/products/ProductDetailPage.tsx:99",
									children: "live."
								})
							]
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/products/ProductDetailPage.tsx:100",
							children: "Explore it yourself right now, or book a 30-minute guided walkthrough, online or on-site."
						})]
					}), /* @__PURE__ */ jsxs(CmsElement, {
						className: "pd-actions",
						cmsTag: "div",
						cmsSource: "components/products/ProductDetailPage.tsx:101",
						children: [/* @__PURE__ */ jsxs(Button3D, {
							tone: "mint",
							onClick: () => goToContact(`Demo of ${item.name}`),
							children: [
								"Explore ",
								item.name,
								" ",
								/* @__PURE__ */ jsx(ArrowRight, { size: 16 })
							]
						}), /* @__PURE__ */ jsx(Button3D, {
							tone: "paper",
							onClick: () => goToContact(`Book a guided demo of ${item.name}`),
							children: "Book a guided demo"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsxs(Block, {
				id: "related",
				className: "pd-related",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					className: "pd-kicker",
					"data-reveal": true,
					cmsTag: "p",
					cmsSource: "components/products/ProductDetailPage.tsx:102",
					children: "Related products"
				}), /* @__PURE__ */ jsx(CmsElement, {
					className: "pd-rel-grid",
					"data-reveal": true,
					cmsTag: "div",
					cmsSource: "components/products/ProductDetailPage.tsx:103",
					children: d.related.map((r, i) => /* @__PURE__ */ jsxs(CmsElement, {
						href: productHref(r.id),
						className: "pd-rel",
						style: {
							"--i": i,
							"--accent": r.accent
						},
						cmsTag: "a",
						cmsSource: "components/products/ProductDetailPage.tsx:104",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								className: "pd-rel-mock",
								"data-cursor": "View",
								cmsTag: "div",
								cmsSource: "components/products/ProductDetailPage.tsx:105",
								children: /* @__PURE__ */ jsx(LiveMock, {
									m: r.mock,
									amount: .2
								})
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "small",
								cmsSource: "components/products/ProductDetailPage.tsx:106",
								children: categories.find((c) => c.id === r.cat)?.label
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/products/ProductDetailPage.tsx:107",
								children: [
									r.name,
									" ",
									/* @__PURE__ */ jsx(ArrowUpRight, {
										size: 16,
										"aria-hidden": true
									})
								]
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "p",
								cmsSource: "components/products/ProductDetailPage.tsx:108",
								children: r.blurb
							})
						]
					}, r.id))
				})]
			}),
			/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
		]
	});
}
// src/components/work/WorkPage.tsx
var COUNTRIES = new Set(offices.map((o) => o.country)).size;
var YEARS = (/* @__PURE__ */ new Date()).getFullYear() - FOUNDED;
var countOf = (f) => f === "All" ? allProjects.length : allProjects.filter((p) => p.category === f).length;
function WorkHero() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-hero work-hero",
		style: { "--intro": intro },
		cmsTag: "section",
		cmsSource: "components/work/WorkPage.tsx:1",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/work/WorkPage.tsx:2"
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--two",
				"data-parallax": "-0.1",
				cmsTag: "div",
				cmsSource: "components/work/WorkPage.tsx:3"
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-hero-inner",
				cmsTag: "div",
				cmsSource: "components/work/WorkPage.tsx:4",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/work/WorkPage.tsx:5",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/work/WorkPage.tsx:6"
						}), " Our work"]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						"aria-label": "Our work, live and in use.",
						cmsTag: "h1",
						cmsSource: "components/work/WorkPage.tsx:7",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/work/WorkPage.tsx:8",
							children: [
								/* @__PURE__ */ jsx(SplitWords, { text: "Our work," }),
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx(SplitWords, {
									text: "live and in use.",
									start: 2,
									em: true
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "about-lede",
						cmsTag: "p",
						cmsSource: "components/work/WorkPage.tsx:9",
						children: "A selection of websites, online stores, platforms, apps and games we have designed, built and launched for clients, from one-person startups to companies with thousands of staff."
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "metrics about-stats work-stats",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/work/WorkPage.tsx:10",
						children: [
							{
								label: "Projects delivered",
								value: `${stats[0].value}+`
							},
							{
								label: "Kinds of work",
								value: `${CATEGORIES.length}`
							},
							{
								label: "Countries where we work",
								value: `${COUNTRIES}`
							},
							{
								label: "Years of shipping",
								value: `${YEARS}`
							}
						].map((s, i) => /* @__PURE__ */ jsxs(CmsElement, {
							style: { "--stagger": i },
							cmsTag: "div",
							cmsSource: "components/work/WorkPage.tsx:11",
							children: [/* @__PURE__ */ jsx(CountUp, { value: s.value }), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/work/WorkPage.tsx:12",
								children: s.label
							})]
						}, s.label))
					})
				]
			})
		]
	});
}
function WorkCard({ p, index }) {
	const ref = useRef(null);
	const seen = useInView(ref, {
		once: true,
		amount: .15
	});
	return /* @__PURE__ */ jsxs(CmsElement, {
		ref,
		className: seen ? "work-card is-in" : "work-card",
		href: "/start",
		"data-cursor": "View",
		style: { "--stagger": index % 3 },
		"aria-label": `${p.name}: ${p.summary} Discuss a similar project.`,
		cmsTag: "a",
		cmsSource: "components/work/WorkPage.tsx:13",
		children: [/* @__PURE__ */ jsx(BrowserFrame, {
			url: p.url,
			children: /* @__PURE__ */ jsx(WorkVisual, { item: p })
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "work-card-meta",
			cmsTag: "div",
			cmsSource: "components/work/WorkPage.tsx:14",
			children: [
				/* @__PURE__ */ jsx(CmsElement, {
					className: "work-card-tags",
					cmsTag: "div",
					cmsSource: "components/work/WorkPage.tsx:15",
					children: p.tags.map((t) => /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/work/WorkPage.tsx:16",
						children: t
					}, t))
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h3",
					cmsSource: "components/work/WorkPage.tsx:17",
					children: p.name
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/work/WorkPage.tsx:18",
					children: p.summary
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "work-card-more",
					cmsTag: "span",
					cmsSource: "components/work/WorkPage.tsx:19",
					children: ["Start a similar project", /* @__PURE__ */ jsx(CmsElement, {
						"aria-hidden": "true",
						cmsTag: "i",
						cmsSource: "components/work/WorkPage.tsx:20",
						children: /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 15 })
					})]
				})
			]
		})]
	});
}
function NextCard({ index }) {
	const ref = useRef(null);
	const seen = useInView(ref, {
		once: true,
		amount: .15
	});
	return /* @__PURE__ */ jsxs(CmsElement, {
		ref,
		className: seen ? "work-card work-card--next is-in" : "work-card work-card--next",
		href: "/start",
		style: { "--stagger": index % 3 },
		cmsTag: "a",
		cmsSource: "components/work/WorkPage.tsx:21",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			className: "about-next",
			cmsTag: "div",
			cmsSource: "components/work/WorkPage.tsx:22",
			children: [
				/* @__PURE__ */ jsx(Sparkles$1, { size: 26 }),
				/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "strong",
					cmsSource: "components/work/WorkPage.tsx:23",
					children: ["Your project, ", /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "em",
						cmsSource: "components/work/WorkPage.tsx:24",
						children: "next."
					})]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "about-next-arrow",
					cmsTag: "span",
					cmsSource: "components/work/WorkPage.tsx:25",
					children: /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 20 })
				})
			]
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "work-card-meta",
			cmsTag: "div",
			cmsSource: "components/work/WorkPage.tsx:26",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "h3",
				cmsSource: "components/work/WorkPage.tsx:27",
				children: "Start a project"
			}), /* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "p",
				cmsSource: "components/work/WorkPage.tsx:28",
				children: "Tell us what you need and we'll reply within one business day."
			})]
		})]
	});
}
function Portfolio() {
	const [filter, setFilter] = useState("All");
	const items = filter === "All" ? allProjects : allProjects.filter((p) => p.category === filter);
	const filters = ["All", ...CATEGORIES];
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "section work-portfolio",
		id: "work",
		cmsTag: "section",
		cmsSource: "components/work/WorkPage.tsx:29",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "work-tabs",
				role: "group",
				"aria-label": "Filter projects by type",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/work/WorkPage.tsx:30",
				children: filters.map((f) => /* @__PURE__ */ jsxs(CmsElement, {
					className: "work-tab",
					"aria-pressed": filter === f,
					onClick: () => setFilter(f),
					cmsTag: "button",
					cmsSource: "components/work/WorkPage.tsx:31",
					children: [f, /* @__PURE__ */ jsx("sup", { children: countOf(f) })]
				}, f))
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "work-count",
				"aria-live": "polite",
				cmsTag: "p",
				cmsSource: "components/work/WorkPage.tsx:32",
				children: [
					"Showing ",
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "b",
						cmsSource: "components/work/WorkPage.tsx:33",
						children: items.length
					}),
					" ",
					items.length === 1 ? "project" : "projects",
					filter !== "All" && /* @__PURE__ */ jsxs(Fragment$1, { children: [
						" ",
						"in ",
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "em",
							cmsSource: "components/work/WorkPage.tsx:34",
							children: filter
						})
					] })
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "work-grid",
				cmsTag: "div",
				cmsSource: "components/work/WorkPage.tsx:35",
				children: [items.map((p, i) => /* @__PURE__ */ jsx(WorkCard, {
					p,
					index: i
				}, p.id)), /* @__PURE__ */ jsx(NextCard, { index: items.length })]
			}, filter)
		]
	});
}
function WorkPage() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(WorkHero, {}),
		/* @__PURE__ */ jsx(Portfolio, {}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/components/start/StartPage.tsx
var SCOPE = [
	{
		label: "AI Automations",
		Icon: Cpu
	},
	{
		label: "AI Agent Development",
		Icon: Bot
	},
	{
		label: "AI Model Integration",
		Icon: Workflow
	},
	{
		label: "Web Portals",
		Icon: MonitorSmartphone
	},
	{
		label: "Ecommerce",
		Icon: ShoppingCart
	},
	{
		label: "Mobile Apps",
		Icon: Smartphone
	},
	{
		label: "Game Development",
		Icon: Gamepad2
	},
	{
		label: "AR/VR",
		Icon: Glasses
	},
	{
		label: "Digital Marketing",
		Icon: Megaphone
	},
	{
		label: "Custom Development",
		Icon: Code2
	},
	{
		label: "Plugin Development",
		Icon: Puzzle
	},
	{
		label: "ERP Systems",
		Icon: Server
	},
	{
		label: "SaaS Product Development",
		Icon: Sparkles
	},
	{ label: "Not sure yet" }
];
var STAGE = [
	"Just an idea",
	"I have a brief or spec",
	"Existing product needs work",
	"Something is broken, urgently"
];
var BUDGET = [
	"Under $2,000",
	"$2,000 – $5,000",
	"$5,000 – $15,000",
	"$15,000 – $50,000",
	"$50,000+",
	"Not sure yet"
];
var TIMELINE = [
	"As soon as possible",
	"Within a month",
	"In 1 – 3 months",
	"Just exploring"
];
var STEPS$1 = [
	{
		id: "scope",
		pill: "Scope",
		row: "What",
		title: "What are we building?",
		hint: "Pick everything that applies."
	},
	{
		id: "stage",
		pill: "Stage",
		row: "Stage",
		title: "Where are you at?",
		hint: "Pick the one that fits best."
	},
	{
		id: "budget",
		pill: "Budget",
		row: "Budget",
		title: "What budget are you working with?",
		hint: "A rough range is fine. It helps us suggest the right approach."
	},
	{
		id: "timeline",
		pill: "Timeline",
		row: "Start",
		title: "When would you like to start?",
		hint: "Pick the one that fits best."
	},
	{
		id: "details",
		pill: "Details",
		row: "Details",
		title: "Anything we should know?",
		hint: "Optional. Links, goals, constraints, anything helpful."
	},
	{
		id: "contact",
		pill: "Contact",
		row: "Contact",
		title: "Where should we reply?",
		hint: "We answer within one business day."
	}
];
var EMPTY = {
	scope: [],
	stage: "",
	budget: "",
	timeline: "",
	details: "",
	name: "",
	email: "",
	phone: "",
	company: ""
};
var EMAIL_OK$1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var answered = (a) => [
	a.scope.length > 0,
	!!a.stage,
	!!a.budget,
	!!a.timeline,
	a.details.trim().length > 0,
	a.name.trim().length > 0 && EMAIL_OK$1.test(a.email.trim())
];
var summary = (a) => [
	a.scope.join(", "),
	a.stage,
	a.budget,
	a.timeline,
	a.details.trim(),
	a.name.trim() ? `${a.name.trim()}${a.email.trim() ? ` · ${a.email.trim()}` : ""}` : ""
];
function briefText(a) {
	return [
		`New project brief`,
		``,
		`Scope: ${a.scope.join(", ") || "-"}`,
		`Stage: ${a.stage || "-"}`,
		`Budget: ${a.budget || "-"}`,
		`Start: ${a.timeline || "-"}`,
		`Details: ${a.details.trim() || "-"}`,
		``,
		`Name: ${a.name.trim()}`,
		`Email: ${a.email.trim()}`,
		`Phone / WhatsApp: ${a.phone.trim() || "-"}`,
		`Company: ${a.company.trim() || "-"}`
	].join("\n");
}
function StartHero() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-hero start-hero",
		style: { "--intro": intro },
		cmsTag: "section",
		cmsSource: "components/start/StartPage.tsx:1",
		children: [/* @__PURE__ */ jsx(CmsElement, {
			className: "hero-blob hero-blob--one",
			"data-parallax": "0.14",
			cmsTag: "div",
			cmsSource: "components/start/StartPage.tsx:2"
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-hero-inner start-hero-inner",
			cmsTag: "div",
			cmsSource: "components/start/StartPage.tsx:3",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				"aria-label": "Start a project",
				cmsTag: "h1",
				cmsSource: "components/start/StartPage.tsx:4",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					"aria-hidden": "true",
					cmsTag: "span",
					cmsSource: "components/start/StartPage.tsx:5",
					children: [/* @__PURE__ */ jsx(SplitWords, { text: "Start a" }), /* @__PURE__ */ jsx(SplitWords, {
						text: "project",
						start: 2,
						em: true
					})]
				})
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "about-lede",
				cmsTag: "p",
				cmsSource: "components/start/StartPage.tsx:6",
				children: "Answer a few quick questions and we'll get back to you within one business day."
			})]
		})]
	});
}
function Option({ selected, onClick, multi, children }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		type: "button",
		className: selected ? "opt is-selected" : "opt",
		onClick,
		role: multi ? "checkbox" : "radio",
		"aria-checked": selected,
		cmsTag: "button",
		cmsSource: "components/start/StartPage.tsx:7",
		children: [children, /* @__PURE__ */ jsx(CmsElement, {
			"aria-hidden": "true",
			cmsTag: "i",
			cmsSource: "components/start/StartPage.tsx:8",
			children: selected && /* @__PURE__ */ jsx(Check, {
				size: 13,
				strokeWidth: 3
			})
		})]
	});
}
function Wizard() {
	const [a, setA] = useState(EMPTY);
	const [step, setStep] = useState(0);
	const [maxStep, setMaxStep] = useState(0);
	const [done, setDone] = useState(false);
	const [copied, setCopied] = useState(false);
	const [tried, setTried] = useState(false);
	const panel = useRef(null);
	const ok = useMemo(() => answered(a), [a]);
	const sum = useMemo(() => summary(a), [a]);
	const count = ok.filter(Boolean).length;
	const last = step === STEPS$1.length - 1;
	const canContinue = step === 4 ? true : ok[step];
	const set = (k, v) => setA((p) => ({
		...p,
		[k]: v
	}));
	const toggleScope = (label) => setA((p) => {
		if (label === "Not sure yet") return {
			...p,
			scope: p.scope.includes(label) ? [] : [label]
		};
		const rest = p.scope.filter((s) => s !== "Not sure yet");
		return {
			...p,
			scope: rest.includes(label) ? rest.filter((s) => s !== label) : [...rest, label]
		};
	});
	const go = (i) => {
		setStep(i);
		setMaxStep((m) => Math.max(m, i));
		setTried(false);
	};
	const next = () => {
		if (!canContinue) {
			setTried(true);
			return;
		}
		if (last) {
			setDone(true);
			window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`Project enquiry: ${a.scope.join(", ")}`)}&body=${encodeURIComponent(briefText(a))}`;
			return;
		}
		go(step + 1);
	};
	const onKey = (e) => {
		if (e.key !== "Enter" || e.shiftKey) return;
		if (e.target.tagName === "TEXTAREA") return;
		e.preventDefault();
		next();
	};
	useEffect(() => {
		if (step === 0 && !maxStep) return;
		if (window.innerWidth < 900) panel.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [step]);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(briefText(a));
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch {}
	};
	const S = STEPS$1[step];
	const emailBad = tried && step === 5 && !EMAIL_OK$1.test(a.email.trim());
	const nameBad = tried && step === 5 && !a.name.trim();
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "start",
		id: "start",
		cmsTag: "section",
		cmsSource: "components/start/StartPage.tsx:9",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			className: "start-grid",
			cmsTag: "div",
			cmsSource: "components/start/StartPage.tsx:10",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "brief",
				"aria-label": "Your brief",
				cmsTag: "aside",
				cmsSource: "components/start/StartPage.tsx:11",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "header",
						cmsSource: "components/start/StartPage.tsx:12",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "h2",
							cmsSource: "components/start/StartPage.tsx:13",
							children: "Your brief"
						}), /* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/start/StartPage.tsx:14",
							children: [
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "b",
									cmsSource: "components/start/StartPage.tsx:15",
									children: count
								}),
								" of ",
								STEPS$1.length,
								" answered"
							]
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "brief-bar",
						"aria-hidden": "true",
						cmsTag: "div",
						cmsSource: "components/start/StartPage.tsx:16",
						children: /* @__PURE__ */ jsx(CmsElement, {
							style: { transform: `scaleX(${count / STEPS$1.length})` },
							cmsTag: "i",
							cmsSource: "components/start/StartPage.tsx:17"
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "dl",
						cmsSource: "components/start/StartPage.tsx:18",
						children: STEPS$1.map((s, i) => /* @__PURE__ */ jsxs(CmsElement, {
							className: `${i === step && !done ? "is-current" : ""}${ok[i] ? " is-done" : ""}`,
							cmsTag: "div",
							cmsSource: "components/start/StartPage.tsx:19",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "dt",
								cmsSource: "components/start/StartPage.tsx:20",
								children: s.row
							}), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "dd",
								cmsSource: "components/start/StartPage.tsx:21",
								children: /* @__PURE__ */ jsx(CmsElement, {
									type: "button",
									onClick: () => i <= maxStep || ok[i - 1] ? go(i) : void 0,
									disabled: !(i <= maxStep || ok[i - 1]),
									cmsTag: "button",
									cmsSource: "components/start/StartPage.tsx:22",
									children: sum[i] ? /* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "span",
										cmsSource: "components/start/StartPage.tsx:23",
										children: sum[i]
									}, sum[i]) : /* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "em",
										cmsSource: "components/start/StartPage.tsx:24",
										children: "Not answered yet"
									})
								})
							})]
						}, s.id))
					})
				]
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "wizard",
				ref: panel,
				onKeyDown: onKey,
				cmsTag: "div",
				cmsSource: "components/start/StartPage.tsx:25",
				children: done ? /* @__PURE__ */ jsxs(CmsElement, {
					className: "start-done",
					role: "status",
					cmsTag: "div",
					cmsSource: "components/start/StartPage.tsx:26",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							className: "start-done-badge",
							cmsTag: "span",
							cmsSource: "components/start/StartPage.tsx:27",
							children: /* @__PURE__ */ jsx(Check, {
								size: 34,
								strokeWidth: 3
							})
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "h2",
							cmsSource: "components/start/StartPage.tsx:28",
							children: [
								"Thanks",
								a.name.trim() ? `, ${a.name.trim().split(" ")[0]}` : "",
								". ",
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "em",
									cmsSource: "components/start/StartPage.tsx:29",
									children: "Brief ready."
								})
							]
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/start/StartPage.tsx:30",
							children: [
								"Your email app should have opened with your brief filled in. Press send and we'll reply within one business day. If nothing opened, copy it and email ",
								/* @__PURE__ */ jsx(CmsElement, {
									href: `mailto:${contactInfo.email}`,
									cmsTag: "a",
									cmsSource: "components/start/StartPage.tsx:31",
									children: contactInfo.email
								}),
								"."
							]
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "start-done-actions",
							cmsTag: "div",
							cmsSource: "components/start/StartPage.tsx:32",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								type: "button",
								className: "button-3d button-3d--mint",
								onClick: copy,
								cmsTag: "button",
								cmsSource: "components/start/StartPage.tsx:33",
								children: copied ? /* @__PURE__ */ jsxs(Fragment$1, { children: ["Copied ", /* @__PURE__ */ jsx(Check, { size: 16 })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: ["Copy my brief ", /* @__PURE__ */ jsx(Copy, { size: 16 })] })
							}), /* @__PURE__ */ jsx(CmsElement, {
								type: "button",
								className: "text-link",
								onClick: () => {
									setDone(false);
									setStep(0);
								},
								cmsTag: "button",
								cmsSource: "components/start/StartPage.tsx:34",
								children: "Edit my answers"
							})]
						}),
						/* @__PURE__ */ jsx(Sparkles$1, {
							className: "start-done-spark",
							size: 28
						})
					]
				}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx(CmsElement, {
						className: "steps",
						"aria-label": "Steps",
						cmsTag: "ol",
						cmsSource: "components/start/StartPage.tsx:35",
						children: STEPS$1.map((s, i) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/start/StartPage.tsx:36",
							children: /* @__PURE__ */ jsxs(CmsElement, {
								type: "button",
								className: `step-pill${i === step ? " is-current" : ""}${i < step || ok[i] ? " is-done" : ""}`,
								"aria-current": i === step ? "step" : void 0,
								disabled: i > maxStep && !ok[i - 1],
								onClick: () => go(i),
								cmsTag: "button",
								cmsSource: "components/start/StartPage.tsx:37",
								children: [
									/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "b",
										cmsSource: "components/start/StartPage.tsx:38",
										children: i + 1
									}),
									" ",
									s.pill
								]
							})
						}, s.id))
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "question",
						cmsTag: "div",
						cmsSource: "components/start/StartPage.tsx:39",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h2",
								cmsSource: "components/start/StartPage.tsx:40",
								children: S.title
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								className: "question-hint",
								cmsTag: "p",
								cmsSource: "components/start/StartPage.tsx:41",
								children: S.hint
							}),
							step === 0 && /* @__PURE__ */ jsx(CmsElement, {
								className: "opts",
								role: "group",
								"aria-label": S.title,
								cmsTag: "div",
								cmsSource: "components/start/StartPage.tsx:42",
								children: SCOPE.map(({ label, Icon }, i) => /* @__PURE__ */ jsx(CmsElement, {
									style: { "--i": i },
									cmsTag: "div",
									cmsSource: "components/start/StartPage.tsx:43",
									children: /* @__PURE__ */ jsxs(Option, {
										selected: a.scope.includes(label),
										onClick: () => toggleScope(label),
										multi: true,
										children: [Icon ? /* @__PURE__ */ jsx(Icon, {
											size: 18,
											"aria-hidden": true
										}) : /* @__PURE__ */ jsx(CmsElement, {
											className: "opt-q",
											cmsTag: "span",
											cmsSource: "components/start/StartPage.tsx:44",
											children: "?"
										}), /* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "span",
											cmsSource: "components/start/StartPage.tsx:45",
											children: label
										})]
									})
								}, label))
							}),
							step >= 1 && step <= 3 && /* @__PURE__ */ jsx(CmsElement, {
								className: "opts opts--2",
								role: "radiogroup",
								"aria-label": S.title,
								cmsTag: "div",
								cmsSource: "components/start/StartPage.tsx:46",
								children: (step === 1 ? STAGE : step === 2 ? BUDGET : TIMELINE).map((label, i) => {
									const key = step === 1 ? "stage" : step === 2 ? "budget" : "timeline";
									return /* @__PURE__ */ jsx(CmsElement, {
										style: { "--i": i },
										cmsTag: "div",
										cmsSource: "components/start/StartPage.tsx:47",
										children: /* @__PURE__ */ jsx(Option, {
											selected: a[key] === label,
											onClick: () => set(key, label),
											children: /* @__PURE__ */ jsx(CmsElement, {
												cmsTag: "span",
												cmsSource: "components/start/StartPage.tsx:48",
												children: label
											})
										})
									}, label);
								})
							}),
							step === 4 && /* @__PURE__ */ jsxs(CmsElement, {
								className: "field",
								cmsTag: "label",
								cmsSource: "components/start/StartPage.tsx:49",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									className: "sr-only",
									cmsTag: "span",
									cmsSource: "components/start/StartPage.tsx:50",
									children: "Project details"
								}), /* @__PURE__ */ jsx(CmsElement, {
									rows: 6,
									value: a.details,
									onChange: (e) => set("details", e.target.value),
									placeholder: "What are you trying to achieve? Any links, competitors or deadlines?",
									autoFocus: true,
									cmsTag: "textarea",
									cmsSource: "components/start/StartPage.tsx:51"
								})]
							}),
							step === 5 && /* @__PURE__ */ jsxs(CmsElement, {
								className: "fields",
								cmsTag: "div",
								cmsSource: "components/start/StartPage.tsx:52",
								children: [
									/* @__PURE__ */ jsxs(CmsElement, {
										className: nameBad ? "field has-error" : "field",
										cmsTag: "label",
										cmsSource: "components/start/StartPage.tsx:53",
										children: [
											/* @__PURE__ */ jsx(CmsElement, {
												cmsTag: "span",
												cmsSource: "components/start/StartPage.tsx:54",
												children: "Your name"
											}),
											/* @__PURE__ */ jsx(CmsElement, {
												value: a.name,
												onChange: (e) => set("name", e.target.value),
												autoComplete: "name",
												autoFocus: true,
												cmsTag: "input",
												cmsSource: "components/start/StartPage.tsx:55"
											}),
											nameBad && /* @__PURE__ */ jsx(CmsElement, {
												cmsTag: "small",
												cmsSource: "components/start/StartPage.tsx:56",
												children: "Please tell us your name."
											})
										]
									}),
									/* @__PURE__ */ jsxs(CmsElement, {
										className: emailBad ? "field has-error" : "field",
										cmsTag: "label",
										cmsSource: "components/start/StartPage.tsx:57",
										children: [
											/* @__PURE__ */ jsx(CmsElement, {
												cmsTag: "span",
												cmsSource: "components/start/StartPage.tsx:58",
												children: "Email"
											}),
											/* @__PURE__ */ jsx(CmsElement, {
												type: "email",
												value: a.email,
												onChange: (e) => set("email", e.target.value),
												autoComplete: "email",
												cmsTag: "input",
												cmsSource: "components/start/StartPage.tsx:59"
											}),
											emailBad && /* @__PURE__ */ jsx(CmsElement, {
												cmsTag: "small",
												cmsSource: "components/start/StartPage.tsx:60",
												children: "Please enter a valid email."
											})
										]
									}),
									/* @__PURE__ */ jsxs(CmsElement, {
										className: "field",
										cmsTag: "label",
										cmsSource: "components/start/StartPage.tsx:61",
										children: [/* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "span",
											cmsSource: "components/start/StartPage.tsx:62",
											children: "Phone / WhatsApp (optional)"
										}), /* @__PURE__ */ jsx(CmsElement, {
											value: a.phone,
											onChange: (e) => set("phone", e.target.value),
											autoComplete: "tel",
											cmsTag: "input",
											cmsSource: "components/start/StartPage.tsx:63"
										})]
									}),
									/* @__PURE__ */ jsxs(CmsElement, {
										className: "field",
										cmsTag: "label",
										cmsSource: "components/start/StartPage.tsx:64",
										children: [/* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "span",
											cmsSource: "components/start/StartPage.tsx:65",
											children: "Company (optional)"
										}), /* @__PURE__ */ jsx(CmsElement, {
											value: a.company,
											onChange: (e) => set("company", e.target.value),
											autoComplete: "organization",
											cmsTag: "input",
											cmsSource: "components/start/StartPage.tsx:66"
										})]
									})
								]
							})
						]
					}, S.id),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "wizard-actions",
						cmsTag: "div",
						cmsSource: "components/start/StartPage.tsx:67",
						children: [
							step > 0 && /* @__PURE__ */ jsx(CmsElement, {
								type: "button",
								className: "wizard-back",
								onClick: () => go(step - 1),
								"aria-label": "Back",
								cmsTag: "button",
								cmsSource: "components/start/StartPage.tsx:68",
								children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18 })
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								type: "button",
								className: canContinue ? "button-3d button-3d--mint" : "button-3d button-3d--mint is-disabled",
								onClick: next,
								"aria-disabled": !canContinue,
								cmsTag: "button",
								cmsSource: "components/start/StartPage.tsx:69",
								children: [last ? "Send my brief" : step === 4 && !a.details.trim() ? "Skip" : "Continue", /* @__PURE__ */ jsx("kbd", {
									"aria-hidden": "true",
									children: /* @__PURE__ */ jsx(CornerDownLeft, { size: 12 })
								})]
							}),
							tried && !canContinue && /* @__PURE__ */ jsx(CmsElement, {
								className: "wizard-warn",
								cmsTag: "span",
								cmsSource: "components/start/StartPage.tsx:70",
								children: step === 5 ? "Add your name and a valid email to send." : "Pick an answer to continue."
							})
						]
					})
				] })
			})]
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "start-foot",
			cmsTag: "p",
			cmsSource: "components/start/StartPage.tsx:71",
			children: [
				/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/start/StartPage.tsx:72",
					children: ["Prefer email? ", /* @__PURE__ */ jsx(CmsElement, {
						href: `mailto:${contactInfo.email}`,
						cmsTag: "a",
						cmsSource: "components/start/StartPage.tsx:73",
						children: contactInfo.email
					})]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					"aria-hidden": "true",
					cmsTag: "i",
					cmsSource: "components/start/StartPage.tsx:74",
					children: "·"
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/start/StartPage.tsx:75",
					children: [
						"Rather pick from a menu?",
						" ",
						/* @__PURE__ */ jsxs(CmsElement, {
							href: "/services#proposal",
							cmsTag: "a",
							cmsSource: "components/start/StartPage.tsx:76",
							children: ["Prepare your own proposal ", /* @__PURE__ */ jsx(ArrowRight$1, { size: 13 })]
						})
					]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					"aria-hidden": "true",
					cmsTag: "i",
					cmsSource: "components/start/StartPage.tsx:77",
					children: "·"
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/start/StartPage.tsx:78",
					children: offices.map((o) => o.city).join(" / ")
				})
			]
		})]
	});
}
function StartPage() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(StartHero, {}),
		/* @__PURE__ */ jsx(Wizard, {}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/components/urgent/UrgentPage.tsx
var TECH = [
	{
		Icon: Server,
		title: "Site or app is down",
		text: "Outages, server errors, failed deployments and expired domains or SSL.",
		scope: "Tech"
	},
	{
		Icon: ShieldAlert,
		title: "Hacked or infected site",
		text: "Malware, spam injections, defacement and suspicious admin accounts.",
		scope: "Tech"
	},
	{
		Icon: Smartphone,
		title: "App crashing or rejected",
		text: "Crash loops after an update, broken builds, App Store or Play rejections.",
		scope: "Tech"
	},
	{
		Icon: CreditCard,
		title: "Checkout or payments failing",
		text: "Orders not going through, payment gateway errors, broken carts.",
		scope: "Tech"
	},
	{
		Icon: Gauge,
		title: "Slow or unstable system",
		text: "Pages timing out, database overload, an ERP or portal that can't keep up.",
		scope: "Tech"
	},
	{
		Icon: Ghost,
		title: "Stalled project or missing vendor",
		text: "Your developer disappeared, the code is a mystery, the deadline isn't.",
		scope: "Tech"
	}
];
var MARKETING = [
	{
		Icon: Ban,
		title: "Ad account suspended",
		text: "Meta or Google ads disabled, rejected campaigns, policy flags.",
		scope: "Marketing"
	},
	{
		Icon: TrendingDown,
		title: "Traffic or sales dropped",
		text: "Sudden ranking loss, a broken funnel or campaigns that stopped converting.",
		scope: "Marketing"
	},
	{
		Icon: Lock,
		title: "Social account locked or hacked",
		text: "Lost access to pages, profiles or business manager.",
		scope: "Marketing"
	},
	{
		Icon: Flame,
		title: "Reputation under fire",
		text: "A wave of bad reviews or a post that went the wrong kind of viral.",
		scope: "Marketing"
	},
	{
		Icon: TriangleAlert,
		title: "Launch going wrong",
		text: "A product or campaign launch that isn't landing, with no time to start over.",
		scope: "Marketing"
	}
];
var TECH_TONES = [
	"pink",
	"blue",
	"lilac",
	"yellow",
	"mint",
	"pink"
];
var MARKETING_TONES = [
	"yellow",
	"mint",
	"lilac",
	"pink",
	"blue"
];
var LADDER = [
	{
		t: "Triage",
		s: "We find out what's wrong",
		tone: "coral"
	},
	{
		t: "Stabilise",
		s: "Stop the damage",
		tone: "yellow"
	},
	{
		t: "Fix",
		s: "Repair the root cause",
		tone: "mint"
	},
	{
		t: "Prevent",
		s: "Make sure it stays fixed",
		tone: "lilac"
	}
];
var STEPS = [
	{
		n: "01",
		t: "Triage",
		p: "Tell us what's wrong. We look at it first and tell you honestly how serious it is."
	},
	{
		n: "02",
		t: "Stabilise",
		p: "Stop the damage: restore service, secure accounts, pause what's bleeding money."
	},
	{
		n: "03",
		t: "Fix",
		p: "Find the root cause and repair it properly, not with tape."
	},
	{
		n: "04",
		t: "Prevent",
		p: "Monitoring, backups, access hygiene and a plan so it doesn't happen again."
	}
];
var SCOPES = [
	"Tech",
	"Marketing",
	"Both / not sure"
];
var URGENCY = [
	{
		label: "It's down right now",
		tone: "coral"
	},
	{
		label: "Hurting the business",
		tone: "yellow"
	},
	{
		label: "Needs attention soon",
		tone: "mint"
	}
];
var PLACEHOLDERS = [
	"Our checkout stopped taking payments this morning after a plugin update…",
	"Our Meta ad account was disabled and every campaign has stopped…",
	"The site is showing spam pages and Google says it's unsafe…",
	"Our app crashes on launch since the last release…"
];
var CODES = [
	{
		code: "+91",
		label: "IN +91"
	},
	{
		code: "+1",
		label: "US +1"
	},
	{
		code: "+44",
		label: "UK +44"
	},
	{
		code: "+971",
		label: "AE +971"
	},
	{
		code: "+966",
		label: "SA +966"
	},
	{
		code: "+92",
		label: "PK +92"
	}
];
function guessCode() {
	try {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (tz.startsWith("America/")) return "+1";
		if (tz === "Europe/London") return "+44";
		if (tz === "Asia/Dubai") return "+971";
		if (tz === "Asia/Riyadh") return "+966";
		if (tz === "Asia/Karachi") return "+92";
		if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "+91";
	} catch {}
	return "+91";
}
var EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var scrollToRequest = () => document.getElementById("request")?.scrollIntoView({
	behavior: "smooth",
	block: "start"
});
function Ladder() {
	const [i, setI] = useState(0);
	const [hold, setHold] = useState(false);
	useEffect(() => {
		if (hold || prefersReducedMotion()) return;
		const id = setInterval(() => setI((n) => (n + 1) % LADDER.length), 2300);
		return () => clearInterval(id);
	}, [hold]);
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "ladder",
		"aria-label": "How a rescue unfolds",
		"data-tilt": true,
		onMouseEnter: () => setHold(true),
		onMouseLeave: () => setHold(false),
		onFocus: () => setHold(true),
		onBlur: () => setHold(false),
		style: { "--p": i / (LADDER.length - 1) },
		cmsTag: "aside",
		cmsSource: "components/urgent/UrgentPage.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "ladder-sticker",
				"data-parallax": "0.06",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:2",
				children: [/* @__PURE__ */ jsx(Siren, {
					size: 16,
					"aria-hidden": true
				}), " Breathe. We've got this."]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "ladder-head",
				cmsTag: "header",
				cmsSource: "components/urgent/UrgentPage.tsx:3",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:4",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						"aria-hidden": "true",
						cmsTag: "i",
						cmsSource: "components/urgent/UrgentPage.tsx:5"
					}), " Rescue plan"]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					"aria-hidden": "true",
					cmsTag: "b",
					cmsSource: "components/urgent/UrgentPage.tsx:6",
					children: [
						"0",
						i + 1,
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "small",
							cmsSource: "components/urgent/UrgentPage.tsx:7",
							children: "/04"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "ladder-body",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:8",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					className: "ladder-rail",
					"aria-hidden": "true",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:9",
					children: /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/urgent/UrgentPage.tsx:10"
					})
				}), /* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ol",
					cmsSource: "components/urgent/UrgentPage.tsx:11",
					children: LADDER.map((s, n) => /* @__PURE__ */ jsxs(CmsElement, {
						className: `${n === i ? "is-active" : ""}${n < i ? " is-past" : ""}`,
						style: { "--tone": `var(--${s.tone})` },
						cmsTag: "li",
						cmsSource: "components/urgent/UrgentPage.tsx:12",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							className: "ladder-node",
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/urgent/UrgentPage.tsx:13"
						}), /* @__PURE__ */ jsxs(CmsElement, {
							type: "button",
							"aria-current": n === i ? "step" : void 0,
							onClick: () => setI(n),
							cmsTag: "button",
							cmsSource: "components/urgent/UrgentPage.tsx:14",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "b",
								cmsSource: "components/urgent/UrgentPage.tsx:15",
								children: s.t
							}), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "small",
								cmsSource: "components/urgent/UrgentPage.tsx:16",
								children: s.s
							})]
						})]
					}, s.t))
				})]
			})
		]
	});
}
function UrgentHero() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-hero urgent-hero",
		style: { "--intro": intro },
		cmsTag: "section",
		cmsSource: "components/urgent/UrgentPage.tsx:17",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:18"
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--two",
				"data-parallax": "-0.1",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:19"
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-hero-inner urgent-hero-inner",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:20",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "urgent-hero-copy",
					cmsTag: "div",
					cmsSource: "components/urgent/UrgentPage.tsx:21",
					children: [
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "eyebrow",
							cmsTag: "p",
							cmsSource: "components/urgent/UrgentPage.tsx:22",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/urgent/UrgentPage.tsx:23"
							}), " Crisis support · tech and marketing"]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							"aria-label": "Need rapid response for your tech or marketing?",
							cmsTag: "h1",
							cmsSource: "components/urgent/UrgentPage.tsx:24",
							children: /* @__PURE__ */ jsxs(CmsElement, {
								"aria-hidden": "true",
								cmsTag: "span",
								cmsSource: "components/urgent/UrgentPage.tsx:25",
								children: [
									/* @__PURE__ */ jsx(SplitWords, { text: "Need rapid" }),
									/* @__PURE__ */ jsx("br", {}),
									/* @__PURE__ */ jsx(SplitWords, {
										text: "response for",
										start: 2
									}),
									/* @__PURE__ */ jsx("br", {}),
									/* @__PURE__ */ jsx(SplitWords, {
										text: "your tech or",
										start: 5
									}),
									/* @__PURE__ */ jsx("br", {}),
									/* @__PURE__ */ jsx(SplitWords, {
										text: "marketing?",
										start: 8,
										em: true
									})
								]
							})
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "about-lede",
							cmsTag: "p",
							cmsSource: "components/urgent/UrgentPage.tsx:26",
							children: "Facing an issue with your website, app, systems or marketing? Consult us. We'll help you stop the damage, fix the cause and get back to business."
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "urgent-actions",
							cmsTag: "div",
							cmsSource: "components/urgent/UrgentPage.tsx:27",
							children: [/* @__PURE__ */ jsxs(CmsElement, {
								className: "button-3d button-3d--coral",
								href: "#request",
								cmsTag: "a",
								cmsSource: "components/urgent/UrgentPage.tsx:28",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									className: "btn-dot",
									"aria-hidden": "true",
									cmsTag: "i",
									cmsSource: "components/urgent/UrgentPage.tsx:29"
								}), " RAPID RESPONSE"]
							}), /* @__PURE__ */ jsxs(CmsElement, {
								className: "button-3d button-3d--paper",
								href: contactInfo.whatsapp,
								target: "_blank",
								rel: "noopener noreferrer",
								cmsTag: "a",
								cmsSource: "components/urgent/UrgentPage.tsx:30",
								children: [/* @__PURE__ */ jsx(MessageCircle, {
									size: 17,
									"aria-hidden": true
								}), " WhatsApp us"]
							})]
						})
					]
				}), /* @__PURE__ */ jsx(Ladder, {})]
			})
		]
	});
}
function ProblemGrid({ items, tones, onPick, extra }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "prob-grid rv-stagger",
		"data-reveal": true,
		cmsTag: "div",
		cmsSource: "components/urgent/UrgentPage.tsx:31",
		children: [items.map((p, index) => /* @__PURE__ */ jsxs(CmsElement, {
			type: "button",
			className: `prob prob--${tones[index % tones.length]}`,
			style: { "--stagger": index },
			onClick: () => onPick(p),
			"data-tilt": true,
			"data-cursor": "Help",
			cmsTag: "button",
			cmsSource: "components/urgent/UrgentPage.tsx:32",
			children: [
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "prob-top",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:33",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "icon-bubble",
						cmsTag: "span",
						cmsSource: "components/urgent/UrgentPage.tsx:34",
						children: /* @__PURE__ */ jsx(p.Icon, {
							size: 20,
							"aria-hidden": true
						})
					}), /* @__PURE__ */ jsx(CmsElement, {
						"aria-hidden": "true",
						cmsTag: "small",
						cmsSource: "components/urgent/UrgentPage.tsx:35",
						children: String(index + 1).padStart(2, "0")
					})]
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "prob-text",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:36",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "strong",
						cmsSource: "components/urgent/UrgentPage.tsx:37",
						children: p.title
					}), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/urgent/UrgentPage.tsx:38",
						children: p.text
					})]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "card-arrow",
					"aria-hidden": "true",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:39",
					children: /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 18 })
				})
			]
		}, p.title)), extra && /* @__PURE__ */ jsxs(CmsElement, {
			type: "button",
			className: "prob prob--else",
			style: { "--stagger": items.length },
			onClick: () => onPick({
				Icon: Plus,
				title: "Something else",
				text: "",
				scope: "Both / not sure"
			}),
			"data-tilt": true,
			"data-cursor": "Tell us",
			cmsTag: "button",
			cmsSource: "components/urgent/UrgentPage.tsx:40",
			children: [
				/* @__PURE__ */ jsx(CmsElement, {
					className: "prob-top",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:41",
					children: /* @__PURE__ */ jsx(CmsElement, {
						className: "icon-bubble",
						cmsTag: "span",
						cmsSource: "components/urgent/UrgentPage.tsx:42",
						children: /* @__PURE__ */ jsx(Plus, {
							size: 20,
							"aria-hidden": true
						})
					})
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "prob-text",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:43",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "strong",
						cmsSource: "components/urgent/UrgentPage.tsx:44",
						children: ["Not on the list? ", /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "em",
							cmsSource: "components/urgent/UrgentPage.tsx:45",
							children: "Tell us."
						})]
					}), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/urgent/UrgentPage.tsx:46",
						children: "If it's urgent and it's tech or marketing, it's ours to fix."
					})]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "card-arrow",
					"aria-hidden": "true",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:47",
					children: /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 18 })
				})
			]
		})]
	});
}
function Problems({ onPick }) {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(WaveDivider, {
			from: "#faf8f1",
			to: "#fffef9"
		}),
		/* @__PURE__ */ jsxs(CmsElement, {
			className: "section prob-band",
			id: "problems",
			cmsTag: "section",
			cmsSource: "components/urgent/UrgentPage.tsx:48",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "prob-block",
				id: "tech-problems",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:49",
				children: [/* @__PURE__ */ jsx(SectionHeading, {
					eyebrow: "Tech",
					title: "Tech",
					em: "problems.",
					copy: "Websites, apps, servers, ERPs and the code nobody wants to touch."
				}), /* @__PURE__ */ jsx(ProblemGrid, {
					items: TECH,
					tones: TECH_TONES,
					onPick
				})]
			}), /* @__PURE__ */ jsxs(CmsElement, {
				className: "prob-block",
				id: "marketing-problems",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:50",
				children: [/* @__PURE__ */ jsx(SectionHeading, {
					eyebrow: "Marketing",
					title: "Marketing",
					em: "problems.",
					copy: "Ads, search, social and reputation, back under control."
				}), /* @__PURE__ */ jsx(ProblemGrid, {
					items: MARKETING,
					tones: MARKETING_TONES,
					onPick,
					extra: true
				})]
			})]
		}),
		/* @__PURE__ */ jsx(WaveDivider, {
			from: "#fffef9",
			to: "#faf8f1"
		})
	] });
}
function HowWeHelp() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "section urgent-how",
		id: "how-we-help",
		cmsTag: "section",
		cmsSource: "components/urgent/UrgentPage.tsx:51",
		children: [/* @__PURE__ */ jsx(SectionHeading, {
			eyebrow: "How we help",
			title: "How we",
			em: "help.",
			copy: "Four steps, in this order, so the panic comes down before the invoice goes up."
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "process-steps urgent-steps",
			"data-reveal": true,
			cmsTag: "div",
			cmsSource: "components/urgent/UrgentPage.tsx:52",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				className: "urgent-runner",
				"aria-hidden": "true",
				cmsTag: "span",
				cmsSource: "components/urgent/UrgentPage.tsx:53"
			}), STEPS.map(({ n, t, p }, index) => /* @__PURE__ */ jsxs(CmsElement, {
				style: { "--stagger": index },
				cmsTag: "article",
				cmsSource: "components/urgent/UrgentPage.tsx:54",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/urgent/UrgentPage.tsx:55",
						children: n
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "h3",
						cmsSource: "components/urgent/UrgentPage.tsx:56",
						children: t
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/urgent/UrgentPage.tsx:57",
						children: p
					})
				]
			}, t))]
		})]
	});
}
function Chip({ on, tone = "ink", onClick, children }) {
	return /* @__PURE__ */ jsx(CmsElement, {
		type: "button",
		role: "radio",
		"aria-checked": on,
		className: `chip chip--${tone}${on ? " is-on" : ""}`,
		onClick,
		cmsTag: "button",
		cmsSource: "components/urgent/UrgentPage.tsx:58",
		children
	});
}
function RequestForm({ prefill }) {
	const [scope, setScope] = useState("Tech");
	const [urgency, setUrgency] = useState(URGENCY[0].label);
	const [msg, setMsg] = useState("");
	const [name, setName] = useState("");
	const [code, setCode] = useState(guessCode);
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [company, setCompany] = useState("");
	const [tried, setTried] = useState(false);
	const [done, setDone] = useState(false);
	const [copied, setCopied] = useState(false);
	const [typing, setTyping] = useState(true);
	const area = useRef(null);
	const lastPrefill = useRef("");
	const placeholder = useTypedText(PLACEHOLDERS, typing && !msg);
	useEffect(() => {
		if (!prefill.n) return;
		setScope(prefill.scope);
		setDone(false);
		if (prefill.issue) {
			const prev = lastPrefill.current;
			const next = `${prefill.issue}: `;
			setMsg((m) => !m.trim() || m === prev ? next : m);
			lastPrefill.current = next;
		}
		const id = window.setTimeout(() => {
			const el = area.current;
			if (!el) return;
			el.focus({ preventScroll: true });
			el.setSelectionRange(el.value.length, el.value.length);
		}, 700);
		return () => window.clearTimeout(id);
	}, [prefill.n]);
	const bad = useMemo(() => ({
		msg: msg.trim().length < 5,
		name: !name.trim(),
		phone: phone.replace(/\D/g, "").length < 6,
		email: !EMAIL_OK.test(email.trim())
	}), [
		msg,
		name,
		phone,
		email
	]);
	const invalid = bad.msg || bad.name || bad.phone || bad.email;
	const text = () => [
		`URGENT REQUEST (${urgency})`,
		``,
		`Problem area: ${scope}`,
		`What's happening: ${msg.trim()}`,
		``,
		`Name: ${name.trim()}`,
		`Call back: ${code} ${phone.trim()}`,
		`Email: ${email.trim()}`,
		`Company / website: ${company.trim() || "-"}`
	].join("\n");
	const submit = (e) => {
		e.preventDefault();
		setTried(true);
		if (invalid) return;
		setDone(true);
		window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`URGENT: ${scope} (${urgency})`)}&body=${encodeURIComponent(text())}`;
	};
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text());
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch {}
	};
	const err = (k) => tried && bad[k] ? "field has-error" : "field";
	if (done) return /* @__PURE__ */ jsxs(CmsElement, {
		className: "request-done",
		role: "status",
		cmsTag: "div",
		cmsSource: "components/urgent/UrgentPage.tsx:59",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "start-done-badge",
				cmsTag: "span",
				cmsSource: "components/urgent/UrgentPage.tsx:60",
				children: /* @__PURE__ */ jsx(Check, {
					size: 34,
					strokeWidth: 3
				})
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "h3",
				cmsSource: "components/urgent/UrgentPage.tsx:61",
				children: [
					"Thanks",
					name.trim() ? `, ${name.trim().split(" ")[0]}` : "",
					". ",
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "em",
						cmsSource: "components/urgent/UrgentPage.tsx:62",
						children: "Request ready."
					})
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "p",
				cmsSource: "components/urgent/UrgentPage.tsx:63",
				children: [
					"Your email app should have opened with your urgent request filled in. Press send and we'll pick it up. For the fastest reply, message us on WhatsApp too. If nothing opened, copy it and email ",
					/* @__PURE__ */ jsx(CmsElement, {
						href: `mailto:${contactInfo.email}`,
						cmsTag: "a",
						cmsSource: "components/urgent/UrgentPage.tsx:64",
						children: contactInfo.email
					}),
					"."
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "start-done-actions",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:65",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "button-3d button-3d--coral",
						href: `${contactInfo.whatsapp}?text=${encodeURIComponent(text())}`,
						target: "_blank",
						rel: "noopener noreferrer",
						cmsTag: "a",
						cmsSource: "components/urgent/UrgentPage.tsx:66",
						children: [/* @__PURE__ */ jsx(MessageCircle, {
							size: 17,
							"aria-hidden": true
						}), " Send on WhatsApp"]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						className: "button-3d button-3d--paper",
						onClick: copy,
						cmsTag: "button",
						cmsSource: "components/urgent/UrgentPage.tsx:67",
						children: copied ? /* @__PURE__ */ jsxs(Fragment$1, { children: ["Copied ", /* @__PURE__ */ jsx(Check, { size: 16 })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: ["Copy request ", /* @__PURE__ */ jsx(Copy, { size: 16 })] })
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						className: "text-link",
						onClick: () => setDone(false),
						cmsTag: "button",
						cmsSource: "components/urgent/UrgentPage.tsx:68",
						children: "Edit my answers"
					})
				]
			}),
			/* @__PURE__ */ jsx(Sparkles$1, {
				className: "start-done-spark",
				size: 28
			})
		]
	});
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "request-form",
		onSubmit: submit,
		noValidate: true,
		cmsTag: "form",
		cmsSource: "components/urgent/UrgentPage.tsx:69",
		children: [
			/* @__PURE__ */ jsxs("fieldset", { children: [/* @__PURE__ */ jsx("legend", { children: "Where's the problem?" }), /* @__PURE__ */ jsx(CmsElement, {
				className: "chips",
				role: "radiogroup",
				"aria-label": "Where's the problem?",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:70",
				children: SCOPES.map((s) => /* @__PURE__ */ jsx(Chip, {
					on: scope === s,
					onClick: () => setScope(s),
					children: s
				}, s))
			})] }),
			/* @__PURE__ */ jsxs("fieldset", { children: [/* @__PURE__ */ jsx("legend", { children: "How urgent?" }), /* @__PURE__ */ jsx(CmsElement, {
				className: "chips",
				role: "radiogroup",
				"aria-label": "How urgent?",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:71",
				children: URGENCY.map((u) => /* @__PURE__ */ jsx(Chip, {
					on: urgency === u.label,
					tone: u.tone,
					onClick: () => setUrgency(u.label),
					children: u.label
				}, u.label))
			})] }),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: err("msg"),
				cmsTag: "label",
				cmsSource: "components/urgent/UrgentPage.tsx:72",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/urgent/UrgentPage.tsx:73",
						children: "What's happening? *"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						ref: area,
						rows: 4,
						value: msg,
						onChange: (e) => setMsg(e.target.value),
						onFocus: () => setTyping(false),
						onBlur: () => setTyping(true),
						placeholder: placeholder || "\xA0",
						cmsTag: "textarea",
						cmsSource: "components/urgent/UrgentPage.tsx:74"
					}),
					tried && bad.msg && /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "small",
						cmsSource: "components/urgent/UrgentPage.tsx:75",
						children: "Tell us a little about what's going wrong."
					})
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "fields",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:76",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: err("name"),
						cmsTag: "label",
						cmsSource: "components/urgent/UrgentPage.tsx:77",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/urgent/UrgentPage.tsx:78",
								children: "Your name *"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								value: name,
								onChange: (e) => setName(e.target.value),
								autoComplete: "name",
								cmsTag: "input",
								cmsSource: "components/urgent/UrgentPage.tsx:79"
							}),
							tried && bad.name && /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "small",
								cmsSource: "components/urgent/UrgentPage.tsx:80",
								children: "Please tell us your name."
							})
						]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: err("phone"),
						cmsTag: "div",
						cmsSource: "components/urgent/UrgentPage.tsx:81",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								className: "field-label",
								htmlFor: "urgent-phone",
								cmsTag: "label",
								cmsSource: "components/urgent/UrgentPage.tsx:82",
								children: "Phone (for a call back) *"
							}),
							/* @__PURE__ */ jsxs(CmsElement, {
								className: "phone",
								cmsTag: "div",
								cmsSource: "components/urgent/UrgentPage.tsx:83",
								children: [/* @__PURE__ */ jsx("select", {
									value: code,
									onChange: (e) => setCode(e.target.value),
									"aria-label": "Country code",
									children: CODES.map((c) => /* @__PURE__ */ jsx(CmsElement, {
										value: c.code,
										cmsTag: "option",
										cmsSource: "components/urgent/UrgentPage.tsx:84",
										children: c.label
									}, c.code))
								}), /* @__PURE__ */ jsx(CmsElement, {
									id: "urgent-phone",
									type: "tel",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									autoComplete: "tel-national",
									placeholder: "300 1234567",
									cmsTag: "input",
									cmsSource: "components/urgent/UrgentPage.tsx:85"
								})]
							}),
							tried && bad.phone && /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "small",
								cmsSource: "components/urgent/UrgentPage.tsx:86",
								children: "Add a number we can call back."
							})
						]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: err("email"),
						cmsTag: "label",
						cmsSource: "components/urgent/UrgentPage.tsx:87",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/urgent/UrgentPage.tsx:88",
								children: "Email *"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								autoComplete: "email",
								cmsTag: "input",
								cmsSource: "components/urgent/UrgentPage.tsx:89"
							}),
							tried && bad.email && /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "small",
								cmsSource: "components/urgent/UrgentPage.tsx:90",
								children: "Please enter a valid email."
							})
						]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "field",
						cmsTag: "label",
						cmsSource: "components/urgent/UrgentPage.tsx:91",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/urgent/UrgentPage.tsx:92",
							children: "Company / website"
						}), /* @__PURE__ */ jsx(CmsElement, {
							value: company,
							onChange: (e) => setCompany(e.target.value),
							autoComplete: "organization",
							cmsTag: "input",
							cmsSource: "components/urgent/UrgentPage.tsx:93"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "request-actions",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:94",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					type: "submit",
					className: "button-3d button-3d--coral",
					cmsTag: "button",
					cmsSource: "components/urgent/UrgentPage.tsx:95",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "btn-dot",
						"aria-hidden": "true",
						cmsTag: "i",
						cmsSource: "components/urgent/UrgentPage.tsx:96"
					}), " Send urgent request"]
				}), tried && invalid && /* @__PURE__ */ jsx(CmsElement, {
					className: "wizard-warn",
					cmsTag: "span",
					cmsSource: "components/urgent/UrgentPage.tsx:97",
					children: "Fill in the starred fields to send."
				})]
			})
		]
	});
}
function Request({ prefill }) {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "section urgent-request",
		id: "request",
		"aria-labelledby": "request-title",
		cmsTag: "section",
		cmsSource: "components/urgent/UrgentPage.tsx:98",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "request-card",
			"data-reveal": "scale",
			cmsTag: "div",
			cmsSource: "components/urgent/UrgentPage.tsx:99",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "request-intro",
				cmsTag: "div",
				cmsSource: "components/urgent/UrgentPage.tsx:100",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/urgent/UrgentPage.tsx:101",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/urgent/UrgentPage.tsx:102"
						}), " Urgent request"]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						id: "request-title",
						cmsTag: "h2",
						cmsSource: "components/urgent/UrgentPage.tsx:103",
						children: ["Tell us ", /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "em",
							cmsSource: "components/urgent/UrgentPage.tsx:104",
							children: "what's wrong."
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "request-copy",
						cmsTag: "p",
						cmsSource: "components/urgent/UrgentPage.tsx:105",
						children: "Urgent requests jump the queue. A short description is enough; we'll ask the rest when we call."
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "request-or",
						cmsTag: "p",
						cmsSource: "components/urgent/UrgentPage.tsx:106",
						children: "Or reach us directly"
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "direct",
						cmsTag: "ul",
						cmsSource: "components/urgent/UrgentPage.tsx:107",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/urgent/UrgentPage.tsx:108",
							children: /* @__PURE__ */ jsxs(CmsElement, {
								className: "direct-card",
								href: contactInfo.whatsapp,
								target: "_blank",
								rel: "noopener noreferrer",
								cmsTag: "a",
								cmsSource: "components/urgent/UrgentPage.tsx:109",
								children: [
									/* @__PURE__ */ jsx(CmsElement, {
										className: "direct-ico direct-ico--wa",
										cmsTag: "span",
										cmsSource: "components/urgent/UrgentPage.tsx:110",
										children: /* @__PURE__ */ jsx(MessageCircle, {
											size: 19,
											"aria-hidden": true
										})
									}),
									/* @__PURE__ */ jsxs(CmsElement, {
										cmsTag: "span",
										cmsSource: "components/urgent/UrgentPage.tsx:111",
										children: [/* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "small",
											cmsSource: "components/urgent/UrgentPage.tsx:112",
											children: "WhatsApp"
										}), /* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "b",
											cmsSource: "components/urgent/UrgentPage.tsx:113",
											children: "Chat with us now"
										})]
									}),
									/* @__PURE__ */ jsx(ArrowUpRight$1, {
										className: "direct-go",
										size: 18,
										"aria-hidden": true
									})
								]
							})
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/urgent/UrgentPage.tsx:114",
							children: /* @__PURE__ */ jsxs(CmsElement, {
								className: "direct-card",
								href: `mailto:${contactInfo.email}`,
								cmsTag: "a",
								cmsSource: "components/urgent/UrgentPage.tsx:115",
								children: [
									/* @__PURE__ */ jsx(CmsElement, {
										className: "direct-ico",
										cmsTag: "span",
										cmsSource: "components/urgent/UrgentPage.tsx:116",
										children: /* @__PURE__ */ jsx(Mail, {
											size: 19,
											"aria-hidden": true
										})
									}),
									/* @__PURE__ */ jsxs(CmsElement, {
										cmsTag: "span",
										cmsSource: "components/urgent/UrgentPage.tsx:117",
										children: [/* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "small",
											cmsSource: "components/urgent/UrgentPage.tsx:118",
											children: "Email"
										}), /* @__PURE__ */ jsx(CmsElement, {
											cmsTag: "b",
											cmsSource: "components/urgent/UrgentPage.tsx:119",
											children: contactInfo.email
										})]
									}),
									/* @__PURE__ */ jsx(ArrowUpRight$1, {
										className: "direct-go",
										size: 18,
										"aria-hidden": true
									})
								]
							})
						})]
					})
				]
			}), /* @__PURE__ */ jsx(RequestForm, { prefill })]
		})
	});
}
function UrgentPage() {
	const [prefill, setPrefill] = useState({
		n: 0,
		scope: "Tech",
		issue: ""
	});
	const pick = (p) => {
		setPrefill((x) => ({
			n: x.n + 1,
			scope: p.scope,
			issue: p.text ? p.title : ""
		}));
		scrollToRequest();
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(UrgentHero, {}),
		/* @__PURE__ */ jsx(Problems, { onPick: pick }),
		/* @__PURE__ */ jsx(HowWeHelp, {}),
		/* @__PURE__ */ jsx(Request, { prefill }),
		/* @__PURE__ */ jsx(GlobalPresence, {
			talk: /* @__PURE__ */ jsx(Talk, {}),
			urgentHref: "#request"
		})
	] });
}
// src/components/careers/CareersPage.tsx
var MEDIA = "/images/collaboration.webp";
var mail = (subject) => `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}`;
function CareersHero() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-hero careers-hero",
		style: { "--intro": intro },
		cmsTag: "section",
		cmsSource: "components/careers/CareersPage.tsx:1",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/careers/CareersPage.tsx:2"
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--two",
				"data-parallax": "-0.1",
				cmsTag: "div",
				cmsSource: "components/careers/CareersPage.tsx:3"
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-hero-inner",
				cmsTag: "div",
				cmsSource: "components/careers/CareersPage.tsx:4",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/careers/CareersPage.tsx:5",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/careers/CareersPage.tsx:6"
						}), " Careers"]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						"aria-label": "Careers at Sybertron",
						cmsTag: "h1",
						cmsSource: "components/careers/CareersPage.tsx:7",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/careers/CareersPage.tsx:8",
							children: [
								/* @__PURE__ */ jsx(SplitWords, { text: "Careers at" }),
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx(SplitWords, {
									text: "Sybertron",
									start: 2,
									em: true
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "about-lede",
						cmsTag: "p",
						cmsSource: "components/careers/CareersPage.tsx:9",
						children: "We hire curious people who like shipping. Interns work on real client projects from week one."
					})
				]
			})
		]
	});
}
function MediaPanel() {
	const [paused, setPaused] = useState(false);
	const isVideo = /\.(mp4|webm)$/i.test(MEDIA);
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: paused ? "careers-media is-paused" : "careers-media",
		"data-reveal": "scale",
		cmsTag: "figure",
		cmsSource: "components/careers/CareersPage.tsx:10",
		children: [isVideo ? /* @__PURE__ */ jsx(CmsElement, {
			src: MEDIA,
			autoPlay: true,
			loop: true,
			muted: true,
			playsInline: true,
			"aria-label": "Life at Sybertron",
			cmsTag: "video",
			cmsSource: "components/careers/CareersPage.tsx:11"
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(CmsElement, {
			src: MEDIA,
			alt: "Professionals collaborating around a laptop in an office",
			cmsTag: "img",
			cmsSource: "components/careers/CareersPage.tsx:12"
		}), /* @__PURE__ */ jsx(CmsElement, {
			className: "team-photo-note",
			cmsTag: "figcaption",
			cmsSource: "components/careers/CareersPage.tsx:13",
			children: "Representative team photography"
		})] }), /* @__PURE__ */ jsx(CmsElement, {
			type: "button",
			className: "careers-pause",
			onClick: () => {
				setPaused((p) => !p);
				const v = document.querySelector(".careers-media video");
				if (v) paused ? v.play() : v.pause();
			},
			"aria-label": paused ? "Play animation" : "Pause animation",
			cmsTag: "button",
			cmsSource: "components/careers/CareersPage.tsx:21",
			children: paused ? /* @__PURE__ */ jsx(Play, { size: 16 }) : /* @__PURE__ */ jsx(Pause, { size: 16 })
		})]
	});
}
function RoleRow({ r, i }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: r.open ? "role" : "role is-filled",
		style: { "--stagger": i },
		cmsTag: "li",
		cmsSource: "components/careers/CareersPage.tsx:22",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "role-main",
				cmsTag: "div",
				cmsSource: "components/careers/CareersPage.tsx:23",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h3",
					cmsSource: "components/careers/CareersPage.tsx:24",
					children: r.title
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "role-meta",
					cmsTag: "p",
					cmsSource: "components/careers/CareersPage.tsx:25",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/careers/CareersPage.tsx:26",
							children: r.team
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/careers/CareersPage.tsx:27",
							children: r.type
						}),
						r.location && /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/careers/CareersPage.tsx:28",
							children: r.location
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "role-summary",
				cmsTag: "p",
				cmsSource: "components/careers/CareersPage.tsx:29",
				children: r.summary
			}),
			r.open ? /* @__PURE__ */ jsxs(CmsElement, {
				className: "role-apply",
				href: mail(`Application: ${r.title}`),
				"aria-label": `Apply for ${r.title}`,
				cmsTag: "a",
				cmsSource: "components/careers/CareersPage.tsx:30",
				children: ["Apply ", /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 15 })]
			}) : /* @__PURE__ */ jsx(CmsElement, {
				className: "role-filled",
				cmsTag: "span",
				cmsSource: "components/careers/CareersPage.tsx:31",
				children: "Position filled"
			})
		]
	});
}
function OpenRoles() {
	const open = roles.filter((r) => r.open);
	const filled = roles.filter((r) => !r.open);
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "section careers-roles",
		id: "roles",
		cmsTag: "section",
		cmsSource: "components/careers/CareersPage.tsx:32",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-inner",
			cmsTag: "div",
			cmsSource: "components/careers/CareersPage.tsx:33",
			children: [
				/* @__PURE__ */ jsx(MediaPanel, {}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "careers-roles-head",
					"data-reveal": true,
					cmsTag: "div",
					cmsSource: "components/careers/CareersPage.tsx:34",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/careers/CareersPage.tsx:35",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/careers/CareersPage.tsx:36"
						}), " Open roles"]
					}), /* @__PURE__ */ jsxs(CmsElement, {
						className: "careers-count",
						cmsTag: "span",
						cmsSource: "components/careers/CareersPage.tsx:37",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "b",
								cmsSource: "components/careers/CareersPage.tsx:38",
								children: open.length
							}),
							" open · ",
							filled.length,
							" filled"
						]
					})]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "role-list rv-stagger",
					"data-reveal": true,
					cmsTag: "ul",
					cmsSource: "components/careers/CareersPage.tsx:39",
					children: [...open, ...filled].map((r, i) => /* @__PURE__ */ jsx(RoleRow, {
						r,
						i
					}, r.id))
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "careers-intro",
					"data-reveal": "scale",
					cmsTag: "div",
					cmsSource: "components/careers/CareersPage.tsx:40",
					children: [/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "div",
						cmsSource: "components/careers/CareersPage.tsx:41",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "h2",
							cmsSource: "components/careers/CareersPage.tsx:42",
							children: "Don't see your role?"
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/careers/CareersPage.tsx:43",
							children: "Introduce yourself anyway, in a one-minute video. We keep every intro and get in touch when something fits."
						})]
					}), /* @__PURE__ */ jsxs(Button3D, {
						href: mail("Intro video"),
						tone: "mint",
						children: ["Introduce yourself ", /* @__PURE__ */ jsx(ArrowUpRight$1, { size: 17 })]
					})]
				})
			]
		})
	});
}
function CareersPage() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(CareersHero, {}),
		/* @__PURE__ */ jsx(OpenRoles, {}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/components/services/ServiceDetailPage.tsx
var ICONS = [
	MessageCircle,
	Bot,
	Workflow,
	FileSearch,
	BarChart3,
	Sparkles,
	ShieldCheck,
	Lock,
	Zap,
	Layers,
	Plug,
	Gauge
];
var TONES = {
	lilac: "#c9b7ff",
	blue: "#a9dcff",
	pink: "#ffb8c6",
	mint: "#b8f36b",
	yellow: "#ffd764",
	coral: "#ff9f8f"
};
var pad = (n) => String(n + 1).padStart(2, "0");
var idx = (i) => ({ "--i": i });
function Visual({ v }) {
	const ref = useRef(null);
	const seen = useInView(ref, {
		once: true,
		amount: .35
	});
	const max = v.k === "bars" ? Math.max(...v.nums) : 1;
	return /* @__PURE__ */ jsxs(CmsElement, {
		ref,
		className: seen ? `sd-vis sd-vis--${v.k} is-in` : `sd-vis sd-vis--${v.k}`,
		"data-tilt": true,
		cmsTag: "div",
		cmsSource: "components/services/ServiceDetailPage.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "sd-vis-bar",
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:2",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/services/ServiceDetailPage.tsx:3"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/services/ServiceDetailPage.tsx:4"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/services/ServiceDetailPage.tsx:5"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/services/ServiceDetailPage.tsx:6",
						children: v.title
					})
				]
			}),
			v.k === "chat" && /* @__PURE__ */ jsxs(CmsElement, {
				className: "sd-chat",
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:7",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						className: "me",
						style: idx(0),
						cmsTag: "p",
						cmsSource: "components/services/ServiceDetailPage.tsx:8",
						children: v.items[0]
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "typing",
						style: idx(1),
						"aria-hidden": true,
						cmsTag: "p",
						cmsSource: "components/services/ServiceDetailPage.tsx:9",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "i",
								cmsSource: "components/services/ServiceDetailPage.tsx:10"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "i",
								cmsSource: "components/services/ServiceDetailPage.tsx:11"
							}),
							/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "i",
								cmsSource: "components/services/ServiceDetailPage.tsx:12"
							})
						]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "bot",
						style: idx(2),
						cmsTag: "p",
						cmsSource: "components/services/ServiceDetailPage.tsx:13",
						children: v.items[1]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "me",
						style: idx(3),
						cmsTag: "p",
						cmsSource: "components/services/ServiceDetailPage.tsx:14",
						children: v.items[2]
					})
				]
			}),
			v.k === "flow" && /* @__PURE__ */ jsx(CmsElement, {
				className: "sd-flow",
				cmsTag: "ol",
				cmsSource: "components/services/ServiceDetailPage.tsx:15",
				children: v.items.map((t, i) => /* @__PURE__ */ jsxs(CmsElement, {
					style: idx(i),
					className: i === v.items.length - 1 ? "is-last" : void 0,
					cmsTag: "li",
					cmsSource: "components/services/ServiceDetailPage.tsx:16",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/services/ServiceDetailPage.tsx:17",
						children: /* @__PURE__ */ jsx(Check, {
							size: 12,
							"aria-hidden": true
						})
					}), t]
				}, t))
			}),
			v.k === "bars" && /* @__PURE__ */ jsx(CmsElement, {
				className: "sd-bars",
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:18",
				children: v.nums.map((n, i) => /* @__PURE__ */ jsxs(CmsElement, {
					style: {
						...idx(i),
						"--h": `${Math.round(n / max * 100)}%`
					},
					className: i === v.nums.length - 1 ? "is-peak" : void 0,
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:19",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "b",
						cmsSource: "components/services/ServiceDetailPage.tsx:20",
						children: v.items[i]
					}), /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "i",
						cmsSource: "components/services/ServiceDetailPage.tsx:21"
					})]
				}, i))
			}),
			v.k === "list" && /* @__PURE__ */ jsx(CmsElement, {
				className: "sd-list",
				cmsTag: "ul",
				cmsSource: "components/services/ServiceDetailPage.tsx:22",
				children: v.items.map((row, i) => {
					const [t, tag] = row.split("|");
					return /* @__PURE__ */ jsxs(CmsElement, {
						style: idx(i),
						cmsTag: "li",
						cmsSource: "components/services/ServiceDetailPage.tsx:23",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/services/ServiceDetailPage.tsx:24",
							children: t
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "small",
							cmsSource: "components/services/ServiceDetailPage.tsx:25",
							children: tag
						})]
					}, row);
				})
			})
		]
	});
}
function Capability({ c, i, tone }) {
	return /* @__PURE__ */ jsx(CmsElement, {
		id: `cap-${i}`,
		className: `sd-cap${i % 2 ? " is-flip" : ""}`,
		cmsTag: "section",
		cmsSource: "components/services/ServiceDetailPage.tsx:26",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "sd-wrap sd-cap-grid",
			cmsTag: "div",
			cmsSource: "components/services/ServiceDetailPage.tsx:27",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "sd-cap-copy",
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:28",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-rule",
						style: { background: tone },
						cmsTag: "span",
						cmsSource: "components/services/ServiceDetailPage.tsx:29"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-h",
						cmsTag: "h2",
						cmsSource: "components/services/ServiceDetailPage.tsx:30",
						children: c.h
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/services/ServiceDetailPage.tsx:31",
						children: c.d
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-subs",
						cmsTag: "ul",
						cmsSource: "components/services/ServiceDetailPage.tsx:32",
						children: c.subs.map(([t, d], k) => {
							const Icon = ICONS[(i * 2 + k + (i > 1 ? 3 : 0)) % ICONS.length];
							return /* @__PURE__ */ jsxs(CmsElement, {
								style: idx(k),
								cmsTag: "li",
								cmsSource: "components/services/ServiceDetailPage.tsx:33",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									className: "sd-sub-ic",
									style: { background: tone },
									cmsTag: "span",
									cmsSource: "components/services/ServiceDetailPage.tsx:34",
									children: /* @__PURE__ */ jsx(Icon, {
										size: 18,
										"aria-hidden": true
									})
								}), /* @__PURE__ */ jsxs(CmsElement, {
									cmsTag: "div",
									cmsSource: "components/services/ServiceDetailPage.tsx:35",
									children: [/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "h3",
										cmsSource: "components/services/ServiceDetailPage.tsx:36",
										children: t
									}), /* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "p",
										cmsSource: "components/services/ServiceDetailPage.tsx:37",
										children: d
									})]
								})]
							}, t);
						})
					})
				]
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "sd-cap-vis",
				"data-reveal": "scale",
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:38",
				children: /* @__PURE__ */ jsx(Visual, { v: c.vis })
			})]
		})
	});
}
function Pays({ title, rows }) {
	const ref = useRef(null);
	const on = useInView(ref, {
		once: true,
		amount: .4
	});
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "sd-pays",
		id: "pays-off",
		cmsTag: "section",
		cmsSource: "components/services/ServiceDetailPage.tsx:39",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "sd-wrap sd-pays-grid",
			cmsTag: "div",
			cmsSource: "components/services/ServiceDetailPage.tsx:40",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				className: "sd-h",
				"data-reveal": true,
				cmsTag: "h2",
				cmsSource: "components/services/ServiceDetailPage.tsx:41",
				children: title
			}), /* @__PURE__ */ jsx(CmsElement, {
				ref,
				className: on ? "sd-pays-list is-in" : "sd-pays-list",
				cmsTag: "ul",
				cmsSource: "components/services/ServiceDetailPage.tsx:42",
				children: rows.map((r, i) => /* @__PURE__ */ jsxs(CmsElement, {
					style: idx(i),
					cmsTag: "li",
					cmsSource: "components/services/ServiceDetailPage.tsx:43",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							className: "sd-pays-no",
							cmsTag: "span",
							cmsSource: "components/services/ServiceDetailPage.tsx:44",
							children: pad(i)
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/services/ServiceDetailPage.tsx:45",
							children: r
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "sd-pays-dot",
							"aria-hidden": true,
							cmsTag: "span",
							cmsSource: "components/services/ServiceDetailPage.tsx:46",
							children: /* @__PURE__ */ jsx(Check, { size: 13 })
						})
					]
				}, r))
			})]
		})
	});
}
function Team({ words, note, tone }) {
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "sd-team",
		cmsTag: "section",
		cmsSource: "components/services/ServiceDetailPage.tsx:47",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "sd-wrap",
			cmsTag: "div",
			cmsSource: "components/services/ServiceDetailPage.tsx:48",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "sd-cloud",
				"data-reveal": "scale",
				style: { "--tone": tone },
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:49",
				children: [words.map((w, i) => /* @__PURE__ */ jsx(CmsElement, {
					style: idx(i),
					className: `w${i % 5}`,
					cmsTag: "span",
					cmsSource: "components/services/ServiceDetailPage.tsx:50",
					children: w
				}, w)), /* @__PURE__ */ jsx(CmsElement, {
					"aria-hidden": true,
					cmsTag: "b",
					cmsSource: "components/services/ServiceDetailPage.tsx:51",
					children: "Teamwork"
				})]
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "sd-cap-note",
				"data-reveal": true,
				cmsTag: "p",
				cmsSource: "components/services/ServiceDetailPage.tsx:52",
				children: note
			})]
		})
	});
}
function Steps({ steps }) {
	const rows = [
		[
			"Week 1",
			"Find the workflow",
			steps[0]
		],
		[
			"Weeks 2-3",
			"Prototype",
			steps[1]
		],
		[
			"Weeks 4+",
			"Build and connect",
			steps[2]
		],
		[
			"Launch",
			"Test and roll out",
			`We test against real examples, release to a small group first and widen once it is behaving.`
		],
		[
			"Every month",
			"Measure and improve",
			"We track what is saved, what breaks and what users ask for, then keep improving."
		]
	];
	return /* @__PURE__ */ jsx(CmsElement, {
		className: "sd-how",
		id: "how-we-work",
		cmsTag: "section",
		cmsSource: "components/services/ServiceDetailPage.tsx:53",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "sd-wrap",
			cmsTag: "div",
			cmsSource: "components/services/ServiceDetailPage.tsx:54",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				className: "sd-h",
				"data-reveal": true,
				cmsTag: "h2",
				cmsSource: "components/services/ServiceDetailPage.tsx:55",
				children: "How we work"
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "sd-steps",
				"data-reveal": true,
				cmsTag: "ol",
				cmsSource: "components/services/ServiceDetailPage.tsx:56",
				children: rows.map(([when, t, d], i) => /* @__PURE__ */ jsxs(CmsElement, {
					style: idx(i),
					cmsTag: "li",
					cmsSource: "components/services/ServiceDetailPage.tsx:57",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "small",
							cmsSource: "components/services/ServiceDetailPage.tsx:58",
							children: when
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "sd-step-no",
							cmsTag: "span",
							cmsSource: "components/services/ServiceDetailPage.tsx:59",
							children: pad(i)
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "h3",
							cmsSource: "components/services/ServiceDetailPage.tsx:60",
							children: t
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/services/ServiceDetailPage.tsx:61",
							children: d
						})
					]
				}, t))
			})]
		})
	});
}
function Carousel({ title, work, prods }) {
	const track = useRef(null);
	const [pos, setPos] = useState(0);
	const slides = [...work.flatMap((id) => {
		const w = allProjects.find((p) => p.id === id);
		return w ? [{
			key: w.id,
			kind: "work",
			title: w.name,
			tag: `Client work · ${w.tags[0]}`,
			text: w.summary,
			href: "/work",
			node: /* @__PURE__ */ jsx(BrowserFrame, {
				url: w.url,
				children: /* @__PURE__ */ jsx(WorkVisual, { item: w })
			})
		}] : [];
	}), ...prods.flatMap((id) => {
		const p = catalog.find((c) => c.id === id);
		return p ? [{
			key: p.id,
			kind: "product",
			title: p.name,
			tag: `Our product · ${categories.find((c) => c.id === p.cat)?.label}`,
			text: p.blurb,
			href: productHref(p.id),
			node: /* @__PURE__ */ jsx(CmsElement, {
				className: "sd-prodmock",
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:62",
				children: /* @__PURE__ */ jsx(ProductMock, { m: p.mock })
			})
		}] : [];
	})];
	const go = (dir) => {
		const el = track.current;
		if (!el) return;
		const card = el.querySelector(".sd-slide");
		el.scrollBy({
			left: dir * ((card?.offsetWidth ?? 400) + 20),
			behavior: "smooth"
		});
	};
	const onScroll = () => {
		const el = track.current;
		const card = el?.querySelector(".sd-slide");
		if (el && card) setPos(Math.round(el.scrollLeft / (card.offsetWidth + 20)));
	};
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "sd-slides",
		id: "work",
		cmsTag: "section",
		cmsSource: "components/services/ServiceDetailPage.tsx:63",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "sd-wrap",
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:64",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "sd-slides-head",
					"data-reveal": true,
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:65",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-h-sm",
						cmsTag: "h2",
						cmsSource: "components/services/ServiceDetailPage.tsx:66",
						children: title
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "text-link",
						href: "/products",
						cmsTag: "a",
						cmsSource: "components/services/ServiceDetailPage.tsx:67",
						children: "All products"
					})]
				})
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "sd-track",
				ref: track,
				onScroll,
				"data-reveal": true,
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:68",
				children: slides.map((s, i) => /* @__PURE__ */ jsxs(CmsElement, {
					href: s.href,
					className: "sd-slide",
					style: idx(i),
					"data-cursor": "View",
					cmsTag: "a",
					cmsSource: "components/services/ServiceDetailPage.tsx:69",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							className: "sd-slide-media",
							cmsTag: "div",
							cmsSource: "components/services/ServiceDetailPage.tsx:70",
							children: s.node
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "small",
							cmsSource: "components/services/ServiceDetailPage.tsx:71",
							children: s.tag
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "h3",
							cmsSource: "components/services/ServiceDetailPage.tsx:72",
							children: [
								s.title,
								" ",
								/* @__PURE__ */ jsx(ArrowUpRight, {
									size: 16,
									"aria-hidden": true
								})
							]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/services/ServiceDetailPage.tsx:73",
							children: s.text
						})
					]
				}, s.key))
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "sd-wrap sd-slides-ctl",
				cmsTag: "div",
				cmsSource: "components/services/ServiceDetailPage.tsx:74",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						"aria-label": "Previous",
						onClick: () => go(-1),
						disabled: pos <= 0,
						cmsTag: "button",
						cmsSource: "components/services/ServiceDetailPage.tsx:75",
						children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18 })
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						type: "button",
						"aria-label": "Next",
						onClick: () => go(1),
						disabled: pos >= slides.length - 1,
						cmsTag: "button",
						cmsSource: "components/services/ServiceDetailPage.tsx:76",
						children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/services/ServiceDetailPage.tsx:77",
						children: [
							String(Math.min(pos + 1, slides.length)).padStart(2, "0"),
							" / ",
							String(slides.length).padStart(2, "0")
						]
					})
				]
			})
		]
	});
}
function ServiceDetailPage() {
	const id = serviceIdOf(useRouter().path) ?? "";
	const d = getService(id);
	const svc = SERVICES.find((s) => s.id === id);
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	const [open, setOpen] = useState(0);
	useEffect(() => {}, [svc]);
	if (!d || !svc) return null;
	const tone = TONES[svc.tone] ?? TONES.lilac;
	const style = { "--tone": tone };
	const more = d.more.map((m) => SERVICES.find((s) => s.id === m)).filter(Boolean);
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "sd",
		style,
		cmsTag: "div",
		cmsSource: "components/services/ServiceDetailPage.tsx:78",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "sd-hero",
				style: { "--intro": intro },
				cmsTag: "section",
				cmsSource: "components/services/ServiceDetailPage.tsx:79",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					className: "hero-blob hero-blob--one",
					"data-parallax": "0.14",
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:80"
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "sd-wrap",
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:81",
					children: [
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "sd-crumb",
							"aria-label": "Breadcrumb",
							cmsTag: "nav",
							cmsSource: "components/services/ServiceDetailPage.tsx:82",
							children: [
								/* @__PURE__ */ jsx(CmsElement, {
									href: "/services",
									cmsTag: "a",
									cmsSource: "components/services/ServiceDetailPage.tsx:83",
									children: "Services"
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									"aria-hidden": "true",
									cmsTag: "span",
									cmsSource: "components/services/ServiceDetailPage.tsx:84",
									children: "/"
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									"aria-current": "page",
									cmsTag: "span",
									cmsSource: "components/services/ServiceDetailPage.tsx:85",
									children: svc.title
								})
							]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							"aria-label": svc.title,
							cmsTag: "h1",
							cmsSource: "components/services/ServiceDetailPage.tsx:86",
							children: /* @__PURE__ */ jsx(CmsElement, {
								"aria-hidden": "true",
								cmsTag: "span",
								cmsSource: "components/services/ServiceDetailPage.tsx:87",
								children: /* @__PURE__ */ jsx(SplitWords, { text: svc.title })
							})
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "sd-lede",
							cmsTag: "p",
							cmsSource: "components/services/ServiceDetailPage.tsx:88",
							children: d.lede
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "sd-actions",
							cmsTag: "div",
							cmsSource: "components/services/ServiceDetailPage.tsx:89",
							children: /* @__PURE__ */ jsxs(Button3D, {
								tone: "mint",
								onClick: () => goToContact(`${svc.title} project`),
								children: ["Start a project ", /* @__PURE__ */ jsx(ArrowUpRight, { size: 16 })]
							})
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "sd-hero-art",
							"data-tilt": true,
							"data-cursor": "Talk",
							cmsTag: "div",
							cmsSource: "components/services/ServiceDetailPage.tsx:90",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								className: "sd-hero-art-in",
								cmsTag: "div",
								cmsSource: "components/services/ServiceDetailPage.tsx:91",
								children: svc.art
							}), /* @__PURE__ */ jsxs(CmsElement, {
								className: "sd-talk",
								href: "#contact",
								cmsTag: "a",
								cmsSource: "components/services/ServiceDetailPage.tsx:92",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "i",
									cmsSource: "components/services/ServiceDetailPage.tsx:93"
								}), " Talk to us"]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "sd-intro",
				id: "overview",
				cmsTag: "section",
				cmsSource: "components/services/ServiceDetailPage.tsx:94",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "sd-wrap sd-intro-grid",
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:95",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-h",
						"data-reveal": true,
						cmsTag: "h2",
						cmsSource: "components/services/ServiceDetailPage.tsx:96",
						children: d.stmt
					}), /* @__PURE__ */ jsxs(CmsElement, {
						className: "sd-intro-copy",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/services/ServiceDetailPage.tsx:97",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/services/ServiceDetailPage.tsx:98",
							children: d.p[0]
						}), /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/services/ServiceDetailPage.tsx:99",
							children: d.p[1]
						})]
					})]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "sd-wrap",
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:100",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-kicker",
						"data-reveal": true,
						cmsTag: "p",
						cmsSource: "components/services/ServiceDetailPage.tsx:101",
						children: d.capsTitle
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "sd-chips",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/services/ServiceDetailPage.tsx:102",
						children: d.caps.map((c, i) => /* @__PURE__ */ jsxs(CmsElement, {
							href: `#cap-${i}`,
							style: idx(i),
							cmsTag: "a",
							cmsSource: "components/services/ServiceDetailPage.tsx:103",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/services/ServiceDetailPage.tsx:104",
								children: c.chip
							}), /* @__PURE__ */ jsx(ArrowRight, {
								size: 16,
								"aria-hidden": true
							})]
						}, c.chip))
					})]
				})]
			}),
			d.caps.map((c, i) => /* @__PURE__ */ jsx(Capability, {
				c,
				i,
				tone
			}, c.h)),
			/* @__PURE__ */ jsx(Pays, {
				title: d.paysTitle,
				rows: d.pays
			}),
			/* @__PURE__ */ jsx(Team, {
				words: d.words,
				note: d.teamNote,
				tone
			}),
			/* @__PURE__ */ jsx(Steps, { steps: d.steps }),
			/* @__PURE__ */ jsx(Carousel, {
				title: `Our products and client work for ${svc.title}`,
				work: d.work,
				prods: d.prods
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "sd-faqs",
				id: "faq",
				cmsTag: "section",
				cmsSource: "components/services/ServiceDetailPage.tsx:105",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "sd-wrap pd-faq-grid",
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:106",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-h",
						"data-reveal": true,
						cmsTag: "h2",
						cmsSource: "components/services/ServiceDetailPage.tsx:107",
						children: "Questions"
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "pd-faq-list",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/services/ServiceDetailPage.tsx:108",
						children: d.faq.map(([q, a], i) => /* @__PURE__ */ jsxs(CmsElement, {
							className: open === i ? "pd-faq is-open" : "pd-faq",
							style: idx(i),
							cmsTag: "div",
							cmsSource: "components/services/ServiceDetailPage.tsx:109",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/services/ServiceDetailPage.tsx:110",
								children: /* @__PURE__ */ jsxs(CmsElement, {
									type: "button",
									"aria-expanded": open === i,
									onClick: () => setOpen(open === i ? -1 : i),
									cmsTag: "button",
									cmsSource: "components/services/ServiceDetailPage.tsx:111",
									children: [/* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "span",
										cmsSource: "components/services/ServiceDetailPage.tsx:112",
										children: q
									}), open === i ? /* @__PURE__ */ jsx(Minus, {
										size: 16,
										"aria-hidden": true
									}) : /* @__PURE__ */ jsx(Plus, {
										size: 16,
										"aria-hidden": true
									})]
								})
							}), /* @__PURE__ */ jsx(CmsElement, {
								className: "pd-faq-body",
								cmsTag: "div",
								cmsSource: "components/services/ServiceDetailPage.tsx:113",
								children: /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "p",
									cmsSource: "components/services/ServiceDetailPage.tsx:114",
									children: a
								})
							})]
						}, q))
					})]
				})
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "sd-more",
				cmsTag: "section",
				cmsSource: "components/services/ServiceDetailPage.tsx:115",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "sd-wrap",
					cmsTag: "div",
					cmsSource: "components/services/ServiceDetailPage.tsx:116",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "sd-kicker",
						"data-reveal": true,
						cmsTag: "p",
						cmsSource: "components/services/ServiceDetailPage.tsx:117",
						children: "More services"
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "sd-more-grid",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/services/ServiceDetailPage.tsx:118",
						children: more.map((m, i) => /* @__PURE__ */ jsxs(CmsElement, {
							href: serviceHref(m.id),
							style: idx(i),
							cmsTag: "a",
							cmsSource: "components/services/ServiceDetailPage.tsx:119",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "span",
								cmsSource: "components/services/ServiceDetailPage.tsx:120",
								children: m.title
							}), /* @__PURE__ */ jsx(ArrowRight, {
								size: 18,
								"aria-hidden": true
							})]
						}, m.id))
					})]
				})
			}),
			/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
		]
	});
}
// src/components/blog/BlogPage.tsx
function PostCover({ post }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "bl-cover bl-cover-photo",
		cmsTag: "div",
		cmsSource: "components/blog/BlogPage.tsx:1",
		children: [/* @__PURE__ */ jsx(Photo, { kind: servicePhoto[post.service] || "analytics" }), /* @__PURE__ */ jsx(CmsElement, {
			cmsTag: "b",
			cmsSource: "components/blog/BlogPage.tsx:2",
			children: post.cat
		})]
	});
}
function PostCard({ p, i = 0 }) {
	return /* @__PURE__ */ jsxs(CmsElement, {
		href: postHref(p.slug),
		className: "bl-card",
		style: { "--i": i },
		"data-cursor": "Read",
		cmsTag: "a",
		cmsSource: "components/blog/BlogPage.tsx:3",
		children: [
			/* @__PURE__ */ jsx(PostCover, { post: p }),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "bl-card-meta",
				cmsTag: "div",
				cmsSource: "components/blog/BlogPage.tsx:4",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					className: "bl-tag",
					cmsTag: "span",
					cmsSource: "components/blog/BlogPage.tsx:5",
					children: p.cat
				}), /* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "span",
					cmsSource: "components/blog/BlogPage.tsx:6",
					children: [
						/* @__PURE__ */ jsx(Clock, {
							size: 12,
							"aria-hidden": true
						}),
						" ",
						p.read,
						" min"
					]
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "h3",
				cmsSource: "components/blog/BlogPage.tsx:7",
				children: [
					p.title,
					" ",
					/* @__PURE__ */ jsx(ArrowUpRight, {
						size: 16,
						"aria-hidden": true
					})
				]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "p",
				cmsSource: "components/blog/BlogPage.tsx:8",
				children: p.excerpt
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				cmsTag: "small",
				cmsSource: "components/blog/BlogPage.tsx:9",
				children: fmtDate(p.date)
			})
		]
	});
}
function BlogPage() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	const [cat, setCat] = useState("All");
	const [feat, ...rest] = posts;
	const list = cat === "All" ? rest : posts.filter((p) => p.cat === cat);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs(CmsElement, {
			className: "about-hero bl-hero",
			style: { "--intro": intro },
			cmsTag: "section",
			cmsSource: "components/blog/BlogPage.tsx:10",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/blog/BlogPage.tsx:11"
			}), /* @__PURE__ */ jsxs(CmsElement, {
				className: "about-hero-inner",
				cmsTag: "div",
				cmsSource: "components/blog/BlogPage.tsx:12",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/blog/BlogPage.tsx:13",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/blog/BlogPage.tsx:14"
						}), " Blog"]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						"aria-label": "Notes from the team",
						cmsTag: "h1",
						cmsSource: "components/blog/BlogPage.tsx:15",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/blog/BlogPage.tsx:16",
							children: [/* @__PURE__ */ jsx(SplitWords, { text: "Notes from" }), /* @__PURE__ */ jsx(SplitWords, {
								text: "the team",
								start: 2,
								em: true
							})]
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "about-lede",
						cmsTag: "p",
						cmsSource: "components/blog/BlogPage.tsx:17",
						children: "Practical writing on AI, web, apps, ecommerce and growth, from the people who build them."
					})
				]
			})]
		}),
		/* @__PURE__ */ jsx(CmsElement, {
			className: "bl-body",
			cmsTag: "section",
			cmsSource: "components/blog/BlogPage.tsx:18",
			children: /* @__PURE__ */ jsxs(CmsElement, {
				className: "bl-wrap",
				cmsTag: "div",
				cmsSource: "components/blog/BlogPage.tsx:19",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						href: postHref(feat.slug),
						className: "bl-feature",
						"data-reveal": true,
						"data-cursor": "Read",
						style: { "--tone": feat.tone },
						cmsTag: "a",
						cmsSource: "components/blog/BlogPage.tsx:20",
						children: [/* @__PURE__ */ jsx(PostCover, { post: feat }), /* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "div",
							cmsSource: "components/blog/BlogPage.tsx:21",
							children: [
								/* @__PURE__ */ jsxs(CmsElement, {
									className: "bl-tag",
									cmsTag: "span",
									cmsSource: "components/blog/BlogPage.tsx:22",
									children: ["Featured · ", feat.cat]
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "h2",
									cmsSource: "components/blog/BlogPage.tsx:23",
									children: feat.title
								}),
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "p",
									cmsSource: "components/blog/BlogPage.tsx:24",
									children: feat.excerpt
								}),
								/* @__PURE__ */ jsxs(CmsElement, {
									className: "bl-more",
									cmsTag: "span",
									cmsSource: "components/blog/BlogPage.tsx:25",
									children: ["Read article ", /* @__PURE__ */ jsx(ArrowRight, {
										size: 16,
										"aria-hidden": true
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "bl-filters",
						role: "tablist",
						"aria-label": "Filter by topic",
						"data-reveal": true,
						cmsTag: "div",
						cmsSource: "components/blog/BlogPage.tsx:26",
						children: ["All", ...BLOG_CATS].map((c) => /* @__PURE__ */ jsx(CmsElement, {
							type: "button",
							role: "tab",
							"aria-selected": cat === c,
							className: cat === c ? "is-on" : void 0,
							onClick: () => setCat(c),
							cmsTag: "button",
							cmsSource: "components/blog/BlogPage.tsx:27",
							children: c
						}, c))
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "bl-grid",
						cmsTag: "div",
						cmsSource: "components/blog/BlogPage.tsx:28",
						children: [list.map((p, i) => /* @__PURE__ */ jsx(PostCard, {
							p,
							i
						}, p.slug)), list.length === 0 && /* @__PURE__ */ jsx(CmsElement, {
							className: "bl-empty",
							cmsTag: "p",
							cmsSource: "components/blog/BlogPage.tsx:29",
							children: "Nothing here yet. Check back soon."
						})]
					}, cat)
				]
			})
		}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/components/blog/BlogPostPage.tsx
function BlogPostPage() {
	const post = getPost(postSlugOf(useRouter().path) ?? "");
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	const [copied, setCopied] = useState(false);
	const [active, setActive] = useState(0);
	useEffect(() => {}, [post]);
	useEffect(() => {
		const hs = Array.from(document.querySelectorAll(".bp-article h2"));
		const on = () => {
			let a = 0;
			hs.forEach((h, i) => {
				if (h.getBoundingClientRect().top < window.innerHeight * .35) a = i;
			});
			setActive(a);
		};
		on();
		window.addEventListener("scroll", on, { passive: true });
		return () => window.removeEventListener("scroll", on);
	}, [post]);
	if (!post) return null;
	const svc = SERVICES.find((s) => s.id === post.service);
	const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		} catch {}
	};
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "bp",
		style: { "--tone": post.tone },
		cmsTag: "article",
		cmsSource: "components/blog/BlogPostPage.tsx:1",
		children: [
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "about-hero bp-hero",
				style: { "--intro": intro },
				cmsTag: "section",
				cmsSource: "components/blog/BlogPostPage.tsx:2",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					className: "hero-blob hero-blob--one",
					"data-parallax": "0.14",
					style: { background: post.tone },
					cmsTag: "div",
					cmsSource: "components/blog/BlogPostPage.tsx:3"
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "about-hero-inner",
					cmsTag: "div",
					cmsSource: "components/blog/BlogPostPage.tsx:4",
					children: [
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "bp-back",
							href: "/blog",
							cmsTag: "a",
							cmsSource: "components/blog/BlogPostPage.tsx:5",
							children: [/* @__PURE__ */ jsx(ArrowLeft, {
								size: 14,
								"aria-hidden": true
							}), " All articles"]
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "eyebrow",
							cmsTag: "p",
							cmsSource: "components/blog/BlogPostPage.tsx:6",
							children: [
								/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "span",
									cmsSource: "components/blog/BlogPostPage.tsx:7"
								}),
								" ",
								post.cat
							]
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							"aria-label": post.title,
							cmsTag: "h1",
							cmsSource: "components/blog/BlogPostPage.tsx:8",
							children: /* @__PURE__ */ jsx(CmsElement, {
								"aria-hidden": "true",
								cmsTag: "span",
								cmsSource: "components/blog/BlogPostPage.tsx:9",
								children: /* @__PURE__ */ jsx(SplitWords, { text: post.title })
							})
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "about-lede bp-meta",
							cmsTag: "p",
							cmsSource: "components/blog/BlogPostPage.tsx:10",
							children: [
								fmtDate(post.date),
								" · ",
								/* @__PURE__ */ jsx(Clock, {
									size: 13,
									"aria-hidden": true
								}),
								" ",
								post.read,
								" min read"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "bp-cover",
				"data-reveal": "scale",
				cmsTag: "div",
				cmsSource: "components/blog/BlogPostPage.tsx:11",
				children: /* @__PURE__ */ jsx(PostCover, { post })
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				className: "bp-grid",
				cmsTag: "div",
				cmsSource: "components/blog/BlogPostPage.tsx:12",
				children: [/* @__PURE__ */ jsxs(CmsElement, {
					className: "bp-toc",
					"aria-label": "In this article",
					cmsTag: "aside",
					cmsSource: "components/blog/BlogPostPage.tsx:13",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/blog/BlogPostPage.tsx:14",
							children: "In this article"
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "ol",
							cmsSource: "components/blog/BlogPostPage.tsx:15",
							children: post.body.map((b, i) => /* @__PURE__ */ jsx(CmsElement, {
								className: i === active ? "is-on" : void 0,
								cmsTag: "li",
								cmsSource: "components/blog/BlogPostPage.tsx:16",
								children: /* @__PURE__ */ jsx(CmsElement, {
									href: `#s${i}`,
									cmsTag: "a",
									cmsSource: "components/blog/BlogPostPage.tsx:17",
									children: b.h
								})
							}, b.h))
						}),
						/* @__PURE__ */ jsxs(CmsElement, {
							type: "button",
							onClick: copy,
							cmsTag: "button",
							cmsSource: "components/blog/BlogPostPage.tsx:18",
							children: [
								/* @__PURE__ */ jsx(Link2, {
									size: 14,
									"aria-hidden": true
								}),
								" ",
								copied ? "Link copied" : "Copy link"
							]
						})
					]
				}), /* @__PURE__ */ jsxs(CmsElement, {
					className: "bp-article",
					cmsTag: "div",
					cmsSource: "components/blog/BlogPostPage.tsx:19",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							className: "bp-excerpt",
							"data-reveal": true,
							cmsTag: "p",
							cmsSource: "components/blog/BlogPostPage.tsx:20",
							children: post.excerpt
						}),
						post.body.map((b, i) => /* @__PURE__ */ jsxs(CmsElement, {
							"data-reveal": true,
							cmsTag: "section",
							cmsSource: "components/blog/BlogPostPage.tsx:21",
							children: [
								/* @__PURE__ */ jsx(CmsElement, {
									id: `s${i}`,
									cmsTag: "h2",
									cmsSource: "components/blog/BlogPostPage.tsx:22",
									children: b.h
								}),
								b.p.map((t) => /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "p",
									cmsSource: "components/blog/BlogPostPage.tsx:23",
									children: t
								}, t)),
								b.ul && /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "ul",
									cmsSource: "components/blog/BlogPostPage.tsx:24",
									children: b.ul.map((li) => /* @__PURE__ */ jsx(CmsElement, {
										cmsTag: "li",
										cmsSource: "components/blog/BlogPostPage.tsx:25",
										children: li
									}, li))
								})
							]
						}, b.h)),
						/* @__PURE__ */ jsxs(CmsElement, {
							className: "bp-cta",
							"data-reveal": true,
							cmsTag: "div",
							cmsSource: "components/blog/BlogPostPage.tsx:26",
							children: [/* @__PURE__ */ jsxs(CmsElement, {
								cmsTag: "div",
								cmsSource: "components/blog/BlogPostPage.tsx:27",
								children: [/* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "h3",
									cmsSource: "components/blog/BlogPostPage.tsx:28",
									children: "Want help with this?"
								}), /* @__PURE__ */ jsx(CmsElement, {
									cmsTag: "p",
									cmsSource: "components/blog/BlogPostPage.tsx:29",
									children: "Tell us what you are working on and we will reply within one business day."
								})]
							}), /* @__PURE__ */ jsxs(CmsElement, {
								className: "bp-cta-actions",
								cmsTag: "div",
								cmsSource: "components/blog/BlogPostPage.tsx:30",
								children: [/* @__PURE__ */ jsxs(Button3D, {
									tone: "mint",
									onClick: () => goToContact(`Question about: ${post.title}`),
									children: ["Talk to us ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
								}), svc && /* @__PURE__ */ jsxs(CmsElement, {
									className: "text-link",
									href: serviceHref(svc.id),
									cmsTag: "a",
									cmsSource: "components/blog/BlogPostPage.tsx:31",
									children: [
										"See our ",
										svc.title,
										" service"
									]
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "bl-body bp-more",
				cmsTag: "section",
				cmsSource: "components/blog/BlogPostPage.tsx:32",
				children: /* @__PURE__ */ jsxs(CmsElement, {
					className: "bl-wrap",
					cmsTag: "div",
					cmsSource: "components/blog/BlogPostPage.tsx:33",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						className: "bl-kicker",
						"data-reveal": true,
						cmsTag: "p",
						cmsSource: "components/blog/BlogPostPage.tsx:34",
						children: "Keep reading"
					}), /* @__PURE__ */ jsx(CmsElement, {
						className: "bl-grid",
						cmsTag: "div",
						cmsSource: "components/blog/BlogPostPage.tsx:35",
						children: more.map((p, i) => /* @__PURE__ */ jsx(PostCard, {
							p,
							i
						}, p.slug))
					})]
				})
			}),
			/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
		]
	});
}
// src/data/legal.ts
var C = "hello@sybertron.com";
var LEGAL = [
	{
		id: "privacy",
		title: "Privacy policy",
		updated: "2 November 2026",
		lede: "What we collect when you use our website or work with us, why we collect it and the choices you have.",
		secs: [
			{
				id: "who",
				h: "Who we are",
				p: [`Sybertron Technologies ("we", "us") builds websites, apps, AI and marketing for businesses. You can reach us about privacy at ${C}.`]
			},
			{
				id: "collect",
				h: "What we collect",
				p: ["We collect only what we need to respond to you and deliver our work."],
				ul: [
					"Details you give us: name, email, phone, company and project information",
					"Messages sent through forms, email, chat or WhatsApp",
					"Technical data such as device, browser and pages visited, through cookies and similar tools",
					"Business information shared during a project, such as files and access credentials"
				]
			},
			{
				id: "use",
				h: "How we use it",
				p: ["We use your information to reply to enquiries, prepare proposals, deliver and support projects, send updates you asked for, keep our site secure and understand how it is used."]
			},
			{
				id: "share",
				h: "Who we share it with",
				p: ["We do not sell personal data. We share it only with service providers who help us run our business, such as hosting, email, analytics and payment tools, and where the law requires it."]
			},
			{
				id: "keep",
				h: "How long we keep it",
				p: ["Enquiry data is kept while we talk and for a reasonable period afterwards. Project data is kept for the life of the contract and the period needed for legal and accounting reasons."]
			},
			{
				id: "rights",
				h: "Your rights",
				p: ["Depending on where you live, you can ask to access, correct, delete or export your data, or object to certain uses.", `Email ${C} and we will respond within a reasonable time.`]
			},
			{
				id: "security",
				h: "Security",
				p: ["We use encryption in transit, access controls and regular backups. No system is perfectly secure, so we also limit what we collect."]
			},
			{
				id: "changes",
				h: "Changes",
				p: ["We may update this policy. The date above shows the latest version."]
			}
		]
	},
	{
		id: "terms",
		title: "Terms and conditions",
		updated: "2 November 2026",
		lede: "The rules for using our website and the basis on which we offer our services.",
		secs: [
			{
				id: "using",
				h: "Using this website",
				p: ["You may use this site for lawful purposes. Do not attempt to disrupt it, scrape it at scale or use it to send spam."]
			},
			{
				id: "services",
				h: "Our services",
				p: ["Each project is covered by a written proposal or agreement that sets out scope, price, timeline and responsibilities. If it differs from these terms, the agreement wins."]
			},
			{
				id: "payment",
				h: "Fees and payment",
				p: ["Fees, milestones and payment dates are listed in your proposal. Late payments may pause work and may incur reasonable interest."]
			},
			{
				id: "ip",
				h: "Ownership and intellectual property",
				p: ["Once you have paid in full, you own the custom work we create for you. We keep ownership of our pre-existing tools, libraries and know-how, and give you a licence to use them as part of your project.", "Third-party components remain under their own licences."]
			},
			{
				id: "client",
				h: "What we need from you",
				p: ["Timely feedback, accurate information and the access needed to do the work. Delays on your side may move the timeline."]
			},
			{
				id: "warranty",
				h: "Warranty and liability",
				p: ["We work with professional care and will fix defects reported within the support period in your agreement. To the extent the law allows, we are not liable for indirect or consequential losses, and our total liability is limited to the fees paid for the work in question."]
			},
			{
				id: "confidentiality",
				h: "Confidentiality",
				p: ["We keep your business information confidential and expect the same of you for ours."]
			},
			{
				id: "law",
				h: "Governing law",
				p: ["These terms are governed by the laws of India. Disputes will be handled by the courts of the city named in your agreement."]
			},
			{
				id: "contact",
				h: "Contact",
				p: [`Questions about these terms: ${C}.`]
			}
		]
	},
	{
		id: "cookies",
		title: "Cookie policy",
		updated: "2 November 2026",
		lede: "What cookies are, which ones we use and how to change your mind at any time.",
		secs: [
			{
				id: "what",
				h: "What cookies are",
				p: ["Cookies are small files stored on your device. They help a site remember you and understand how it is used."]
			},
			{
				id: "types",
				h: "Cookies we use",
				p: ["You can switch the optional categories on or off from Cookie settings in the footer."],
				ul: [
					"Necessary: keep the site working, such as remembering your cookie choice. Always on.",
					"Analytics: show us which pages are useful so we can improve them.",
					"Marketing: help us measure campaigns and show relevant ads elsewhere."
				]
			},
			{
				id: "manage",
				h: "Managing cookies",
				p: ["Use Cookie settings in the footer to change your choices. You can also block or delete cookies in your browser settings, though parts of the site may then stop working."]
			},
			{
				id: "third",
				h: "Third-party tools",
				p: ["Analytics and advertising providers may set their own cookies. Their policies explain how they use data."]
			},
			{
				id: "contact",
				h: "Contact",
				p: [`Questions about cookies: ${C}.`]
			}
		]
	}
];
var getLegal = (id) => LEGAL.find((l) => l.id === id) ?? null;
// src/components/legal/LegalPage.tsx
function LegalPage() {
	const doc = getLegal(useRouter().path.replace(/\/+$/, "").slice(1));
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	const [active, setActive] = useState(0);
	useEffect(() => {}, [doc]);
	useEffect(() => {
		const hs = Array.from(document.querySelectorAll(".lg-doc section"));
		const on = () => {
			let a = 0;
			hs.forEach((h, i) => {
				if (h.getBoundingClientRect().top < window.innerHeight * .4) a = i;
			});
			setActive(a);
		};
		on();
		window.addEventListener("scroll", on, { passive: true });
		return () => window.removeEventListener("scroll", on);
	}, [doc]);
	if (!doc) return null;
	const words = doc.title.split(" ");
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs(CmsElement, {
			className: "about-hero lg-hero",
			style: { "--intro": intro },
			cmsTag: "section",
			cmsSource: "components/legal/LegalPage.tsx:1",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				className: "hero-blob hero-blob--one",
				"data-parallax": "0.14",
				cmsTag: "div",
				cmsSource: "components/legal/LegalPage.tsx:2"
			}), /* @__PURE__ */ jsxs(CmsElement, {
				className: "about-hero-inner",
				cmsTag: "div",
				cmsSource: "components/legal/LegalPage.tsx:3",
				children: [
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "eyebrow",
						cmsTag: "p",
						cmsSource: "components/legal/LegalPage.tsx:4",
						children: [/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/legal/LegalPage.tsx:5"
						}), " Legal"]
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						"aria-label": doc.title,
						cmsTag: "h1",
						cmsSource: "components/legal/LegalPage.tsx:6",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							"aria-hidden": "true",
							cmsTag: "span",
							cmsSource: "components/legal/LegalPage.tsx:7",
							children: [/* @__PURE__ */ jsx(SplitWords, { text: words.slice(0, -1).join(" ") }), /* @__PURE__ */ jsx(SplitWords, {
								text: words[words.length - 1],
								start: words.length - 1,
								em: true
							})]
						})
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "about-lede",
						cmsTag: "p",
						cmsSource: "components/legal/LegalPage.tsx:8",
						children: doc.lede
					}),
					/* @__PURE__ */ jsxs(CmsElement, {
						className: "lg-updated",
						cmsTag: "p",
						cmsSource: "components/legal/LegalPage.tsx:9",
						children: ["Last updated ", doc.updated]
					})
				]
			})]
		}),
		/* @__PURE__ */ jsxs(CmsElement, {
			className: "lg-grid",
			cmsTag: "div",
			cmsSource: "components/legal/LegalPage.tsx:10",
			children: [/* @__PURE__ */ jsxs(CmsElement, {
				className: "lg-side",
				cmsTag: "aside",
				cmsSource: "components/legal/LegalPage.tsx:11",
				children: [
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "p",
						cmsSource: "components/legal/LegalPage.tsx:12",
						children: "On this page"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "ol",
						cmsSource: "components/legal/LegalPage.tsx:13",
						children: doc.secs.map((s, i) => /* @__PURE__ */ jsx(CmsElement, {
							className: i === active ? "is-on" : void 0,
							cmsTag: "li",
							cmsSource: "components/legal/LegalPage.tsx:14",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: `#${s.id}`,
								cmsTag: "a",
								cmsSource: "components/legal/LegalPage.tsx:15",
								children: s.h
							})
						}, s.id))
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						className: "lg-other",
						cmsTag: "p",
						cmsSource: "components/legal/LegalPage.tsx:16",
						children: "Other policies"
					}),
					/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "ul",
						cmsSource: "components/legal/LegalPage.tsx:17",
						children: LEGAL.filter((l) => l.id !== doc.id).map((l) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/legal/LegalPage.tsx:18",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: `/${l.id}`,
								cmsTag: "a",
								cmsSource: "components/legal/LegalPage.tsx:19",
								children: l.title
							})
						}, l.id))
					})
				]
			}), /* @__PURE__ */ jsx(CmsElement, {
				className: "lg-doc",
				cmsTag: "div",
				cmsSource: "components/legal/LegalPage.tsx:20",
				children: doc.secs.map((s, i) => /* @__PURE__ */ jsxs(CmsElement, {
					id: s.id,
					"data-reveal": true,
					cmsTag: "section",
					cmsSource: "components/legal/LegalPage.tsx:21",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							className: "lg-no",
							cmsTag: "span",
							cmsSource: "components/legal/LegalPage.tsx:22",
							children: String(i + 1).padStart(2, "0")
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "h2",
							cmsSource: "components/legal/LegalPage.tsx:23",
							children: s.h
						}),
						s.p.map((t) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "p",
							cmsSource: "components/legal/LegalPage.tsx:24",
							children: t
						}, t)),
						s.ul && /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "ul",
							cmsSource: "components/legal/LegalPage.tsx:25",
							children: s.ul.map((li) => /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "li",
								cmsSource: "components/legal/LegalPage.tsx:26",
								children: li
							}, li))
						})
					]
				}, s.id))
			})]
		}),
		/* @__PURE__ */ jsx(GlobalPresence, { talk: /* @__PURE__ */ jsx(Talk, {}) })
	] });
}
// src/components/misc/NotFoundPage.tsx
var LINKS = [
	["Services", "/services"],
	["Products", "/products"],
	["Work", "/work"],
	["Blog", "/blog"],
	["Careers", "/careers"],
	["RAPID RESPONSE", "/urgent"]
];
function NotFoundPage() {
	const [intro] = useState(() => performance.now() < 2500 ? ".95s" : ".1s");
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "about-hero nf-hero",
		style: { "--intro": intro },
		cmsTag: "section",
		cmsSource: "components/misc/NotFoundPage.tsx:1",
		children: [/* @__PURE__ */ jsx(CmsElement, {
			className: "hero-blob hero-blob--one",
			"data-parallax": "0.14",
			cmsTag: "div",
			cmsSource: "components/misc/NotFoundPage.tsx:2"
		}), /* @__PURE__ */ jsxs(CmsElement, {
			className: "about-hero-inner nf-inner",
			cmsTag: "div",
			cmsSource: "components/misc/NotFoundPage.tsx:3",
			children: [
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "eyebrow",
					cmsTag: "p",
					cmsSource: "components/misc/NotFoundPage.tsx:4",
					children: [/* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "span",
						cmsSource: "components/misc/NotFoundPage.tsx:5"
					}), " Error 404"]
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "nf-num",
					"aria-hidden": "true",
					cmsTag: "div",
					cmsSource: "components/misc/NotFoundPage.tsx:6",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/misc/NotFoundPage.tsx:7",
							children: "4"
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							className: "nf-o",
							cmsTag: "span",
							cmsSource: "components/misc/NotFoundPage.tsx:8",
							children: "0"
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "span",
							cmsSource: "components/misc/NotFoundPage.tsx:9",
							children: "4"
						})
					]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					"aria-label": "This page wandered off",
					cmsTag: "h1",
					cmsSource: "components/misc/NotFoundPage.tsx:10",
					children: /* @__PURE__ */ jsxs(CmsElement, {
						"aria-hidden": "true",
						cmsTag: "span",
						cmsSource: "components/misc/NotFoundPage.tsx:11",
						children: [/* @__PURE__ */ jsx(SplitWords, { text: "This page" }), /* @__PURE__ */ jsx(SplitWords, {
							text: "wandered off",
							start: 2,
							em: true
						})]
					})
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "about-lede",
					cmsTag: "p",
					cmsSource: "components/misc/NotFoundPage.tsx:12",
					children: "The link may be old or mistyped. Head home or jump to one of these."
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "nf-actions",
					cmsTag: "div",
					cmsSource: "components/misc/NotFoundPage.tsx:13",
					children: [/* @__PURE__ */ jsxs(Button3D, {
						tone: "mint",
						href: "/",
						children: [/* @__PURE__ */ jsx(Home, { size: 16 }), " Back home"]
					}), /* @__PURE__ */ jsxs(Button3D, {
						tone: "paper",
						href: "/start",
						children: ["Start a project ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
					})]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					className: "nf-links",
					cmsTag: "ul",
					cmsSource: "components/misc/NotFoundPage.tsx:14",
					children: LINKS.map(([l, h]) => /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/misc/NotFoundPage.tsx:15",
						children: /* @__PURE__ */ jsxs(CmsElement, {
							href: h,
							cmsTag: "a",
							cmsSource: "components/misc/NotFoundPage.tsx:16",
							children: [
								l,
								" ",
								/* @__PURE__ */ jsx(ArrowRight, {
									size: 14,
									"aria-hidden": true
								})
							]
						})
					}, h))
				})
			]
		})]
	});
}
// src/components/misc/LitePage.tsx
function LitePage() {
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "lite",
		cmsTag: "div",
		cmsSource: "components/misc/LitePage.tsx:1",
		children: [/* @__PURE__ */ jsxs(CmsElement, {
			cmsTag: "header",
			cmsSource: "components/misc/LitePage.tsx:2",
			children: [/* @__PURE__ */ jsx(CmsElement, {
				href: "/",
				className: "lite-brand",
				cmsTag: "a",
				cmsSource: "components/misc/LitePage.tsx:3",
				children: "Sybertron Technologies"
			}), /* @__PURE__ */ jsx(CmsElement, {
				href: "/",
				cmsTag: "a",
				cmsSource: "components/misc/LitePage.tsx:4",
				children: "Full site"
			})]
		}), /* @__PURE__ */ jsxs(CmsElement, {
			id: "main",
			cmsTag: "main",
			cmsSource: "components/misc/LitePage.tsx:5",
			children: [
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h1",
					cmsSource: "components/misc/LitePage.tsx:6",
					children: "Sybertron Technologies"
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/misc/LitePage.tsx:7",
					children: "Websites, apps, AI and marketing for growing businesses. This is the lightweight text version of our site."
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/misc/LitePage.tsx:8",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							href: `mailto:${contactInfo.email}`,
							cmsTag: "a",
							cmsSource: "components/misc/LitePage.tsx:9",
							children: contactInfo.email
						}),
						" · ",
						/* @__PURE__ */ jsx(CmsElement, {
							href: contactInfo.whatsapp,
							cmsTag: "a",
							cmsSource: "components/misc/LitePage.tsx:10",
							children: "WhatsApp"
						}),
						" · ",
						/* @__PURE__ */ jsx(CmsElement, {
							href: "/start",
							cmsTag: "a",
							cmsSource: "components/misc/LitePage.tsx:11",
							children: "Start a project"
						}),
						" · ",
						/* @__PURE__ */ jsx(CmsElement, {
							href: "/urgent",
							cmsTag: "a",
							cmsSource: "components/misc/LitePage.tsx:12",
							children: "RAPID RESPONSE"
						})
					]
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/misc/LitePage.tsx:13",
					children: "Services"
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/misc/LitePage.tsx:14",
					children: SERVICES.map((s) => /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/misc/LitePage.tsx:15",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								href: `/services/${s.id}`,
								cmsTag: "a",
								cmsSource: "components/misc/LitePage.tsx:16",
								children: s.title
							}),
							": ",
							s.desc
						]
					}, s.id))
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/misc/LitePage.tsx:17",
					children: "Products"
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/misc/LitePage.tsx:18",
					children: catalog.map((p) => /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/misc/LitePage.tsx:19",
						children: [
							/* @__PURE__ */ jsx(CmsElement, {
								href: `/products/${p.id}`,
								cmsTag: "a",
								cmsSource: "components/misc/LitePage.tsx:20",
								children: p.name
							}),
							": ",
							p.blurb
						]
					}, p.id))
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/misc/LitePage.tsx:21",
					children: "Articles"
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/misc/LitePage.tsx:22",
					children: posts.map((p) => /* @__PURE__ */ jsx(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/misc/LitePage.tsx:23",
						children: /* @__PURE__ */ jsx(CmsElement, {
							href: `/blog/${p.slug}`,
							cmsTag: "a",
							cmsSource: "components/misc/LitePage.tsx:24",
							children: p.title
						})
					}, p.slug))
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "h2",
					cmsSource: "components/misc/LitePage.tsx:25",
					children: "Company"
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/misc/LitePage.tsx:26",
					children: [
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/misc/LitePage.tsx:27",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: "/about",
								cmsTag: "a",
								cmsSource: "components/misc/LitePage.tsx:28",
								children: "About"
							})
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/misc/LitePage.tsx:29",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: "/work",
								cmsTag: "a",
								cmsSource: "components/misc/LitePage.tsx:30",
								children: "Work"
							})
						}),
						/* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/misc/LitePage.tsx:31",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: "/careers",
								cmsTag: "a",
								cmsSource: "components/misc/LitePage.tsx:32",
								children: "Careers"
							})
						}),
						LEGAL.map((l) => /* @__PURE__ */ jsx(CmsElement, {
							cmsTag: "li",
							cmsSource: "components/misc/LitePage.tsx:33",
							children: /* @__PURE__ */ jsx(CmsElement, {
								href: `/${l.id}`,
								cmsTag: "a",
								cmsSource: "components/misc/LitePage.tsx:34",
								children: l.title
							})
						}, l.id))
					]
				})
			]
		})]
	});
}
// src/components/misc/CookieSettings.tsx
var KEY = "cookie-prefs";
var read = () => {
	try {
		return JSON.parse(localStorage.getItem(KEY) ?? "null");
	} catch {
		return null;
	}
};
function CookieSettings() {
	const [open, setOpen] = useState(false);
	const [banner, setBanner] = useState(false);
	const [prefs, setPrefs] = useState({
		analytics: false,
		marketing: false
	});
	const box = useRef(null);
	useEffect(() => {
		const saved = read();
		if (saved) setPrefs(saved);
		else {
			const t = setTimeout(() => setBanner(true), 2800);
			return () => clearTimeout(t);
		}
	}, []);
	useEffect(() => {
		const onClick = (e) => {
			if (!e.target?.closest("a[href=\"#cookie-settings\"]")) return;
			e.preventDefault();
			setBanner(false);
			setOpen(true);
		};
		document.addEventListener("click", onClick, true);
		return () => document.removeEventListener("click", onClick, true);
	}, []);
	useEffect(() => {
		if (!open) return;
		box.current?.focus();
		const esc = (e) => e.key === "Escape" && setOpen(false);
		window.addEventListener("keydown", esc);
		return () => window.removeEventListener("keydown", esc);
	}, [open]);
	const save = (p) => {
		setPrefs(p);
		try {
			localStorage.setItem(KEY, JSON.stringify(p));
		} catch {}
		setOpen(false);
		setBanner(false);
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [banner && !open && /* @__PURE__ */ jsxs(CmsElement, {
		className: "ck-banner",
		role: "region",
		"aria-label": "Cookie notice",
		cmsTag: "div",
		cmsSource: "components/misc/CookieSettings.tsx:1",
		children: [
			/* @__PURE__ */ jsx(Cookie, {
				size: 20,
				"aria-hidden": true
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "p",
				cmsSource: "components/misc/CookieSettings.tsx:2",
				children: ["We use cookies to run the site and, if you agree, to understand how it is used. ", /* @__PURE__ */ jsx(CmsElement, {
					href: "/cookies",
					cmsTag: "a",
					cmsSource: "components/misc/CookieSettings.tsx:3",
					children: "Cookie policy"
				})]
			}),
			/* @__PURE__ */ jsxs(CmsElement, {
				cmsTag: "div",
				cmsSource: "components/misc/CookieSettings.tsx:4",
				children: [/* @__PURE__ */ jsx(CmsElement, {
					type: "button",
					className: "ck-link",
					onClick: () => setOpen(true),
					cmsTag: "button",
					cmsSource: "components/misc/CookieSettings.tsx:5",
					children: "Settings"
				}), /* @__PURE__ */ jsx(Button3D, {
					tone: "mint",
					onClick: () => save({
						analytics: true,
						marketing: true
					}),
					children: "Accept all"
				})]
			})
		]
	}), open && /* @__PURE__ */ jsx(CmsElement, {
		className: "ck-overlay",
		onMouseDown: (e) => e.target === e.currentTarget && setOpen(false),
		cmsTag: "div",
		cmsSource: "components/misc/CookieSettings.tsx:6",
		children: /* @__PURE__ */ jsxs(CmsElement, {
			className: "ck-modal",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "ck-title",
			tabIndex: -1,
			ref: box,
			cmsTag: "div",
			cmsSource: "components/misc/CookieSettings.tsx:7",
			children: [
				/* @__PURE__ */ jsx(CmsElement, {
					type: "button",
					className: "ck-x",
					"aria-label": "Close",
					onClick: () => setOpen(false),
					cmsTag: "button",
					cmsSource: "components/misc/CookieSettings.tsx:8",
					children: /* @__PURE__ */ jsx(X, { size: 16 })
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					id: "ck-title",
					cmsTag: "h2",
					cmsSource: "components/misc/CookieSettings.tsx:9",
					children: "Cookie settings"
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "p",
					cmsSource: "components/misc/CookieSettings.tsx:10",
					children: "Choose what you are happy with. You can change this any time from the footer."
				}),
				/* @__PURE__ */ jsx(CmsElement, {
					cmsTag: "ul",
					cmsSource: "components/misc/CookieSettings.tsx:11",
					children: [
						[
							"necessary",
							"Necessary",
							"Keep the site working and remember this choice. Always on."
						],
						[
							"analytics",
							"Analytics",
							"Show us which pages are useful so we can improve them."
						],
						[
							"marketing",
							"Marketing",
							"Measure campaigns and show relevant ads elsewhere."
						]
					].map(([k, t, d]) => /* @__PURE__ */ jsxs(CmsElement, {
						cmsTag: "li",
						cmsSource: "components/misc/CookieSettings.tsx:12",
						children: [/* @__PURE__ */ jsxs(CmsElement, {
							cmsTag: "div",
							cmsSource: "components/misc/CookieSettings.tsx:13",
							children: [/* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "h3",
								cmsSource: "components/misc/CookieSettings.tsx:14",
								children: t
							}), /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "p",
								cmsSource: "components/misc/CookieSettings.tsx:15",
								children: d
							})]
						}), /* @__PURE__ */ jsx(CmsElement, {
							type: "button",
							role: "switch",
							"aria-checked": k === "necessary" ? true : prefs[k],
							disabled: k === "necessary",
							className: "ck-switch",
							onClick: () => k !== "necessary" && setPrefs({
								...prefs,
								[k]: !prefs[k]
							}),
							cmsTag: "button",
							cmsSource: "components/misc/CookieSettings.tsx:16",
							children: /* @__PURE__ */ jsx(CmsElement, {
								cmsTag: "i",
								cmsSource: "components/misc/CookieSettings.tsx:17"
							})
						})]
					}, k))
				}),
				/* @__PURE__ */ jsxs(CmsElement, {
					className: "ck-actions",
					cmsTag: "div",
					cmsSource: "components/misc/CookieSettings.tsx:18",
					children: [/* @__PURE__ */ jsx(Button3D, {
						tone: "paper",
						onClick: () => save({
							analytics: false,
							marketing: false
						}),
						children: "Reject optional"
					}), /* @__PURE__ */ jsx(Button3D, {
						tone: "mint",
						onClick: () => save(prefs),
						children: "Save choices"
					})]
				})
			]
		})
	})] });
}
// src/App.tsx
function App() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [headerHidden, setHeaderHidden] = useState(false);
	const { route, path } = useRouter();
	useMotion([
		"product",
		"service",
		"post",
		"legal"
	].includes(route) ? path : route);
	useEffect(() => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const revealItems = document.querySelectorAll("[data-reveal]");
		if (reduceMotion) {
			revealItems.forEach((item) => item.classList.add("is-visible"));
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: .14,
			rootMargin: "0px 0px -8% 0px"
		});
		revealItems.forEach((item) => observer.observe(item));
		let previousY = window.scrollY;
		const updateScroll = () => {
			const currentY = window.scrollY;
			document.documentElement.style.setProperty("--scroll-progress", `${Math.min(1, currentY / (document.documentElement.scrollHeight - window.innerHeight))}`);
			setHeaderHidden(currentY > previousY && currentY > 220);
			previousY = currentY;
		};
		window.addEventListener("scroll", updateScroll, { passive: true });
		updateScroll();
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", updateScroll);
		};
	}, [route, path]);
	if (route === "lite") return /* @__PURE__ */ jsx(LitePage, {});
	return /* @__PURE__ */ jsxs(CmsElement, {
		className: "site-shell",
		cmsTag: "div",
		cmsSource: "App.tsx:1",
		children: [
			/* @__PURE__ */ jsx(CmsElement, {
				className: "curtain",
				"aria-hidden": "true",
				cmsTag: "div",
				cmsSource: "App.tsx:2",
				children: /* @__PURE__ */ jsx(CmsElement, {
					src: "/logo-horizontal-white.svg",
					alt: "",
					cmsTag: "img",
					cmsSource: "App.tsx:3"
				})
			}),
			/* @__PURE__ */ jsx(Cursor, {}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "scroll-progress",
				"aria-hidden": "true",
				cmsTag: "div",
				cmsSource: "App.tsx:4"
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				className: "skip-link",
				href: "#main",
				cmsTag: "a",
				cmsSource: "App.tsx:5",
				children: "Skip to content"
			}),
			/* @__PURE__ */ jsx(Header, {
				hidden: headerHidden && !menuOpen,
				menuOpen,
				setMenuOpen,
				route
			}),
			/* @__PURE__ */ jsx(CmsElement, {
				id: "main",
				cmsTag: "main",
				cmsSource: "App.tsx:6",
				children: route === "about" ? /* @__PURE__ */ jsx(AboutPage, {}) : route === "products" ? /* @__PURE__ */ jsx(ProductsPage, {}) : route === "product" ? /* @__PURE__ */ jsx(ProductDetailPage, {}) : route === "start" ? /* @__PURE__ */ jsx(StartPage, {}) : route === "urgent" ? /* @__PURE__ */ jsx(UrgentPage, {}) : route === "careers" ? /* @__PURE__ */ jsx(CareersPage, {}) : route === "blog" ? /* @__PURE__ */ jsx(BlogPage, {}) : route === "post" ? /* @__PURE__ */ jsx(BlogPostPage, {}) : route === "legal" ? /* @__PURE__ */ jsx(LegalPage, {}) : route === "notfound" ? /* @__PURE__ */ jsx(NotFoundPage, {}) : route === "service" ? /* @__PURE__ */ jsx(ServiceDetailPage, {}) : route === "services" ? /* @__PURE__ */ jsx(ServicesPage, {}) : route === "work" ? /* @__PURE__ */ jsx(WorkPage, {}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx(Hero, {}),
					/* @__PURE__ */ jsx(TechStrip, {}),
					/* @__PURE__ */ jsx(Services, {}),
					/* @__PURE__ */ jsx(Timeline, {}),
					/* @__PURE__ */ jsx(Products, {}),
					/* @__PURE__ */ jsx(Process, {}),
					/* @__PURE__ */ jsx(WaveDivider, {
						from: "#111512",
						to: "#faf8f1"
					}),
					/* @__PURE__ */ jsx(Work, {}),
					/* @__PURE__ */ jsx(Testimonials, {}),
					/* @__PURE__ */ jsx(GlobalPresence, {}),
					/* @__PURE__ */ jsx(WaveDivider, {
						from: "#faf8f1",
						to: "#ffd764"
					}),
					/* @__PURE__ */ jsx(CallToAction, {})
				] })
			}, path),
			/* @__PURE__ */ jsx(Footer, { route }),
			/* @__PURE__ */ jsx(ChatLauncher, {}),
			/* @__PURE__ */ jsx(CookieSettings, {})
		]
	});
}
// src/entry-server.tsx
var routes = [
	"/",
	"/about",
	"/services",
	"/products",
	"/work",
	"/careers",
	"/start",
	"/urgent",
	"/blog",
	"/privacy",
	"/terms",
	"/cookies",
	"/lite",
	...catalog.map((p) => "/products/" + p.id),
	...DETAILS.map((p) => "/services/" + p.id),
	...posts.map((p) => "/blog/" + p.slug)
];
function render(path, snapshot) {
	const fields = /* @__PURE__ */ new Map();
	return {
		html: renderToString(/* @__PURE__ */ jsx(CmsContext.Provider, {
			value: {
				path,
				snapshot,
				collect: (f) => fields.set(f.id, f)
			},
			children: /* @__PURE__ */ jsx(App, {})
		})),
		fields: [...fields.values()]
	};
}
export { render, routes };
