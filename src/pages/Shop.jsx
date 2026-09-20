import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Grid3X3, List, MapPin } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories, marketplaceLocations, vendors } from '../data/products';
import './Shop.css';

const priceRanges = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 – ₹500', min: 100, max: 500 },
  { label: '₹500 – ₹2,000', min: 500, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: Infinity },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

const brands = ['UltraTech', 'ACC', 'SAIL', 'Vizag Steel', 'Berger', 'Asian Paints', 'Kajaria', 'Dr. Fixit', 'Prince Pipes', 'Stanley', 'Anchor', 'StoneAge'];
const locations = marketplaceLocations;
const ratingOptions = [4.5, 4.0, 3.5, 3.0];

function FilterAccordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || '';
  const initialSubcategory = searchParams.get('subcat') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCats, setSelectedCats] = useState(initialCat ? [initialCat] : []);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState(initialLocation ? [initialLocation] : []);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [minimumRating, setMinimumRating] = useState(null);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleItem = (arr, setArr, item) => {
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const updateCategoryUrl = (categoryId = '', subcategoryId = '') => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryId) nextParams.set('cat', categoryId);
    else nextParams.delete('cat');
    if (subcategoryId) nextParams.set('subcat', subcategoryId);
    else nextParams.delete('subcat');
    setSearchParams(nextParams);
  };

  const selectCategory = (categoryId) => {
    const isSelected = selectedCats.length === 1 && selectedCats[0] === categoryId && !selectedSubcategory;
    const nextCategory = isSelected ? '' : categoryId;
    setSelectedCats(nextCategory ? [nextCategory] : []);
    setSelectedSubcategory('');
    updateCategoryUrl(nextCategory);
  };

  const selectSubcategory = (categoryId, subcategoryId) => {
    const isSelected = selectedSubcategory === subcategoryId;
    const nextSubcategory = isSelected ? '' : subcategoryId;
    setSelectedCats(nextSubcategory ? [categoryId] : []);
    setSelectedSubcategory(nextSubcategory);
    updateCategoryUrl(categoryId, nextSubcategory);
  };

  const clearCategorySelection = () => {
    setSelectedCats([]);
    setSelectedSubcategory('');
    updateCategoryUrl();
  };

  const clearFilters = () => {
    setSelectedCats([]);
    setSelectedSubcategory('');
    setSelectedBrands([]);
    setSelectedLocations([]);
    setSelectedVendors([]);
    setPriceRange(null);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setMinimumRating(null);
    setSearch('');
    updateCategoryUrl();
  };

  const activeFilterCount = selectedCats.length + (selectedSubcategory ? 1 : 0) + selectedBrands.length + selectedLocations.length + selectedVendors.length
    + (priceRange ? 1 : 0) + (inStockOnly ? 1 : 0) + (onSaleOnly ? 1 : 0) + (minimumRating ? 1 : 0);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase()));
    if (selectedSubcategory) {
      result = result.filter(p => p.subcategoryId === selectedSubcategory);
    } else if (selectedCats.length) {
      result = result.filter(p => selectedCats.includes(p.category));
    }
    if (selectedBrands.length) {
      result = result.filter((product) => (
        selectedBrands.includes(product.brand)
        || product.vendorOffers?.some((offer) => selectedBrands.includes(offer.brand))
      ));
    }
    result = result.filter((product) => {
      const offers = product.vendorOffers || [];
      const matchingOffers = offers.filter((offer) => {
        const locationMatches = !selectedLocations.length || selectedLocations.includes(offer.location);
        const vendorMatches = !selectedVendors.length || selectedVendors.includes(offer.vendorId);
        return locationMatches && vendorMatches;
      });
      if (!matchingOffers.length) return false;
      if (priceRange && !matchingOffers.some((offer) => Number(offer.price) >= priceRange.min && Number(offer.price) <= priceRange.max)) return false;
      if (inStockOnly && !matchingOffers.some((offer) => offer.inStock)) return false;
      if (onSaleOnly && !matchingOffers.some((offer) => offer.badge === 'sale')) return false;
      if (minimumRating && Number(product.rating) < minimumRating) return false;
      return true;
    }).map((product) => {
        const regionalOffers = (product.vendorOffers || []).filter((offer) => {
          const locationMatches = !selectedLocations.length || selectedLocations.includes(offer.location);
          const vendorMatches = !selectedVendors.length || selectedVendors.includes(offer.vendorId);
          return locationMatches && vendorMatches;
        });
        const lowestOffer = regionalOffers.reduce(
          (lowest, offer) => Number(offer.price) < Number(lowest.price) ? offer : lowest,
          regionalOffers[0]
        );
        return {
          ...product,
          vendorOffers: regionalOffers,
          supplier: lowestOffer.supplier,
          location: lowestOffer.location,
          price: lowestOffer.price,
          originalPrice: lowestOffer.originalPrice,
          unit: lowestOffer.unit,
          inStock: regionalOffers.some((offer) => offer.inStock),
          badge: lowestOffer.badge,
        };
      });

    switch(sort) {
      case 'price-asc': result.sort((a,b) => a.price - b.price); break;
      case 'price-desc': result.sort((a,b) => b.price - a.price); break;
      case 'rating': result.sort((a,b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [search, selectedCats, selectedSubcategory, selectedBrands, selectedLocations, selectedVendors, priceRange, inStockOnly, onSaleOnly, minimumRating, sort]);

  const selectedCategory = categories.find((category) => category.id === selectedCats[0]);
  const selectedSubcategoryData = selectedCategory?.subcategories?.find(
    (subcategory) => subcategory.id === selectedSubcategory
  );
  const subcategoryProductCount = (subcategoryId) => products.filter(
    (product) => product.subcategoryId === subcategoryId
  ).length;

  const FilterPanel = () => (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filters</h3>
        {activeFilterCount > 0 && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterAccordion title="Category">
        <div className="filter-options">
          {categories.map(cat => (
            <label key={cat.id} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedCats.includes(cat.id)}
                onChange={() => selectCategory(cat.id)}
              />
              <span>{cat.name}</span>
              <span className="filter-count">{products.filter(p => p.category === cat.id).length}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Price Range">
        <div className="filter-options">
          {priceRanges.map((range, i) => (
            <label key={i} className="filter-radio">
              <input
                type="radio"
                name="priceRange"
                checked={priceRange?.label === range.label}
                onChange={() => setPriceRange(priceRange?.label === range.label ? null : range)}
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Brand">
        <div className="filter-options">
          {brands.map(brand => (
            <label key={brand} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Location / Region">
        <div className="filter-options">
          {locations.map(loc => (
            <label key={loc} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedLocations.includes(loc)}
                onChange={() => toggleItem(selectedLocations, setSelectedLocations, loc)}
              />
              <span>{loc}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Vendor">
        <div className="filter-options">
          {vendors.map(vendor => (
            <label key={vendor.id} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor.id)}
                onChange={() => toggleItem(selectedVendors, setSelectedVendors, vendor.id)}
              />
              <span>{vendor.name}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Availability">
        <div className="filter-options">
          <label className="filter-checkbox">
            <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)}/>
            <span>In Stock Only</span>
          </label>
          <label className="filter-checkbox">
            <input type="checkbox" checked={onSaleOnly} onChange={e => setOnSaleOnly(e.target.checked)}/>
            <span>On Sale</span>
          </label>
        </div>
      </FilterAccordion>

      <FilterAccordion title="Minimum Rating" defaultOpen={false}>
        <div className="filter-options">
          {ratingOptions.map(r => (
            <label key={r} className="filter-radio">
              <input
                type="radio"
                name="rating"
                checked={minimumRating === r}
                onChange={() => setMinimumRating(minimumRating === r ? null : r)}
              />
              <span>{'★'.repeat(Math.floor(r))} {r}+ and above</span>
            </label>
          ))}
        </div>
      </FilterAccordion>
    </div>
  );

  return (
    <div className="shop-page">
      {/* Shop header */}
      <div className="shop-hero">
        <div className="container">
          <h1 className="shop-title">Shop Construction Materials</h1>
          <p className="shop-subtitle">1,000+ products from verified suppliers across India</p>

          <div className="marketplace-location-control">
            <MapPin size={15} />
            <span>Near you</span>
            <select
              value={selectedLocations[0] || ''}
              onChange={(event) => setSelectedLocations(event.target.value ? [event.target.value] : [])}
              aria-label="Filter marketplace by location"
            >
              <option value="">All locations</option>
              {marketplaceLocations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="shop-search-bar">
            <Search size={18} color="#9CA3AF"/>
            <input
              type="text"
              placeholder="Search by material, brand, or supplier..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}><X size={14}/></button>}
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="active-filters">
              {selectedCats.map(c => (
                <span key={c} className="filter-pill">
                  {categories.find(cat => cat.id === c)?.name}
                  <button onClick={() => toggleItem(selectedCats, setSelectedCats, c)}><X size={11}/></button>
                </span>
              ))}
              {selectedSubcategory && selectedSubcategoryData && (
                <span className="filter-pill">
                  {selectedSubcategoryData.name}
                  <button onClick={() => selectSubcategory(selectedCategory.id, selectedSubcategory)}><X size={11}/></button>
                </span>
              )}
              {selectedBrands.map(b => (
                <span key={b} className="filter-pill">
                  {b}
                  <button onClick={() => toggleItem(selectedBrands, setSelectedBrands, b)}><X size={11}/></button>
                </span>
              ))}
              {selectedLocations.map(location => (
                <span key={location} className="filter-pill">
                  Near {location}
                  <button onClick={() => setSelectedLocations([])}><X size={11}/></button>
                </span>
              ))}
              {selectedVendors.map(vendorId => (
                <span key={vendorId} className="filter-pill">
                  {vendors.find(vendor => vendor.id === vendorId)?.name}
                  <button onClick={() => toggleItem(selectedVendors, setSelectedVendors, vendorId)}><X size={11}/></button>
                </span>
              ))}
              {minimumRating && (
                <span className="filter-pill">
                  {minimumRating}+ rating
                  <button onClick={() => setMinimumRating(null)}><X size={11}/></button>
                </span>
              )}
              {priceRange && (
                <span className="filter-pill">
                  {priceRange.label}
                  <button onClick={() => setPriceRange(null)}><X size={11}/></button>
                </span>
              )}
              {inStockOnly && <span className="filter-pill">In Stock <button onClick={() => setInStockOnly(false)}><X size={11}/></button></span>}
              {onSaleOnly && <span className="filter-pill">On Sale <button onClick={() => setOnSaleOnly(false)}><X size={11}/></button></span>}
              <button className="filter-pill clear-all" onClick={clearFilters}>Clear All</button>
            </div>
          )}
        </div>
      </div>

      <div className="container shop-layout">
        {/* Desktop Filter Sidebar */}
        <aside className="filter-sidebar">
          <FilterPanel />
        </aside>

        {/* Product area */}
        <main className="products-area">
          {(selectedCategory || selectedSubcategory) && (
            <nav className="marketplace-breadcrumb" aria-label="Marketplace breadcrumb">
              <button type="button" onClick={clearCategorySelection}>All Categories</button>
              <span>→</span>
              {selectedCategory && (
                <>
                  <button type="button" onClick={() => selectCategory(selectedCategory.id)}>
                    {selectedCategory.name}
                  </button>
                  {selectedSubcategoryData && (
                    <>
                      <span>→</span>
                      <span className="current">{selectedSubcategoryData.name}</span>
                    </>
                  )}
                </>
              )}
            </nav>
          )}

          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="results-count">
              <strong>{filtered.length}</strong> products found
            </div>
            <div className="toolbar-right">
              <button className="mobile-filter-btn" onClick={() => setMobileFiltersOpen(true)}>
                <SlidersHorizontal size={16}/> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="view-toggle">
                <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>
                  <Grid3X3 size={16}/>
                </button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
                  <List size={16}/>
                </button>
              </div>
            </div>
          </div>

          {/* Category discovery */}
          <section className="category-discovery" aria-labelledby="category-discovery-title">
            <div className="category-discovery-header">
              <div>
                <p className="section-label">Browse materials</p>
                <h2 id="category-discovery-title">Construction categories</h2>
              </div>
              <span className="category-discovery-count">{categories.length} categories</span>
            </div>
            <div className="cat-pills">
            <button
              className={`cat-pill ${selectedCats.length === 0 ? 'active' : ''}`}
              onClick={clearCategorySelection}
            >
              <span className="cat-pill-icon" aria-hidden="true">▦</span>
              <span>All materials</span>
            </button>
            {categories.map(cat => {
              const productCount = cat.count ?? products.filter(product => product.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  className={`cat-pill ${selectedCats.includes(cat.id) ? 'active' : ''}`}
                  onClick={() => selectCategory(cat.id)}
                >
                  <span className="cat-pill-icon" aria-hidden="true">{cat.icon || '•'}</span>
                  <span className="cat-pill-content">
                    <span>{cat.name}</span>
                    <small>{productCount} products</small>
                  </span>
                </button>
              );
            })}
            </div>
            {selectedCategory?.subcategories?.length > 0 && (
              <div className="subcategory-discovery">
                <div className="subcategory-heading">
                  <span>{selectedCategory.name} subcategories</span>
                  {selectedSubcategory && (
                    <button type="button" onClick={() => selectCategory(selectedCategory.id)}>
                      View all {selectedCategory.name}
                    </button>
                  )}
                </div>
                <div className="subcategory-pills">
                  {selectedCategory.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className={`subcategory-pill ${selectedSubcategory === subcategory.id ? 'active' : ''}`}
                      onClick={() => selectSubcategory(selectedCategory.id, subcategory.id)}
                    >
                      <span>{subcategory.name}</span>
                      <small>{subcategoryProductCount(subcategory.id)} products</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn-primary" onClick={clearFilters}>Clear All Filters</button>
            </div>
          ) : (
            <div className={`products-grid ${view}`}>
              {filtered.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  compact={view === 'list'}
                  onClick={() => navigate(`/shop/${p.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="mobile-filter-overlay" onClick={() => setMobileFiltersOpen(false)}>
          <div className="mobile-filter-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-filter-header">
              <h3>Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X size={20}/></button>
            </div>
            <div className="mobile-filter-body">
              <FilterPanel />
            </div>
            <div className="mobile-filter-footer">
              <button className="btn-outline" onClick={clearFilters}>Clear All</button>
              <button className="btn-primary" onClick={() => setMobileFiltersOpen(false)}>
                Show {filtered.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
