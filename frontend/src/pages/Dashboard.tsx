import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Box, ChevronDown,
  CircleDollarSign, FileClock, LayoutDashboard, Menu, MoreHorizontal, Package,
  Search, Settings, ShoppingCart, Star, Store, Tag, TrendingUp, Users,
} from 'lucide-react';
const money = (value: number) => `${new Intl.NumberFormat('en-US').format(value)} MMK`;

const sellerNav = [
  ['Overview', LayoutDashboard],
  ['Products', Box],
  ['Orders', ShoppingCart],
  ['Inventory', Package],
  ['Analytics', BarChart3],
  ['Storefront', Store],
  ['Reviews', Star],
  ['Promotions', Tag],
  ['Settings', Settings],
];

const adminNav = [
  ['Dashboard', LayoutDashboard],
  ['Users', Users],
  ['Sellers', Store],
  ['Products', Box],
  ['Orders', ShoppingCart],
  ['Payments', CircleDollarSign],
  ['Analytics', BarChart3],
  ['Audit logs', FileClock],
  ['Settings', Settings],
];

interface DashboardProps {
  role: 'seller' | 'admin';
}

export default function Dashboard({ role }: DashboardProps) {
  const [active, setActive] = useState(role === 'seller' ? 'Overview' : 'Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const nav = role === 'seller' ? sellerNav : adminNav;
  const title = role === 'seller' ? 'Seller Studio' : 'Admin Console';

  const stats: [string, string, string, boolean][] =
    role === 'seller'
      ? [
          ['Revenue', '48.6M MMK', '+18.4%', true],
          ['Orders', '1,284', '+12.1%', true],
          ['Avg. order', '378K MMK', '+4.2%', true],
          ['Returns', '2.4%', '-0.8%', false],
        ]
      : [
          ['Revenue', '2.48B MMK', '+24.8%', true],
          ['Orders', '18,492', '+16.2%', true],
          ['Customers', '42,680', '+9.4%', true],
          ['Pending approvals', '28', '+6 today', false],
        ];

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <aside className={`dashboard-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="NOVA home">
            <span className="nova-mark"><span /></span>
            {!collapsed && (
              <span className="text-[13px] font-semibold tracking-[0.23em] text-white">
                NOVA <b className="font-medium text-white/45">COMMERCE</b>
              </span>
            )}
          </Link>
          <button className="icon-btn" onClick={() => setCollapsed(!collapsed)}>
            <Menu size={18} />
          </button>
        </div>
        {!collapsed && (
          <p className="px-7 pb-5 text-[10px] uppercase tracking-[0.2em] text-[#596579]">{title}</p>
        )}
        <nav className="space-y-1 px-3">
          {nav.map(([label, Icon]) => (
            <button
              key={label as string}
              onClick={() => setActive(label as string)}
              className={`dash-nav-link ${active === label ? 'is-active' : ''}`}
            >
              <Icon size={18} />
              {!collapsed && (
                <>
                  <span>{label as string}</span>
                  {label === 'Orders' && <small>12</small>}
                </>
              )}
            </button>
          ))}
        </nav>
        <div className="absolute inset-x-3 bottom-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-[#4d8cff] to-[#8967ff] text-xs font-medium">
                MK
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">
                    {role === 'seller' ? 'Mika K.' : 'Admin Team'}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[#718096]">
                    {role === 'seller' ? 'Lumina Studio' : 'Super administrator'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className={`dashboard-content ${collapsed ? 'is-wide' : ''}`}>
        <header className="flex h-[72px] items-center border-b border-white/[0.06] px-5 md:px-8">
          <div>
            <p className="text-xs text-[#718096]">{title}</p>
            <h1 className="text-lg font-medium">{active}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label className="dash-search">
              <Search size={15} />
              <input placeholder="Search anything..." />
            </label>
            <button className="icon-btn">
              <Bell size={18} />
              <span className="status-dot" />
            </button>
            <Link to="/" className="hidden text-xs text-[#718096] hover:text-white sm:block">
              View store
            </Link>
          </div>
        </header>
        <main className="p-5 md:p-8">
          {active === 'Overview' || active === 'Dashboard' ? (
            <Overview role={role} stats={stats} />
          ) : active === 'Products' || active === 'Users' || active === 'Orders' ? (
            <DataView active={active} role={role} />
          ) : active === 'Audit logs' ? (
            <AuditLogs />
          ) : (
            <Placeholder active={active} />
          )}
        </main>
      </div>
    </div>
  );
}

function Overview({ role, stats }: { role: 'seller' | 'admin'; stats: [string, string, string, boolean][] }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Monday, 26 May</p>
          <h2 className="mt-2 text-2xl font-light md:text-3xl">
            {role === 'seller' ? 'Your store is gaining momentum.' : 'The marketplace at a glance.'}
          </h2>
        </div>
        <button className="btn-secondary !py-2.5">
          Last 30 days <ChevronDown size={14} />
        </button>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, trend, positive]) => (
          <div className="dash-card" key={label}>
            <div className="flex justify-between">
              <p className="text-xs text-[#718096]">{label}</p>
              <span className={positive ? 'trend-up' : 'trend-neutral'}>
                {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
              </span>
            </div>
            <p className="mt-5 text-2xl font-light">{value}</p>
            <div className="sparkline mt-5">
              <i /><i /><i /><i /><i /><i /><i />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="dash-card min-h-[350px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Revenue performance</p>
              <p className="mt-1 text-xs text-[#718096]">Daily revenue across all channels</p>
            </div>
            <MoreHorizontal className="text-[#718096]" size={18} />
          </div>
          <div className="chart-area mt-8">
            <span className="chart-label top-0">50M</span>
            <span className="chart-label top-1/3">35M</span>
            <span className="chart-label top-2/3">20M</span>
            <span className="chart-label bottom-0">5M</span>
            <svg viewBox="0 0 700 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4d8cff" stopOpacity=".3" />
                  <stop offset="1" stopColor="#4d8cff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,190 C70,160 95,175 150,140 S240,105 300,128 S385,120 430,75 S530,115 575,55 S650,70 700,25 L700,220 L0,220 Z" fill="url(#chart)" />
              <path d="M0,190 C70,160 95,175 150,140 S240,105 300,128 S385,120 430,75 S530,115 575,55 S650,70 700,25" fill="none" stroke="#729fff" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="dash-card">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Top products</p>
              <p className="mt-1 text-xs text-[#718096]">By gross revenue</p>
            </div>
            <button className="text-xs text-[#91acff]">View all</button>
          </div>
          <div className="mt-6 space-y-5">
            {[1, 2, 3, 4].map((_, index) => (
              <div className="flex items-center gap-3" key={index}>
                <span className="w-4 text-xs text-[#596579]">0{index + 1}</span>
                <div className="h-10 w-10 rounded-lg bg-[#111724]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs">Product {index + 1}</p>
                  <p className="mt-1 text-[10px] text-[#718096]">{58 - index * 9} units sold</p>
                </div>
                <p className="text-xs">485,000 MMK</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dash-card mt-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Recent orders</p>
            <p className="mt-1 text-xs text-[#718096]">Orders requiring your attention</p>
          </div>
          <button className="text-xs text-[#91acff]">View all orders</button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((index) => (
                <tr key={index}>
                  <td>#NV-{2491 - index}</td>
                  <td>{['Nandar Moe', 'Mika Lin', 'Thet Htar', 'Zin Min', 'Sara K.'][index]}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-[#111724]" />
                      <span>Product {index + 1}</span>
                    </div>
                  </td>
                  <td>{(485000).toLocaleString()} MMK</td>
                  <td>
                    <span className={`table-status ${index === 1 ? 'warning' : index === 3 ? 'neutral' : ''}`}>
                      {index === 1 ? 'Processing' : index === 3 ? 'Pending' : 'Fulfilled'}
                    </span>
                  </td>
                  <td>
                    <MoreHorizontal size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function DataView({ active, role }: { active: string; role: 'seller' | 'admin' }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{role === 'seller' ? 'Store management' : 'Marketplace management'}</p>
          <h2 className="mt-2 text-3xl font-light">{active}</h2>
        </div>
        <button className="btn-primary !py-2.5">
          Add {active.slice(0, -1)} <span className="text-lg">+</span>
        </button>
      </div>
      <div className="dash-card mt-7">
        <div className="flex flex-wrap gap-3">
          <label className="dash-search flex-1 !bg-white/[0.025]">
            <Search size={15} />
            <input placeholder={`Search ${active.toLowerCase()}...`} />
          </label>
          <button className="btn-secondary !py-2.5">
            All status <ChevronDown size={14} />
          </button>
          <button className="btn-secondary !py-2.5">Filters</button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((index) => (
                <tr key={index}>
                  <td>#NV-{2491 - index}</td>
                  <td>{['Nandar Moe', 'Mika Lin', 'Thet Htar', 'Zin Min', 'Sara K.'][index]}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-[#111724]" />
                      <span>Product {index + 1}</span>
                    </div>
                  </td>
                  <td>{(485000).toLocaleString()} MMK</td>
                  <td>
                    <span className={`table-status ${index === 1 ? 'warning' : index === 3 ? 'neutral' : ''}`}>
                      {index === 1 ? 'Processing' : index === 3 ? 'Pending' : 'Fulfilled'}
                    </span>
                  </td>
                  <td>
                    <MoreHorizontal size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function AuditLogs() {
  const events = [
    ['Admin updated product stock', 'Aperture X1 changed from 15 to 25', 'Mika K.', '2 min ago'],
    ['Seller approved for marketplace', 'Lumina Studio is now active', 'Admin Team', '38 min ago'],
    ['Order status updated', 'Order #NV-2488 marked as fulfilled', 'Nandar M.', '1 hr ago'],
    ['Promotion ended', 'After Dark Edit campaign concluded', 'System', '3 hrs ago'],
  ];
  return (
    <>
      <p className="eyebrow">Human-readable history</p>
      <h2 className="mt-2 text-3xl font-light">Audit logs</h2>
      <div className="dash-card mt-7">
        <div className="flex gap-3">
          <label className="dash-search flex-1">
            <Search size={15} />
            <input placeholder="Search activity..." />
          </label>
          <button className="btn-secondary !py-2.5">
            All activity <ChevronDown size={14} />
          </button>
        </div>
        <div className="mt-6 divide-y divide-white/[0.06]">
          {events.map(([title, detail, user, time]) => (
            <div className="flex gap-4 py-5" key={title}>
              <span className="mt-1 grid h-8 w-8 place-content-center rounded-lg bg-[#4d8cff]/10 text-[#91acff]">
                <Activity size={15} />
              </span>
              <div className="flex-1">
                <p className="text-sm">{title}</p>
                <p className="mt-1 text-xs text-[#718096]">{detail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs">{user}</p>
                <p className="mt-1 text-[10px] text-[#596579]">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Placeholder({ active }: { active: string }) {
  return (
    <div className="grid min-h-[65vh] place-content-center text-center">
      <div className="mx-auto grid h-12 w-12 place-content-center rounded-xl bg-white/[0.04]">
        <TrendingUp className="text-[#91acff]" />
      </div>
      <h2 className="mt-5 text-2xl font-light">{active}</h2>
      <p className="mt-2 text-sm text-[#718096]">This workspace is ready for your next action.</p>
    </div>
  );
}