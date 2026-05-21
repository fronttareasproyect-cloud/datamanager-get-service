const API_URL = 'https://dummyjson.com/products';
const DEFAULT_LIMIT = 12;
const FALLBACK_IMAGE = 'https://dummyjson.com/image/400x250/0086f9/ffffff?text=Producto';

const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short' });

const normalizeText = (value = '') =>
  value
    .toString()
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const buildStableDate = (id) => {
  const day = String(((id - 1) % 28) + 1).padStart(2, '0');
  return `2026-04-${day}`;
};

const formatShortDate = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00`);
  const day = date.getDate();
  const month = monthFormatter.format(date).replace('.', '');

  return `${day} ${month.charAt(0).toUpperCase()}${month.slice(1)}`;
};

const getStockStatus = (stock) => {
  if (stock <= 10) {
    return {
      status: 'Stock bajo',
      statusDescription: `${stock} unidades`,
      statusVariant: 'rejected',
    };
  }

  if (stock <= 50) {
    return {
      status: 'Disponible',
      statusDescription: `${stock} unidades`,
      statusVariant: 'destination',
    };
  }

  return {
    status: 'En catálogo',
    statusDescription: `${stock} unidades`,
    statusVariant: 'sent',
  };
};

const mapProductToTableRow = (product) => {
  const isoDate = buildStableDate(product.id);

  return {
    id: String(product.id),
    isoDate,
    date: formatShortDate(isoDate),
    year: '2026',
    concept: product.title,
    payments: product.description,
    beneficiary: product.brand || normalizeText(product.category),
    beneficiaryAccount: `SKU ${product.sku || product.id}`,
    paymentType: normalizeText(product.category),
    amount: product.price,
    currency: 'EUR',
    ...getStockStatus(product.stock ?? 0),
  };
};

const mapProductDetail = (product) => ({
  id: product.id,
  title: product.title,
  description: product.description,
  category: normalizeText(product.category),
  brand: product.brand || 'Marca no informada',
  price: product.price,
  currency: 'EUR',
  discountPercentage: product.discountPercentage,
  rating: product.rating,
  stock: product.stock,
  warrantyInformation: product.warrantyInformation,
  shippingInformation: product.shippingInformation,
  availabilityStatus: product.availabilityStatus,
  thumbnail: product.thumbnail || product.images?.[0] || FALLBACK_IMAGE,
});

export class ProductDatamanager {
  constructor({ fetchClient = (...args) => globalThis.fetch(...args) } = {}) {
    this.fetchClient = fetchClient;
  }

  async getProducts({ limit = DEFAULT_LIMIT, skip = 0, query = '' } = {}) {
    const search = query.trim();
    const url = new URL(search ? `${API_URL}/search` : API_URL);

    url.searchParams.set('limit', limit);
    url.searchParams.set('skip', skip);

    if (search) {
      url.searchParams.set('q', search);
    }

    const response = await this.fetchClient(url);

    if (!response.ok) {
      throw new Error('No se ha podido recuperar el listado de productos.');
    }

    const data = await response.json();

    return {
      rows: data.products.map(mapProductToTableRow),
      total: data.total,
      limit: data.limit,
      skip: data.skip,
    };
  }

  async getProductDetail(productId) {
    const response = await this.fetchClient(`${API_URL}/${productId}`);

    if (!response.ok) {
      throw new Error('No se ha podido recuperar el detalle del producto.');
    }

    return mapProductDetail(await response.json());
  }
}

export const productDatamanager = new ProductDatamanager();
