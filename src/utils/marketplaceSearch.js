import { categoryHierarchy, products, vendors } from '../data/products';

const text = (value) => String(value || '').toLowerCase();

export function getVendorCatalog() {
  return vendors.map((vendor) => {
    const vendorProducts = products.filter((product) => (
      product.vendorOffers?.some((offer) => offer.vendorId === vendor.id)
    ));
    return {
      ...vendor,
      productCount: vendorProducts.length,
      categoryCount: new Set(vendorProducts.map((product) => product.category)).size,
    };
  });
}

export function searchMarketplace(query, limit = 5, additionalProducts = []) {
  const normalizedQuery = text(query).trim();
  if (normalizedQuery.length < 2) return { products: [], vendors: [], categories: [] };
  const marketplaceProducts = [...products, ...additionalProducts];

  const matchingProducts = marketplaceProducts
    .filter((product) => {
      const category = categoryHierarchy.find((entry) => entry.id === product.category);
      const subcategory = category?.subcategories?.find((entry) => entry.id === product.subcategoryId);
      const searchable = [
        product.name,
        product.brand,
        product.supplier,
        product.location,
        category?.name,
        subcategory?.name,
        ...(product.vendorOffers || []).flatMap((offer) => [offer.location, offer.supplier]),
      ];
      return searchable.some((value) => text(value).includes(normalizedQuery));
    })
    .slice(0, limit)
    .map((product) => ({
      type: 'product',
      id: product.id,
      name: product.name,
      meta: `From ₹${Number(product.price).toLocaleString('en-IN')} · ${product.vendorOffers?.length || 1} suppliers`,
    }));

  const matchingVendors = vendors
    .filter((vendor) => {
      const vendorProducts = products.filter((product) => (
        product.vendorOffers?.some((offer) => offer.vendorId === vendor.id)
      ));
      const categoryNames = vendorProducts.flatMap((product) => {
        const category = categoryHierarchy.find((entry) => entry.id === product.category);
        const subcategory = category?.subcategories?.find((entry) => entry.id === product.subcategoryId);
        return [category?.name, subcategory?.name, product.name];
      });
      return [vendor.name, vendor.brand, vendor.location, vendor.city, vendor.state, ...categoryNames]
        .some((value) => text(value).includes(normalizedQuery));
    })
    .slice(0, limit)
    .map((vendor) => ({
      type: 'vendor',
      id: vendor.id,
      name: vendor.name,
      meta: `${vendor.location} · ${vendor.verified ? 'Verified' : 'Supplier'}`,
    }));

  const matchingCategories = categoryHierarchy.flatMap((category) => {
    const categoryMatches = text(category.name).includes(normalizedQuery);
    const categoryResult = categoryMatches ? [{
      type: 'category',
      id: category.id,
      name: category.name,
      meta: `${category.count}+ products`,
      categoryId: category.id,
    }] : [];
    const subcategoryResults = (category.subcategories || [])
      .filter((subcategory) => text(subcategory.name).includes(normalizedQuery))
      .map((subcategory) => ({
        type: 'category',
        id: subcategory.id,
        name: subcategory.name,
        meta: category.name,
        categoryId: category.id,
        subcategoryId: subcategory.id,
      }));
    return [...categoryResult, ...subcategoryResults];
  }).slice(0, limit);

  return { products: matchingProducts, vendors: matchingVendors, categories: matchingCategories };
}

export function flattenSearchResults(results) {
  return [
    ...results.products,
    ...results.vendors,
    ...results.categories,
  ];
}
