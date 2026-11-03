import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Heart, Instagram, Mail, Menu, MessageCircle, Minus, Music2, Phone, Plus, Ruler, Search, ShoppingBag, SlidersHorizontal,
  Sparkles, X,
} from 'lucide-react';
import brandLogo from './assets/logo-mark.png';
import { brandContact, categories, fabrics, formatPrice, products, whatsappUrl } from './data';
import { useStore } from './store';

const imageHero = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2200&q=90';
const imageCraft = 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85';
const heroCopy = [
  { title: <>HIGH FASHION FOR<br /><span>MINI ICONS.</span></>, sub: 'Thoughtfully tailored, beautifully made outfits for little ones with big personalities.', label: 'Clothing for their kind of wonderful' },
  { title: <>LITTLE OUTFITS.<br /><span>BIG PERSONALITIES.</span></>, sub: 'Made for everyday adventures, family celebrations and all their little in-between moments.', label: 'Made for every little moment' },
];
const shopMenuItems = [
  { title: "Girls' outfits", detail: 'Dresses and little favourites', image: products[0].image, to: '/girls' },
  { title: "Boys' outfits", detail: 'Easy pieces for big days', image: products[1].image, to: '/boys' },
  { title: 'Babywear', detail: 'Soft beginnings, thoughtfully made', image: products[2].image, to: '/baby' },
  { title: 'Everyday favourites', detail: 'Comfort for all their adventures', image: products[4].image, to: '/shop?occasion=Everyday' },
  { title: 'Party & occasion', detail: 'A little extra for special days', image: products[5].image, to: '/shop?occasion=Party' },
  { title: 'Traditional wear', detail: 'Colourful styles made to celebrate', image: products[3].image, to: '/shop?occasion=Traditional' },
];
const pageIntroPaths = new Set(['/shop', '/girls', '/boys', '/baby', '/casual-wear', '/corporate-wear', '/party-wear', '/outing-wear', '/traditional-wear', '/fabrics', '/about', '/account']);

function Logo({ footer = false }) {
  return <Link to="/" className={`brand-mark ${footer ? 'brand-mark-footer' : ''}`} aria-label="The 507 Brand home">
    <img src={brandLogo} alt="" />
    <span className="brand-wordmark"><strong>THE 507 BRAND</strong><small>Little outfits. Big personalities.</small></span>
  </Link>;
}

function Announcement({ className = '' }) {
  return <div className={`announcement ${className}`.trim()}>Beautifully made for little ones <span>·</span> Complimentary delivery on orders over ₦75,000</div>;
}

function Header() {
  const { cart, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [pastHero, setPastHero] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const hasImageHeader = location.pathname === '/' || pageIntroPaths.has(location.pathname);
    if (!hasImageHeader) {
      setPastHero(false);
      return undefined;
    }

    const updateStickyHeader = () => {
      const background = document.querySelector(location.pathname === '/' ? '.hero' : '.page-intro');
      const header = document.querySelector('.site-header-group');
      setPastHero(Boolean(background && header && background.getBoundingClientRect().bottom <= header.offsetHeight + 30));
    };

    updateStickyHeader();
    window.addEventListener('scroll', updateStickyHeader, { passive: true });
    window.addEventListener('resize', updateStickyHeader);
    const root = document.getElementById('root');
    const observer = root ? new MutationObserver(updateStickyHeader) : null;
    observer?.observe(root, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', updateStickyHeader);
      window.removeEventListener('resize', updateStickyHeader);
      observer?.disconnect();
    };
  }, [location.pathname]);

  return <>
    <header className={`site-header-group ${location.pathname === '/' ? 'is-home-header' : ''} ${pageIntroPaths.has(location.pathname) ? 'is-image-page-header' : ''} ${pastHero ? 'is-past-hero' : ''}`}>
      {location.pathname !== '/' && !pageIntroPaths.has(location.pathname) && <Announcement />}
      <div className="site-header">
        <button className="icon-button mobile-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/" end>HOME</NavLink>
          <div className="nav-dropdown">
            <NavLink to="/shop">SHOP <ChevronDown size={13} /></NavLink>
            <div className="mega-menu">
              <div className="mega-menu-heading">
                <div><small>THE 507 SHOP</small><h2>Find their next favourite</h2></div>
                <Link to="/shop" className="mega-view-all">VIEW ALL <ArrowRight size={14} /></Link>
              </div>
              <div className="mega-menu-items">
                {shopMenuItems.map((item) => <Link className="mega-item" to={item.to} key={item.title}>
                  <img src={item.image} alt="" loading="lazy" />
                  <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                  <ArrowUpRight className="mega-item-arrow" size={14} />
                </Link>)}
              </div>
            </div>
          </div>
          <NavLink to="/girls">GIRLS</NavLink><NavLink to="/boys">BOYS</NavLink><NavLink to="/baby">BABY</NavLink>
          <NavLink to="/about">OUR STORY</NavLink>
        </nav>
        <div className="header-actions">
          <Link to="/account" className="icon-button account-link" aria-label="Sign in">SIGN IN</Link>
          <button className="icon-button search-trigger" aria-label="Search" onClick={() => setSearchOpen((open) => !open)}><Search size={19} /></button>
          <Link to="/wishlist" className="icon-button count-icon" aria-label={`Wishlist, ${wishlist.length} items`}><Heart size={19} />{wishlist.length > 0 && <sup>{wishlist.length}</sup>}</Link>
          <Link to="/cart" className="icon-button count-icon" aria-label={`Shopping bag, ${cart.reduce((sum, item) => sum + item.quantity, 0)} items`}><ShoppingBag size={19} />{cart.length > 0 && <sup>{cart.reduce((sum, item) => sum + item.quantity, 0)}</sup>}</Link>
          <Link to="/custom-designer" className="button button-dark header-cta">DESIGN YOUR OUTFIT <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {menuOpen && <motion.div className="mobile-menu-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu}>
        <motion.aside className="mobile-menu" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: .25 }} onClick={(event) => event.stopPropagation()}>
          <div className="mobile-menu-top"><Logo /><button className="icon-button" onClick={closeMenu} aria-label="Close menu"><X /></button></div>
          {['HOME', 'SHOP ALL', 'GIRLS', 'BOYS', 'BABY', 'SIGN IN', 'OUR STORY', 'FABRICS', 'MEASUREMENT GUIDE', 'FAQS'].map((label) => {
            const paths = { HOME: '/', 'SHOP ALL': '/shop', GIRLS: '/girls', BOYS: '/boys', BABY: '/baby', 'SIGN IN': '/account', 'OUR STORY': '/about', FABRICS: '/fabrics', 'MEASUREMENT GUIDE': '/measurement-guide', FAQS: '/faq' };
            const className = label === 'SIGN IN' ? 'mobile-menu-account' : undefined;
            return <Link key={label} to={paths[label]} className={className} onClick={closeMenu}>{label}<ArrowUpRight size={15} /></Link>;
          })}
          <Link to="/custom-designer" className="button button-dark" onClick={closeMenu}>DESIGN YOUR OUTFIT <ArrowUpRight size={15} /></Link>
          <Link to="/contact" className="button button-outline mobile-menu-contact-cta" onClick={closeMenu}>CONTACT US <ArrowUpRight size={15} /></Link>
          <div className="mobile-menu-contact-details" aria-label="Contact details">
            <a href={`tel:${brandContact.phone.replace(/\s/g, '')}`}><Phone size={14} />{brandContact.phone}</a>
            <a href={`mailto:${brandContact.email}`}><Mail size={14} />{brandContact.email}</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={14} />WhatsApp: {brandContact.whatsapp}</a>
          </div>
        </motion.aside>
      </motion.div>}
    </AnimatePresence>
    <AnimatePresence>
      {searchOpen && <motion.form className="search-panel" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={(event) => { event.preventDefault(); window.location.assign(`/shop?q=${encodeURIComponent(search)}`); }}>
        <Search size={19} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What are you looking for?" aria-label="Search products" />
        <button type="submit" className="button button-dark">Search</button><button type="button" className="icon-button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={18} /></button>
      </motion.form>}
    </AnimatePresence>
    {location.pathname !== '/' && <div className="breadcrumb-spacer" />}
  </>;
}

function Footer() {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand"><Logo footer /><p>Thoughtfully tailored little outfits, made for their little moments.</p><div className="footer-contact-links"><a href={`tel:${brandContact.phone.replace(/\s/g, '')}`}><Phone size={13} />{brandContact.phone}</a><a href={`mailto:${brandContact.email}`}><Mail size={13} />{brandContact.email}</a></div><div className="social-links"><a href={brandContact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href={brandContact.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={17} /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={17} /></a></div></div>
      <div className="footer-column"><h3>Explore</h3><Link to="/shop">Shop all</Link><Link to="/girls">Girls</Link><Link to="/boys">Boys</Link><Link to="/baby">Baby</Link><Link to="/custom-designer">Design your outfit</Link></div>
      <div className="footer-column"><h3>Here to help</h3><Link to="/how-it-works">How it works</Link><Link to="/measurement-guide">Measurement guide</Link><Link to="/tracking">Track an order</Link><Link to="/faq">FAQs</Link><Link to="/contact">Contact us</Link></div>
      <div className="footer-newsletter"><h3>A little note from us</h3><p>New collections, thoughtful details and a little inspiration, delivered occasionally.</p><form onSubmit={(event) => { event.preventDefault(); if (!email.includes('@')) { notify('Please enter a valid email address'); return; } setSubmitted(true); setEmail(''); notify('You’re on the list. Thank you!'); }}><input type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required aria-label="Email address" /><button aria-label="Subscribe"><ArrowRight size={18} /></button></form>{submitted && <small className="success-text">Thank you for joining us.</small>}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} The 507 Brand. Made with care.</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><span>Secure, thoughtful shopping</span></div></div>
  </footer>;
}

function ProductCard({ product, index = 0 }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wished = wishlist.some((item) => item.id === product.id);
  const [size, setSize] = useState('');
  return <motion.article className="product-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ delay: index * .04, duration: .45 }}>
    <div className="product-image-wrap">
      <Link to={`/product/${product.id}`} className="product-image-link"><img src={product.image} alt={`${product.name}, children's ${product.category.toLowerCase()} clothing`} loading="lazy" /></Link>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <button className={`wishlist-button ${wished ? 'is-wished' : ''}`} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleWishlist(product)}><Heart size={17} fill={wished ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="product-info"><div><span className="product-category">{product.category} · {product.occasion}</span><Link to={`/product/${product.id}`} className="product-name">{product.name}</Link><span className="product-subtitle">{product.garmentType} · {product.fabric}</span></div><b>{formatPrice(product.price)}</b></div>
    <p className="product-description">{product.description}</p>
    <div className="product-specs"><span>AGES {product.ageRange}</span><span>{product.badge === 'Made to order' ? 'MADE TO ORDER' : 'MADE WITH CARE'}</span></div>
    <div className="product-options"><label htmlFor={`size-${product.id}`}>Choose size</label><select id={`size-${product.id}`} value={size} onChange={(event) => setSize(event.target.value)}><option value="">Select a size</option>{product.sizes.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
    <div className="product-card-footer"><div className="color-dots" aria-label={`Available colours: ${product.colors.join(', ')}`}>{product.colors.slice(0, 4).map((color, i) => <span key={color} title={color} style={{ backgroundColor: ['#c99d91', '#e7dfd1', '#82907a', '#677d91'][i % 4] }} />)}</div><span className="product-colour-count">{product.colors.length} colours</span></div>
    <div className="product-card-actions"><Link to={`/product/${product.id}`} className="product-details-link">View details <ArrowUpRight size={14} /></Link><button className="product-add-button" disabled={!size} onClick={() => addToCart(product, 1, { size })}>{size ? 'Add to bag' : 'Choose size'} <Plus size={14} /></button></div>
  </motion.article>;
}

function SectionHeading({ eyebrow, title, text, link, to = '/shop', center = false }) {
  return <div className={`section-heading ${center ? 'centered' : ''}`}><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>{link && <Link className="text-link" to={to}>{link}<ArrowRight size={16} /></Link>}</div>;
}

function HomePage() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = window.setInterval(() => {
      setSlide((currentSlide) => (currentSlide + 1) % heroCopy.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);
  const copy = heroCopy[slide];
  return <>
    <main>
      <section className="hero">
        <Announcement className="hero-announcement" />
        <img src={imageHero} className="hero-image" alt="Children dressed for a special occasion in timeless, tailored clothing" fetchpriority="high" />
        <div className="hero-shade" />
        <div className="hero-content">
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .3 }}>
              <span className="eyebrow hero-badge">Premium kids bespoke · Ages 0–12</span>
              <h1>{copy.title}</h1>
              <p>{copy.sub}</p>
              <div className="hero-actions"><Link to="/shop" className="button button-light">Explore outfits <ArrowRight size={16} /></Link><Link to="/custom-designer" className="button button-outline-light">Create a custom outfit</Link></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="hero-bottom">
          <div className="hero-footnote"><span>{String(slide + 1).padStart(2, '0')} — {String(heroCopy.length).padStart(2, '0')}</span><span>{copy.label}</span></div>
          <div className="hero-controls"><button onClick={() => setSlide((currentSlide) => (currentSlide - 1 + heroCopy.length) % heroCopy.length)} aria-label="Previous slide"><ChevronLeft size={17} /></button><button onClick={() => setSlide((currentSlide) => (currentSlide + 1) % heroCopy.length)} aria-label="Next slide"><ChevronRight size={17} /></button></div>
        </div>
      </section>

      <section className="section category-section page-gutter">
        <SectionHeading eyebrow="Find their favourite" title="A little something for every little one" text="Thoughtful pieces for big days, ordinary days and all the in-between." link="Shop all" />
        <div className="category-grid">{categories.map((category, index) => <Link className={`category-card category-card-${index + 1}`} to={category.to} key={category.title}>
          <img src={category.image} alt={`${category.title} collection`} loading="lazy" /><div className="category-overlay" /><div className="category-copy"><span>0{index + 1}</span><h3>{category.title}</h3><p>{category.description}</p><b>Explore <ArrowRight size={15} /></b></div>
        </Link>)}</div>
      </section>

      <section className="section featured-section page-gutter">
        <SectionHeading eyebrow="A few favourites" title="Little things, lovely details" link="View all pieces" />
        <div className="product-grid product-grid-4">{products.slice(0, 4).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      </section>

      <section className="custom-promo">
        <div className="custom-promo-image"><img src={imageCraft} alt="Cutting tools and materials on a maker’s worktable" loading="lazy" /><span className="image-caption">The beauty is in the making</span></div>
        <div className="custom-promo-copy"><span className="eyebrow">Made around them</span><h2>Your imagination.<br /><em>Their perfect outfit.</em></h2><p>Why settle for ordinary when you can make something personal? Choose a fabric, pick the little details and let us bring your vision to life.</p><Link to="/custom-designer" className="button button-dark">Design their outfit <ArrowUpRight size={15} /></Link><span className="promo-number">507 / CUSTOM STUDIO</span></div>
      </section>

      <section className="section how-section page-gutter">
        <SectionHeading eyebrow="Made simple" title="A lovely fit, in five little steps" text="A thoughtful process from your first idea to their very own outfit." center />
        <div className="steps-row">{['Choose a style', 'Pick your fabric', 'Make it their own', 'Share their measurements', 'We make it with care'].map((step, i) => <div className="step-item" key={step}><div className="step-marker">{String(i + 1).padStart(2, '0')}</div><h3>{step}</h3>{i < 4 && <ArrowRight className="step-arrow" size={17} />}</div>)}</div>
        <div className="center-link"><Link className="text-link" to="/how-it-works">A closer look at how it works <ArrowRight size={16} /></Link></div>
      </section>

      <section className="measurement-promo page-gutter"><div className="measurement-copy"><span className="eyebrow">A little help with the details</span><h2>Perfect measurements.<br /><em>Beautiful results.</em></h2><p>Taking your child’s measurements can be simple. Our friendly guide walks you through each step, at your own pace.</p><Link to="/measurement-guide" className="button button-dark">Visit the measurement guide <ArrowRight size={16} /></Link></div><Link to="/measurement-guide" className="measurement-photo"><img src={imageCraft} alt="Cutting and measuring tools on a worktable" loading="lazy" /><span className="play-button"><Ruler size={21} /></span><span className="photo-caption">A fit made just for them</span></Link></section>

      <section className="section why-section page-gutter"><SectionHeading eyebrow="The 507 difference" title="Made thoughtfully, worn joyfully" center /><div className="values-grid">{[['01', 'Made to measure', 'A little more care in the fit, so they can be wonderfully themselves.'], ['02', 'Lovely fabrics', 'Comfort-first materials, chosen to feel as good as they look.'], ['03', 'Thoughtful making', 'Considered details and a careful hand in every stitch.'], ['04', 'Made for their magic', 'Pieces that celebrate every little personality.']].map(([n, title, text]) => <div className="value-card" key={n}><span>{n}</span><Sparkles size={20} /><h3>{title}</h3><p>{text}</p></div>)}</div></section>

      <section className="quote-section"><span className="eyebrow light-eyebrow">A note from our little world</span><div className="quote-mark">“</div><blockquote>Every little outfit should feel like it belongs to them.</blockquote><p>Thoughtfully made at The 507 Brand</p></section>

      <section className="section journal-section page-gutter"><SectionHeading eyebrow="From our little world" title="A little inspiration" link="Meet the brand" to="/about" /><div className="journal-grid">{[products[4], products[7], products[2]].map((product, i) => <Link className="journal-card" to={i === 2 ? '/measurement-guide' : '/shop'} key={product.id}><img src={product.image} alt="" loading="lazy" /><span>{['The everyday edit', 'A celebration of colour', 'Soft beginnings'][i]}</span><ArrowUpRight size={17} /></Link>)}</div></section>
    </main>
  </>;
}

function PageIntro({ eyebrow, title, text, image }) {
  return <section className="page-intro has-announcement"><Announcement className="page-intro-announcement" /><div className="page-intro-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{image && <div className="page-intro-image"><motion.img key={image} src={image} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35, ease: 'easeOut' }} /></div>}</section>;
}

function ShopPage() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get('q') || '';
  const category = params.get('category') || (location.pathname === '/girls' ? 'Girls' : location.pathname === '/boys' ? 'Boys' : location.pathname === '/baby' ? 'Baby' : '');
  const [search, setSearch] = useState(query);
  const [sort, setSort] = useState('Featured');
  const [fabric, setFabric] = useState('All fabrics');
  const [age, setAge] = useState('All sizes');
  const routeOccasion = ({ '/casual-wear': 'Everyday', '/corporate-wear': 'Corporate', '/party-wear': 'Party', '/outing-wear': 'Outing', '/traditional-wear': 'Traditional' })[location.pathname];
  const [occasion, setOccasion] = useState(params.get('occasion') || routeOccasion || 'All occasions');
  const filtered = useMemo(() => {
    let result = products.filter((p) => (!category || p.category.toLowerCase() === category.toLowerCase())
      && (!search || `${p.name} ${p.category} ${p.fabric} ${p.garmentType} ${p.occasion}`.toLowerCase().includes(search.toLowerCase()))
      && (occasion === 'All occasions' || p.occasion.toLowerCase().includes(occasion.toLowerCase()))
      && (fabric === 'All fabrics' || p.fabric.toLowerCase().includes(fabric.toLowerCase()))
      && (age === 'All sizes' || p.sizes.includes(age)));
    if (sort === 'Price: low to high') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'Name: A to Z') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, search, occasion, fabric, age, sort]);
  const title = category ? `${category === 'Baby' ? 'Babywear' : `${category}'s collection`}` : 'The little shop';
  const introImage = category
    ? products.find((product) => product.category.toLowerCase() === category.toLowerCase())?.image || products[0].image
    : products[0].image;
  return <main className="page-shell">
    <PageIntro eyebrow="The 507 collection" title={title} text="Beautifully considered pieces for every little personality, every day and every special occasion." image={introImage} />
    <section className="shop-section page-gutter">
      <div className="shop-intro-note"><span className="eyebrow">Little outfits, thoughtfully made</span><p>Browse by collection, find the right size and fabric, and open any piece for all the lovely details.</p></div>
      <div className="shop-toolbar"><span>{filtered.length} {filtered.length === 1 ? 'STYLE' : 'STYLES'} TO EXPLORE</span><div className="shop-controls"><label className="shop-search"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setParams((current) => { if (event.target.value) current.set('q', event.target.value); else current.delete('q'); return current; }); }} placeholder="Search the collection" /></label><button className="filter-trigger" onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal size={16} /> FILTERS <ChevronDown size={14} /></button><label className="sort-select">SORT BY <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option><option>Name: A to Z</option></select></label></div></div>
      <AnimatePresence>{filtersOpen && <motion.div className="filter-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><label>Occasion<select value={occasion} onChange={(event) => setOccasion(event.target.value)}><option>All occasions</option><option>Everyday</option><option>Party</option><option>Birthday</option><option>Traditional</option><option>Corporate</option><option>Outing</option></select></label><label>Collection<select value={category} onChange={(event) => { setParams(event.target.value ? { category: event.target.value } : {}); }}><option value="">All collections</option><option>Girls</option><option>Boys</option><option>Baby</option></select></label><label>Fabric<select value={fabric} onChange={(event) => setFabric(event.target.value)}><option>All fabrics</option>{[...new Set(products.map((product) => product.fabric))].map((item) => <option key={item}>{item}</option>)}</select></label><label>Size<select value={age} onChange={(event) => setAge(event.target.value)}><option>All sizes</option>{[...new Set(products.flatMap((product) => product.sizes))].map((item) => <option key={item}>{item}</option>)}</select></label><button onClick={() => { setSearch(''); setOccasion('All occasions'); setFabric('All fabrics'); setAge('All sizes'); setParams({}); }}>Clear filters</button></motion.div>}</AnimatePresence>
      {filtered.length ? <div className="product-grid">{filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="empty-state"><span className="eyebrow">Nothing just yet</span><h2>We couldn’t find that little something.</h2><p>Try another search or clear your filters.</p><button className="button button-dark" onClick={() => { setSearch(''); setOccasion('All occasions'); setFabric('All fabrics'); setAge('All sizes'); }}>Clear filters</button></div>}
    </section>
  </main>;
}

function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  if (!product) return <NotFound />;
  const wished = wishlist.some((item) => item.id === product.id);
  return <main className="page-shell page-gutter">
    <div className="detail-layout"><div className="detail-gallery"><img className="detail-main-image" src={product.image} alt={product.name} /><div className="detail-thumbnails"><img src={product.image} alt={`${product.name} detail`} /><img src={imageCraft} alt="Craftsmanship detail" /></div></div>
      <div className="detail-copy"><span className="eyebrow">{product.category} · {product.occasion}</span><h1>{product.name}</h1><div className="detail-price">{formatPrice(product.price)} <span>Made with care, to order</span></div><p>{product.description}</p><div className="product-detail-facts"><div><span>STYLE</span><b>{product.garmentType}</b></div><div><span>FABRIC</span><b>{product.fabric}</b></div><div><span>AGE RANGE</span><b>{product.ageRange}</b></div><div><span>COLOURS</span><b>{product.colors.join(', ')}</b></div></div><div className="detail-option"><span>Choose a little size <Link to="/measurement-guide">Size guide <ArrowUpRight size={12} /></Link></span><div className="choice-row">{product.sizes.map((item) => <button key={item} className={size === item ? 'selected' : ''} onClick={() => setSize(item)}>{item}</button>)}</div></div><div className="detail-option"><span>Colour <b>{color || product.colors[0]}</b></span><div className="swatch-row">{product.colors.map((item, i) => <button key={item} className={`swatch ${color === item ? 'selected' : ''}`} style={{ backgroundColor: ['#c99d91', '#e7dfd1', '#82907a', '#677d91'][i % 4] }} onClick={() => setColor(item)} aria-label={item} title={item} />)}</div></div><div className="detail-actions"><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button></div><button className="button button-dark add-cart" onClick={() => { if (!size) return; addToCart(product, quantity, { size, color: color || product.colors[0] }); }}>Add to bag <ArrowRight size={16} /></button><button className={`icon-button detail-wishlist ${wished ? 'is-wished' : ''}`} onClick={() => toggleWishlist(product)} aria-label="Toggle wishlist"><Heart size={19} fill={wished ? 'currentColor' : 'none'} /></button></div>{!size && <small className="form-hint">Choose a size to add this piece to your bag.</small>}<Link className="customise-link" to={`/custom-designer?product=${product.id}`}>Make this design your own <ArrowUpRight size={15} /></Link><div className="detail-perks"><p><Check size={15} /> Thoughtfully made for little ones</p><p><Check size={15} /> Delivery estimate shared at checkout</p><p><Check size={15} /> Questions? <Link to="/contact">We’re right here.</Link></p></div></div></div>
    <section className="section"><SectionHeading eyebrow="More to love" title="A few more little favourites" link="Shop all" /><div className="product-grid product-grid-4">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item, i) => <ProductCard key={item.id} product={item} index={i} />)}</div></section>
  </main>;
}

const ages = ['0–3 months', '3–6 months', '6–12 months', '1–2 years', '3–4 years', '5–6 years', '7–8 years', '9–10 years', '11–12 years'];
const occasions = ['Everyday', 'Birthday', 'Wedding', 'Church', 'Party', 'Traditional', 'School event', 'Something else'];
const garments = {
  Girls: ['Dresses', 'Gowns', 'Skirts & tops', 'Jumpsuits', 'Trouser sets', 'Traditional outfits'],
  Boys: ['Shirt & trousers', 'Shorts set', 'Two-piece set', 'Three-piece suit', 'Waistcoat', 'Traditional outfit'],
  Baby: ['Romper', 'Onesie', 'Baby dress', 'Baby suit', 'Matching set', 'Special occasion babywear'],
};
const measurementFields = {
  Girls: ['Bust / chest', 'Waist', 'Hip', 'Shoulder width', 'Neck', 'Sleeve length', 'Dress length', 'Shoulder to waist'],
  Boys: ['Chest', 'Waist', 'Hip', 'Shoulder width', 'Neck', 'Sleeve length', 'Shirt length', 'Trouser length', 'Inseam', 'Thigh'],
  Baby: ['Chest', 'Waist', 'Hip', 'Shoulder width', 'Arm length', 'Body length', 'Leg length'],
};
const steps = ['Little one', 'The occasion', 'The outfit', 'Lovely fabric', 'A little colour', 'Finishing touches', 'Perfect fit', 'Review'];

function CustomDesigner() {
  const [params] = useSearchParams();
  const linkedProduct = products.find((item) => item.id === params.get('product'));
  const [step, setStep] = useState(0);
  const [unit, setUnit] = useState('cm');
  const [measurements, setMeasurements] = useState({});
  const [reference, setReference] = useState('');
  const [completeOrder, setCompleteOrder] = useState(null);
  const [form, setForm] = useState({
    name: '', age: '', collection: linkedProduct?.category || 'Girls', occasion: '', garment: linkedProduct?.name || '',
    fabric: 'Cotton', color: '', neckline: 'Round', sleeves: 'Short sleeves', details: [], notes: '',
    guardian: '', email: '', phone: '', address: '', state: '', country: 'Nigeria', deliveryDate: '', consent: false,
  });
  const { submitOrder, notify } = useStore();
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const fields = measurementFields[form.collection];
  const convertUnit = (nextUnit) => {
    if (unit === nextUnit) return;
    setMeasurements((current) => Object.fromEntries(Object.entries(current).map(([key, value]) => [
      key,
      value ? (nextUnit === 'cm' ? Number(value) * 2.54 : Number(value) / 2.54).toFixed(2) : '',
    ])));
    setUnit(nextUnit);
  };
  const next = () => {
    if (step === 0 && (!form.name.trim() || !form.age || (form.height && Number(form.height) <= 0))) {
      notify('Add your child’s name and age, and check any height you entered.');
      return;
    }
    if (step === 1 && !form.occasion) {
      notify('Choose an occasion to continue.');
      return;
    }
    if (step === 2 && !form.garment) {
      notify('Choose an outfit style to continue.');
      return;
    }
    if (step === 3 && !form.fabric) {
      notify('Choose a fabric to continue.');
      return;
    }
    if (step === 4 && !form.color) {
      notify('Choose a colour or enter a custom colour.');
      return;
    }
    if (step === 6 && Object.values(measurements).filter((value) => Number.isFinite(Number(value)) && Number(value) > 0).length < 3) {
      notify('Add at least three measurements greater than zero.');
      return;
    }
    if (step === 7) {
      if (!form.guardian.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.phone.trim() || !form.address.trim() || !form.state.trim() || !form.consent) {
        notify('Complete your contact details and consent before submitting.');
        return;
      }
      const saved = submitOrder({ type: 'Custom outfit', child: form.name, details: form, measurements, referenceImage: reference });
      setCompleteOrder(saved);
      return;
    }
    setStep((current) => Math.min(7, current + 1));
  };
  const pickOne = (key, value) => update(key, form[key] === value ? '' : value);
  const addDetail = (value) => update('details', form.details.includes(value) ? form.details.filter((item) => item !== value) : [...form.details, value]);

  if (completeOrder) return <main className="success-page page-gutter"><div className="success-card"><span className="success-icon"><Check size={27} /></span><span className="eyebrow">A little something is on its way</span><h1>Thank you, {form.guardian}.</h1><p>Your custom outfit request has been saved. This is a demo order; no payment or email has been sent.</p><div className="order-reference">YOUR ORDER REFERENCE <strong>{completeOrder.reference}</strong></div><div className="success-next"><b>What happens next?</b><p>Our team would review the design details and follow up to confirm availability, pricing and delivery timing before making begins.</p></div><div className="success-actions"><button className="button button-dark" onClick={() => window.print()}>Print order summary</button><Link className="button button-outline" to="/tracking">Track this request</Link><Link className="text-link" to="/">Back to the little world <ArrowRight size={15} /></Link></div></div></main>;

  return <main className="page-shell custom-page page-gutter">
    <div className="custom-heading"><span className="eyebrow">The 507 custom studio</span><h1>A little something,<br /><em>made just for them.</em></h1><p>Tell us what you’re imagining. We’ll take you through the little details, one step at a time.</p></div>
    <div className="wizard-layout"><div className="wizard-main">
      <div className="wizard-progress"><div className="wizard-track"><span style={{ width: `${(step / 7) * 100}%` }} /></div><div className="wizard-progress-label"><span>STEP {String(step + 1).padStart(2, '0')} OF 08</span><b>{steps[step]}</b></div><div className="wizard-step-names">{steps.map((label, i) => <button className={i === step ? 'active' : i < step ? 'done' : ''} key={label} onClick={() => i < step && setStep(i)} aria-label={`Go to ${label}`}><span>{i < step ? <Check size={12} /> : i + 1}</span></button>)}</div></div>
      <AnimatePresence mode="wait"><motion.section key={step} className="wizard-step" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .2 }}>
        <span className="eyebrow">A few little details first</span>
        <h2>{['Tell us about your little one', 'What are we dressing up for?', 'Choose their little outfit', 'A fabric they’ll love', 'Pick a little colour', 'The finishing touches', 'Let’s get the perfect fit', 'One last look'][step]}</h2>
        <p className="wizard-description">{['We’ll use these details to help make your outfit feel just right.', 'Every little occasion deserves something special.', 'Choose a shape and style to start bringing your idea to life.', 'Soft, lovely materials chosen with little ones in mind.', 'Choose a favourite, or tell us the colour you have in mind.', 'These little details make the outfit uniquely theirs.', 'Use a flexible tape and keep it comfortably snug, not tight.', 'Check the details and tell us how to reach you.'][step]}</p>
        {step === 0 && <div className="wizard-form-grid"><label>Child’s first name <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Their lovely name" required /></label><label>Age group<select value={form.age} onChange={(e) => update('age', e.target.value)}><option value="">Choose age</option>{ages.map((age) => <option key={age}>{age}</option>)}</select></label><label>Collection<select value={form.collection} onChange={(e) => { update('collection', e.target.value); update('garment', ''); }}><option>Girls</option><option>Boys</option><option>Baby</option></select></label><label>Height (optional)<div className="input-with-unit"><input type="number" min="1" value={form.height || ''} onChange={(e) => update('height', e.target.value)} placeholder="e.g. 112" /><span>cm</span></div></label><label className="span-two">Date of birth (optional)<input type="date" value={form.dob || ''} onChange={(e) => update('dob', e.target.value)} /></label></div>}
        {step === 1 && <div className="selection-grid">{occasions.map((item, i) => <button key={item} className={`selection-card ${form.occasion === item ? 'chosen' : ''}`} onClick={() => pickOne('occasion', item)}><span className="selection-index">0{i + 1}</span><b>{item}</b><span>{['For the everyday magic', 'Their very own big day', 'A day to remember', 'A little Sunday best', 'A reason to celebrate', 'A story in every stitch', 'For a day on the calendar', 'Something all your own'][i]}</span>{form.occasion === item && <Check size={16} />}</button>)}</div>}
        {step === 2 && <><div className="collection-tabs">{Object.keys(garments).map((collection) => <button key={collection} className={form.collection === collection ? 'active' : ''} onClick={() => { update('collection', collection); update('garment', ''); }}>{collection}</button>)}</div><div className="selection-grid">{garments[form.collection].map((item, i) => <button key={item} className={`selection-card garment-card ${form.garment === item || form.garment === linkedProduct?.name && item === linkedProduct.name ? 'chosen' : ''}`} onClick={() => pickOne('garment', item)}><span className="selection-index">0{i + 1}</span><b>{item}</b><span>Made with room to move</span>{form.garment === item && <Check size={16} />}</button>)}</div></>}
        {step === 3 && <><div className="fabric-grid">{fabrics.map((fabric) => <button className={`fabric-card ${form.fabric === fabric.name ? 'chosen' : ''}`} key={fabric.name} onClick={() => pickOne('fabric', fabric.name)}><span className="fabric-swatch" style={{ background: fabric.color }} />{form.fabric === fabric.name && <span className="fabric-check"><Check size={13} /></span>}<b>{fabric.name}</b><span>{fabric.detail}</span><small>{fabric.cost}</small></button>)}</div><label className="full-field">Have another fabric in mind? <input value={form.fabricRequest || ''} onChange={(e) => update('fabricRequest', e.target.value)} placeholder="Tell us what you’re looking for" /></label><label className="upload-field">Add a fabric or outfit inspiration photo<input type="file" accept="image/*" onChange={(e) => setReference(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : '')} />{reference && <img className="upload-preview" src={reference} alt="Uploaded design inspiration preview" />}</label></>}
        {step === 4 && <><div className="color-picker">{[['Cream', '#e9e1d6'], ['White', '#fff'], ['Black', '#302d2b'], ['Pink', '#d89ba4'], ['Blue', '#7594ad'], ['Red', '#a94b4a'], ['Yellow', '#d7ba6b'], ['Green', '#71856e'], ['Purple', '#98839d'], ['Brown', '#8a6957'], ['Multicolour', 'linear-gradient(135deg,#d86f78 0 25%,#edcb71 25% 50%,#6a8b7b 50% 75%,#8095ba 75%)']].map(([name, color]) => <button key={name} onClick={() => pickOne('color', name)} className={`color-choice ${form.color === name ? 'chosen' : ''}`}><span style={{ background: color }} />{name}</button>)}</div><label className="full-field">Or tell us a custom colour <input value={form.customColor || ''} onChange={(e) => { update('customColor', e.target.value); update('color', e.target.value ? 'Custom colour' : form.color); }} placeholder="e.g. dusty rose, like a summer sunset" /></label></>}
        {step === 5 && <><div className="wizard-form-grid"><label>Neckline<select value={form.neckline} onChange={(e) => update('neckline', e.target.value)}>{['Round', 'V-neck', 'Square', 'Peter Pan collar', 'High neck'].map((x) => <option key={x}>{x}</option>)}</select></label><label>Sleeves<select value={form.sleeves} onChange={(e) => update('sleeves', e.target.value)}>{['Sleeveless', 'Short sleeves', 'Long sleeves', 'Puff sleeves', 'Flutter sleeves'].map((x) => <option key={x}>{x}</option>)}</select></label><label>Length<select value={form.length || 'Knee length'} onChange={(e) => update('length', e.target.value)}>{['Mini', 'Knee length', 'Midi', 'Maxi', 'As recommended'].map((x) => <option key={x}>{x}</option>)}</select></label><label>Waist detail<select value={form.waist || 'Classic'} onChange={(e) => update('waist', e.target.value)}>{['Classic', 'Bow', 'Sash', 'Elasticated', 'As recommended'].map((x) => <option key={x}>{x}</option>)}</select></label></div><div className="detail-checkboxes"><span>Little extras</span>{['Pockets', 'Buttons', 'Bows', 'Lace details', 'Embroidery', 'Ruffles', 'Pleats'].map((item) => <label key={item}><input type="checkbox" checked={form.details.includes(item)} onChange={() => addDetail(item)} />{item}</label>)}</div><label className="full-field">Anything else you’d love us to know? <textarea rows="3" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="A little note about your idea..." /></label></>}
        {step === 6 && <><div className="unit-toggle"><span>Measurement units</span><div><button type="button" className={unit === 'cm' ? 'active' : ''} onClick={() => convertUnit('cm')}>Centimetres</button><button type="button" className={unit === 'in' ? 'active' : ''} onClick={() => convertUnit('in')}>Inches</button></div></div><div className="measure-grid">{fields.map((field) => <label key={field}>{field} <span className="optional">· optional</span><div className="input-with-unit"><input type="number" min="0.1" step="0.1" value={measurements[field] || ''} onChange={(e) => setMeasurements((m) => ({ ...m, [field]: e.target.value }))} placeholder="0.0" /><span>{unit}</span></div></label>)}</div><p className="measurement-note"><CircleHelp size={17} /> Take measurements over light clothing with a flexible tape. Keep the tape comfortably snug and never pull it tight. Add at least three measurements to continue.</p><label className="upload-field">Add a reference photo if it helps<input type="file" accept="image/*" onChange={(e) => setReference(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : '')} /></label>{reference && <img className="upload-preview" src={reference} alt="Uploaded reference" />}</>}
        {step === 7 && <><div className="review-summary"><div className="review-line"><span>Your little one</span><b>{form.name || '—'} · {form.age || 'Age not selected'} · {form.collection}</b></div><div className="review-line"><span>The occasion</span><b>{form.occasion || '—'} · {form.garment || 'Outfit not selected'}</b></div><div className="review-line"><span>Fabric & colour</span><b>{form.fabric} · {form.customColor || form.color || '—'}</b></div><div className="review-line"><span>Finishing touches</span><b>{form.neckline}, {form.sleeves}{form.details.length ? ` · ${form.details.join(', ')}` : ''}</b></div><div className="review-line"><span>Measurements</span><b>{Object.entries(measurements).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}${unit}`).join(' · ') || 'Not added'}</b></div>{form.notes && <div className="review-line"><span>Your notes</span><b>{form.notes}</b></div>}{reference && <img className="review-image" src={reference} alt="Order reference" />}</div><div className="wizard-form-grid"><label>Parent / guardian name<input value={form.guardian} onChange={(e) => update('guardian', e.target.value)} required /></label><label>Email address<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required /></label><label>Phone number<input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required /></label><label>Preferred delivery date <span className="optional">· optional</span><input type="date" value={form.deliveryDate} onChange={(e) => update('deliveryDate', e.target.value)} /></label><label className="span-two">Delivery address<input value={form.address} onChange={(e) => update('address', e.target.value)} required /></label><label>State<input value={form.state} onChange={(e) => update('state', e.target.value)} required /></label><label>Country<input value={form.country} onChange={(e) => update('country', e.target.value)} required /></label></div><label className="consent-check"><input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />I confirm I’m the parent or guardian and consent to the use of these measurements to fulfil this order.</label><small className="demo-note">This is a demo request. It won’t take payment or send an email.</small></>}
      </motion.section></AnimatePresence>
      <div className="wizard-actions">{step > 0 && <button className="button button-outline" onClick={() => setStep(step - 1)}><ArrowLeft size={15} /> Back</button>}<span>{step < 7 ? 'Your progress is saved as you go' : 'Ready when you are'}</span><button className="button button-dark" onClick={next}>{step === 7 ? 'Submit custom request' : 'Continue'} <ArrowRight size={15} /></button></div>
    </div><aside className="wizard-aside"><span className="eyebrow">Your little design</span><h3>Made just for them.</h3><p>A little preview of the details you’ve chosen so far.</p><div className="aside-preview"><img src={linkedProduct?.image || products[0].image} alt="" /><span>{form.garment || 'Your outfit will take shape here'}</span></div><dl>{[['Little one', form.name || 'Not yet chosen'], ['Occasion', form.occasion || 'Not yet chosen'], ['Fabric', form.fabric || 'Not yet chosen'], ['Colour', form.customColor || form.color || 'Not yet chosen']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><Link to="/measurement-guide" className="aside-help"><Ruler size={16} /> Need help with measurements? <ArrowUpRight size={13} /></Link><small>Final pricing is confirmed after a team member reviews your request.</small></aside></div>
  </main>;
}

function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const [discount, setDiscount] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  if (!cart.length) return <main className="empty-page page-gutter"><span className="eyebrow">Your little bag</span><h1>A little room for something lovely.</h1><p>Your bag is waiting for its first little find.</p><Link className="button button-dark" to="/shop">Explore the collection <ArrowRight size={16} /></Link></main>;
  return <main className="page-shell page-gutter"><div className="cart-heading"><span className="eyebrow">A good choice</span><h1>Your little bag</h1><p>{cart.length} lovely {cart.length === 1 ? 'piece' : 'pieces'} picked out for them.</p></div><div className="cart-layout"><div className="cart-items">{cart.map(({ key, product, quantity, selections }) => <article className="cart-item" key={key}><Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} /></Link><div className="cart-item-copy"><Link to={`/product/${product.id}`} className="product-name">{product.name}</Link><span>Size: {selections.size || 'Custom'} · Colour: {selections.color || product.colors[0]}</span><button className="remove-link" onClick={() => removeFromCart(key)}>Remove</button></div><div className="cart-item-end"><b>{formatPrice(product.price * quantity)}</b><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => updateQuantity(key, quantity - 1)}><Minus size={13} /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => updateQuantity(key, quantity + 1)}><Plus size={13} /></button></div></div></article>)}</div><aside className="order-summary"><span className="eyebrow">The little details</span><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div className="summary-line"><span>Delivery</span><span>Calculated at checkout</span></div><form className="discount-form" onSubmit={(event) => { event.preventDefault(); setDiscountMessage(discount.toUpperCase() === 'LITTLELOVE' ? 'Lovely! We’ll apply this at checkout.' : 'That code isn’t active in this demo.'); }}><input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount code" /><button>Apply</button></form>{discountMessage && <small className="form-hint">{discountMessage}</small>}<div className="summary-line total-line"><span>Estimated total</span><b>{formatPrice(subtotal)}</b></div><Link to="/checkout" className="button button-dark full-button">Continue to checkout <ArrowRight size={16} /></Link><small className="demo-note">A lovely little note: payment is not collected in this demo.</small></aside></div></main>;
}

function CheckoutPage() {
  const { cart, submitOrder, clearCart, notify } = useStore();
  const [submitted, setSubmitted] = useState(null);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', state: '', country: 'Nigeria', delivery: 'Standard delivery', payment: 'Pay on confirmation', notes: '' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  if (submitted) return <main className="success-page page-gutter"><div className="success-card"><span className="success-icon"><Check size={27} /></span><span className="eyebrow">Your order note is with us</span><h1>Thank you, {form.name}.</h1><p>This is a demo checkout. No payment has been taken and no email has been sent.</p><div className="order-reference">ORDER REFERENCE <strong>{submitted.reference}</strong></div><Link className="button button-dark" to="/tracking">Track your order <ArrowRight size={16} /></Link></div></main>;
  if (!cart.length) return <Navigate to="/cart" replace />;
  return <main className="page-shell page-gutter"><div className="cart-heading"><span className="eyebrow">Nearly there</span><h1>Checkout</h1><p>A few details to help your little finds find their way to you.</p></div><form className="checkout-layout" onSubmit={(event) => { event.preventDefault(); const order = submitOrder({ type: 'Ready-to-wear', customer: form, items: cart, total: subtotal, status: 'Order received' }); clearCart(); setSubmitted(order); notify('Your demo order has been received'); }}><div className="checkout-form"><h2>Your details</h2><div className="wizard-form-grid"><label>Full name<input required value={form.name} onChange={(e) => update('name', e.target.value)} /></label><label>Email address<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label><label>Phone number<input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label><label>Country<input required value={form.country} onChange={(e) => update('country', e.target.value)} /></label><label className="span-two">Delivery address<input required value={form.address} onChange={(e) => update('address', e.target.value)} /></label><label>State<input required value={form.state} onChange={(e) => update('state', e.target.value)} /></label><label>Delivery method<select value={form.delivery} onChange={(e) => update('delivery', e.target.value)}><option>Standard delivery</option><option>Express delivery (estimate)</option><option>Arrange with me</option></select></label></div><label className="full-field">Order notes <textarea rows="3" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Anything we should know?" /></label><h2 className="checkout-payment-title">Payment preference</h2><div className="payment-options">{['Pay on confirmation', 'Bank transfer (arranged later)', 'Payment link (arranged later)'].map((option) => <label key={option}><input type="radio" name="payment" checked={form.payment === option} onChange={() => update('payment', option)} />{option}</label>)}</div><p className="demo-note">Demo checkout only. No payment details are requested or stored.</p></div><aside className="order-summary"><span className="eyebrow">The little details</span><h2>Your order</h2>{cart.map((item) => <div className="summary-product" key={item.key}><img src={item.product.image} alt="" /><div><b>{item.product.name}</b><span>{item.quantity} × {formatPrice(item.product.price)}</span></div><b>{formatPrice(item.quantity * item.product.price)}</b></div>)}<div className="summary-line"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div className="summary-line"><span>Delivery</span><span>Confirmed afterwards</span></div><div className="summary-line total-line"><span>Estimated total</span><b>{formatPrice(subtotal)}</b></div><button className="button button-dark full-button" type="submit">Place demo order <ArrowRight size={16} /></button></aside></form></main>;
}

function WishlistPage() {
  const { wishlist } = useStore();
  return <main className="page-shell page-gutter"><div className="cart-heading"><span className="eyebrow">Saved for later</span><h1>Your little wishlist</h1><p>All the lovely pieces you’ve had your eye on.</p></div>{wishlist.length ? <div className="product-grid product-grid-4">{wishlist.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="empty-state"><Heart size={25} /><h2>A little space for your favourites.</h2><p>Tap the heart on anything you love and it’ll be waiting here.</p><Link to="/shop" className="button button-dark">Explore the collection <ArrowRight size={16} /></Link></div>}</main>;
}

const guideSteps = [
  ['Chest', 'Wrap the tape around the fullest part of the chest, keeping it level under the arms.'],
  ['Waist', 'Find the natural waist, usually the narrowest part of the torso. Keep one finger beneath the tape.'],
  ['Shoulder', 'Measure from the edge of one shoulder to the other, following the natural curve.'],
  ['Sleeve', 'With the arm relaxed, measure from the shoulder point to the wrist.'],
  ['Length', 'Measure from the shoulder down to where you would like the garment to finish.'],
];

function MeasurementGuide() {
  return <main className="page-shell"><PageIntro eyebrow="The 507 fit guide" title={<>A lovely fit starts<br /><em>with a little measuring.</em></>} text="You don’t need to be a tailor. Just a soft measuring tape, a few minutes and our simple guide." image={products[2].image} />
    <section className="guide-content page-gutter"><div className="guide-video"><div className="guide-video-image"><img src={imageCraft} alt="A measuring tape laid beside carefully selected fabric" /><span className="guide-play"><Ruler size={25} /></span></div><div><span className="eyebrow">A little video guide</span><h2>Let’s find their lovely fit.</h2><p>A video tutorial can be connected here when you’re ready. For now, follow our friendly step-by-step guide below.</p></div></div>
      <SectionHeading eyebrow="One by one" title="A few helpful measurements" text="Measure over light clothing and keep the tape flat and comfortably snug." />
      <div className="guide-steps">{guideSteps.map(([title, text], i) => <article key={title}><span className="guide-number">0{i + 1}</span><div className="guide-drawing"><div className={`body-line body-line-${i + 1}`} /><span>{title}</span></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      <div className="guide-info-grid"><article><span className="eyebrow">Little ones</span><h3>For babies & toddlers</h3><p>Measure gently while they’re relaxed. Body length and chest are often the most helpful. It’s perfectly fine to ask someone to help hold the tape in place.</p></article><article><span className="eyebrow">Keep it easy</span><h3>Common little mistakes</h3><p>A tape pulled too tight, measuring over bulky layers, or guessing garment length can all affect fit. If you’re unsure, leave us a note and we’ll help.</p></article><article><span className="eyebrow">A quick conversion</span><h3>Centimetres & inches</h3><p>One inch equals 2.54 centimetres. The custom studio converts your measurements whenever you switch units.</p></article></div>
      <div className="guide-cta"><div><span className="eyebrow light-eyebrow">When you’re ready</span><h2>Let’s make something lovely.</h2><p>Your measurements are just one little part of a very personal outfit.</p></div><Link className="button button-light" to="/custom-designer">Start designing <ArrowRight size={16} /></Link></div>
    </section>
  </main>;
}

function TrackingPage() {
  const { orders } = useStore();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const statuses = ['Order received', 'Design confirmation', 'Fabric preparation', 'Cutting', 'Sewing', 'Quality inspection', 'Ready for dispatch', 'Dispatched', 'Delivered'];
  return <main className="page-shell page-gutter tracking-page"><div className="cart-heading"><span className="eyebrow">A little update</span><h1>Track your order</h1><p>Enter your order reference and email to see your order’s latest demo status.</p></div><form className="tracking-form" onSubmit={(event) => { event.preventDefault(); setOrder(orders.find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase() && (item.customer?.email || item.details?.email || '').toLowerCase() === email.toLowerCase()) || orders.find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase()) || null); setSearched(true); }}><label>Order reference<input required value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. 507-1234567" /></label><label>Email address<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><button className="button button-dark">Find my order <ArrowRight size={15} /></button></form>{searched && !order && <div className="tracking-result empty-state"><h2>We couldn’t find that order just yet.</h2><p>Check your reference and try again. Demo orders placed in this browser will appear here.</p></div>}{order && <div className="tracking-result"><div className="tracking-order-head"><div><span className="eyebrow">A little update</span><h2>{order.type || 'Your order'}</h2></div><span className="status-pill">{order.status}</span></div><p>Reference <b>{order.reference}</b> · Submitted {new Date(order.createdAt).toLocaleDateString()}</p><div className="timeline">{statuses.map((status, i) => <div className={`timeline-step ${i === 0 ? 'current' : ''}`} key={status}><span>{i === 0 ? <Check size={13} /> : ''}</span><b>{status}</b></div>)}</div><small className="demo-note">This demo order has not been submitted to a real production team.</small></div>}{!orders.length && <div className="tracking-help"><CircleHelp size={18} /><span>Placed a custom request? Your order reference is shown on the confirmation screen.</span></div>}</main>;
}

function FabricsPage() {
  return <main className="page-shell"><PageIntro eyebrow="Chosen with care" title={<>Lovely fabrics for<br /><em>little lives in motion.</em></>} text="Soft, comfortable materials and thoughtful textures. Our fabric library grows with every little idea." image={imageCraft} /><section className="fabric-library page-gutter"><SectionHeading eyebrow="The fabric library" title="A feel for every occasion" text="A first look at the materials available for custom designs. Final availability and pricing are confirmed with your order." /><div className="fabric-library-grid">{fabrics.map((fabric, i) => <article className="fabric-library-card" key={fabric.name}><div className={`fabric-large-swatch fabric-pattern-${i}`} style={{ backgroundColor: fabric.color }} /><div><span className="eyebrow">{fabric.cost}</span><h3>{fabric.name}</h3><p>{fabric.detail}</p><Link to="/custom-designer" className="text-link">Design with this fabric <ArrowRight size={15} /></Link></div></article>)}</div><div className="fabric-note"><Sparkles size={18} /><p>Have a fabric, print or colour in mind? <Link to="/custom-designer">Share your inspiration</Link> with us in the custom studio.</p></div></section></main>;
}

function AboutPage() {
  return <main className="page-shell"><PageIntro eyebrow="A little about us" title={<>Little beginnings.<br /><em>Beautiful creations.</em></>} text="The 507 Brand is a bespoke children's fashion house creating thoughtful clothing around each little personality. Our story is still being written — one lovely outfit at a time." image={imageHero} /><section className="about-story page-gutter"><div><span className="eyebrow">Our belief</span><h2>Little ones deserve to feel like themselves.</h2></div><div><p>We believe the best clothes are the ones that let children be children. Comfortable enough for the day, considered enough for the moment, and personal enough to feel like theirs.</p><p>At The 507 Brand, every design begins with a little imagination and is shaped by your choices: the fabric, the details and the fit. We’re here to make getting dressed feel a little more special.</p><p className="placeholder-note">We’re saving space here for the real story behind the brand, told in your own words.</p></div></section><section className="mission-grid page-gutter">{[['Our mission', 'To create beautifully made children’s clothing that celebrates comfort, confidence and individual expression.'], ['Our vision', 'A little world where every child can feel seen, comfortable and wonderfully themselves.'], ['Our values', 'Thoughtful making. Kind service. Good fabrics. And a little joy in every detail.']].map(([title, text]) => <article key={title}><span className="eyebrow">The 507 way</span><h3>{title}</h3><p>{text}</p></article>)}</section><div className="about-cta page-gutter"><h2>Ready to make it personal?</h2><Link to="/custom-designer" className="button button-dark">Design their outfit <ArrowRight size={16} /></Link></div></main>;
}

function ContactPage() {
  const { notify } = useStore();
  const [sent, setSent] = useState(false);
  return <main className="page-shell page-gutter contact-page"><div className="contact-intro"><span className="eyebrow">We’re right here</span><h1>A little question?<br /><em>We’d love to help.</em></h1><p>From choosing a fabric to finding the right fit, send us a note and we’ll be happy to help.</p><div className="contact-placeholder"><b>Email</b><a href={`mailto:${brandContact.email}`}>{brandContact.email}</a><b>Call us</b><a href={`tel:${brandContact.phone.replace(/\s/g, '')}`}>{brandContact.phone}</a></div><a className="button button-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat with us on WhatsApp <ArrowUpRight size={15} /></a><div className="contact-socials"><span>Find our little world</span><a href={brandContact.instagram} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a><a href={brandContact.tiktok} target="_blank" rel="noreferrer"><Music2 size={15} /> TikTok</a></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); notify('Thanks for your note. This demo does not send messages.'); }}><h2>Send us a little note</h2><div className="wizard-form-grid"><label>Your name<input required /></label><label>Email address<input type="email" required /></label><label>Phone number <span className="optional">· optional</span><input type="tel" /></label><label>What’s it about?<select><option>Choose a topic</option><option>Custom order</option><option>Product question</option><option>Delivery</option><option>Something else</option></select></label><label className="span-two">Your message<textarea rows="5" required placeholder="Tell us a little about how we can help..." /></label></div><button className="button button-dark">{sent ? 'Note received' : 'Send your note'} <ArrowRight size={16} /></button>{sent && <small className="demo-note">Your message was not sent; connect a contact service to enable delivery.</small>}</form></main>;
}

function FAQPage() {
  const [open, setOpen] = useState(0);
  const faqs = [
    ['How does a custom order work?', 'Choose an occasion, garment, fabric and colour in our custom studio. Share your child’s measurements and contact details, then submit your request. Our team would review the design with you before confirming availability, pricing and timing.'],
    ['How do I take my child’s measurements?', 'Our measurement guide covers the basics with clear descriptions. Use a flexible measuring tape over light clothing and keep it comfortably snug. If you’re unsure, leave a note with your request.'],
    ['Are all pieces made to measure?', 'Our collection includes both ready-to-wear and made-to-order pieces. For a fully personalised fit, use the custom studio and share the measurements requested.'],
    ['How long will my order take?', 'Timing depends on the design, materials and delivery destination. We’ll confirm a delivery estimate before any custom order is accepted.'],
    ['Can I change or cancel an order?', 'For this demo, orders are saved locally and no production is started. In a live service, please contact the brand as soon as possible to discuss changes.'],
    ['Do you ship internationally?', 'Delivery destinations and timelines have not yet been configured. Please contact the brand for current delivery information.'],
  ];
  return <main className="page-shell page-gutter faq-page"><div className="cart-heading"><span className="eyebrow">A few helpful answers</span><h1>Questions, answered.</h1><p>And if you need a little more help, <Link to="/contact">we’re right here.</Link></p></div><div className="faq-list">{faqs.map(([question, answer], i) => <article className={open === i ? 'faq-open' : ''} key={question}><button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span><small>0{i + 1}</small>{question}</span>{open === i ? <Minus size={17} /> : <Plus size={17} />}</button><AnimatePresence>{open === i && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{answer}</p></motion.div>}</AnimatePresence></article>)}</div><Link to="/custom-designer" className="faq-cta">Still have a question? <b>Start a custom request</b> <ArrowRight size={16} /></Link></main>;
}

function HowItWorksPage() {
  const items = [['01', 'Choose their outfit', 'Start with a little idea or pick one of our favourite silhouettes.'], ['02', 'Find a lovely fabric', 'Explore soft cottons, linen blends, prints and occasion details.'], ['03', 'Make it their own', 'Choose colours, finishing touches and the details that feel just right.'], ['04', 'Share their measurements', 'Our easy guide helps you capture a comfortable, considered fit.'], ['05', 'We’ll take it from here', 'We review your request and follow up to confirm the final details.']];
  return <main className="page-shell"><PageIntro eyebrow="A thoughtful little process" title={<>From your idea<br /><em>to their new favourite.</em></>} text="The custom experience is designed to feel simple, personal and full of possibility." image={imageCraft} /><section className="how-page-steps page-gutter">{items.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div><ArrowDown size={18} /></article>)}<Link to="/custom-designer" className="button button-dark">Start your custom design <ArrowRight size={16} /></Link></section></main>;
}

function AccountPage() {
  const { orders, notify } = useStore();
  const [mode, setMode] = useState('Sign in');
  const [submitted, setSubmitted] = useState(false);
  return <main className="page-shell account-page"><PageIntro eyebrow="Your little corner" title="My account" text="Keep your orders and little details together." image={imageHero} /><section className="account-content page-gutter"><div className="account-layout"><form className="account-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); notify('Account access is a demo feature and is not connected yet.'); }}><div className="account-tabs">{['Sign in', 'Create account', 'Forgot password'].map((item) => <button type="button" className={mode === item ? 'active' : ''} key={item} onClick={() => { setMode(item); setSubmitted(false); }}>{item}</button>)}</div><h2>{mode}</h2>{mode === 'Create account' && <label>Your name<input required /></label>}<label>Email address<input type="email" required /></label>{mode !== 'Forgot password' && <label>Password<input type="password" minLength="6" required /></label>}<button className="button button-dark full-button">{mode}</button>{submitted && <small className="demo-note">Authentication needs to be connected before accounts can be created.</small>}</form><div className="account-orders"><span className="eyebrow">Recent orders</span><h2>Your order notes</h2>{orders.length ? orders.slice(0, 3).map((order) => <div className="account-order" key={order.reference}><b>{order.reference}</b><span>{order.type || 'Order'} · {order.status}</span><Link to="/tracking">Track <ArrowRight size={13} /></Link></div>) : <div className="account-empty"><p>Your order history will appear here once you place a demo order.</p><Link to="/shop" className="text-link">Explore the collection <ArrowRight size={14} /></Link></div>}<div className="account-feature-note"><Ruler size={17} /><div><b>Little ones grow in a blink.</b><p>Saved child profiles and measurements will be available when accounts are connected.</p></div></div></div></div></section></main>;
}

function OrdersPage() {
  const { orders } = useStore();
  return <main className="page-shell page-gutter"><div className="cart-heading"><span className="eyebrow">Made with care</span><h1>My orders</h1><p>Your little requests and order notes in one place.</p></div>{orders.length ? <div className="orders-list">{orders.map((order) => <article key={order.reference}><div><span className="eyebrow">{order.type || 'Order'}</span><h2>{order.reference}</h2><p>{new Date(order.createdAt).toLocaleDateString()} · {order.status}</p></div><Link to="/tracking" className="button button-outline">Track order <ArrowRight size={14} /></Link></article>)}</div> : <div className="empty-state"><h2>No orders just yet.</h2><p>Once you’ve placed a little request, you’ll find it here.</p><Link className="button button-dark" to="/shop">Explore the collection</Link></div>}</main>;
}

function LegalPage({ privacy = false }) {
  const title = privacy ? 'Privacy, with care.' : 'A few terms to know.';
  return <main className="page-shell legal-page page-gutter"><span className="eyebrow">The important little details</span><h1>{title}</h1><p className="legal-intro">This site is a front-end demonstration. The policies below are starter information, not legal advice or a substitute for the final policies of the business.</p><div className="legal-copy"><h2>{privacy ? 'Information and children’s measurements' : 'Using this demo'}</h2><p>{privacy ? 'Custom order details entered in this demonstration are stored only in your browser’s local storage to support the demo experience. Do not enter sensitive personal information. A production service should collect only information needed to fulfil an order and should provide appropriate parent or guardian consent, security, retention and deletion controls.' : 'Product availability, prices, delivery estimates and order statuses are illustrative. Submitting a form in this demonstration does not place a production order or create a payment obligation.'}</p><h2>Contact and updates</h2><p>Business contact details, delivery terms, returns information and final privacy practices should be supplied by the brand owner before launch. No real email, payment or fulfilment service is connected.</p><h2>Questions</h2><p>For more information, use the <Link to="/contact">contact page</Link> once the brand’s contact details have been configured.</p></div></main>;
}

function NotFound() {
  return <main className="empty-page page-gutter"><span className="eyebrow">A little detour</span><h1>We can’t find that page.</h1><p>Let’s help you find your way back to something lovely.</p><Link className="button button-dark" to="/">Back to the little world <ArrowRight size={16} /></Link></main>;
}

function Toast() {
  const { notice } = useStore();
  return <AnimatePresence>{notice && <motion.div className="toast-message" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><Check size={16} />{notice}</motion.div>}</AnimatePresence>;
}

function App() {
  const location = useLocation();
  return <><Header /><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} /><Route path="/girls" element={<ShopPage />} /><Route path="/boys" element={<ShopPage />} /><Route path="/baby" element={<ShopPage />} />
      <Route path="/casual-wear" element={<ShopPage />} /><Route path="/corporate-wear" element={<ShopPage />} /><Route path="/party-wear" element={<ShopPage />} /><Route path="/outing-wear" element={<ShopPage />} /><Route path="/traditional-wear" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/custom-designer" element={<CustomDesigner />} /><Route path="/measurement-guide" element={<MeasurementGuide />} /><Route path="/fabrics" element={<FabricsPage />} />
      <Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/account" element={<AccountPage />} /><Route path="/orders" element={<OrdersPage />} /><Route path="/tracking" element={<TrackingPage />} />
      <Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/faq" element={<FAQPage />} /><Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/privacy" element={<LegalPage privacy />} /><Route path="/terms" element={<LegalPage />} /><Route path="*" element={<NotFound />} />
    </Routes>
  </motion.div></AnimatePresence><Footer /><Toast /></>;
}

export default App;
