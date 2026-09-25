export const mockOrders = [
  {
    id: 'BB-10482',
    date: '18 Sep 2026',
    status: 'Delivered',
    total: 18450,
    itemCount: 3,
    address: '24 Lake View Road, Bengaluru, Karnataka',
    items: [
      { name: 'Premium Red Clay Bricks', productId: 3, quantity: 500, unit: 'pieces', price: 8 },
      { name: 'OPC 53 Grade Cement', productId: 1, quantity: 10, unit: 'bags', price: 420 },
      { name: 'River Sand', productId: 8, quantity: 2, unit: 'tons', price: 5100 },
    ],
  },
  {
    id: 'BB-10476',
    date: '12 Sep 2026',
    status: 'Shipped',
    total: 9200,
    itemCount: 2,
    address: '24 Lake View Road, Bengaluru, Karnataka',
    items: [
      { name: 'TMT Steel Bars 12mm', productId: 2, quantity: 40, unit: 'pieces', price: 180 },
      { name: 'Construction Aggregate', productId: 5, quantity: 2, unit: 'tons', price: 1000 },
    ],
  },
  {
    id: 'BB-10451',
    date: '04 Sep 2026',
    status: 'Processing',
    total: 6750,
    itemCount: 1,
    address: '24 Lake View Road, Bengaluru, Karnataka',
    items: [{ name: 'Wall Putty', productId: 10, quantity: 15, unit: 'bags', price: 450 }],
  },
  {
    id: 'BB-10398',
    date: '27 Aug 2026',
    status: 'Cancelled',
    total: 3200,
    itemCount: 1,
    address: '24 Lake View Road, Bengaluru, Karnataka',
    items: [{ name: 'PVC Plumbing Pipes', productId: 11, quantity: 20, unit: 'pieces', price: 160 }],
  },
];

export const dashboardMetrics = {
  totalOrders: 12,
  activeOrders: 2,
  pendingQuotes: 3,
  activeProjects: 2,
};
