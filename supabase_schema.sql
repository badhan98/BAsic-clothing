-- BASIC E-COMMERCE POSTGRESQL SCHEMA FOR SUPABASE
-- Drop existing tables to avoid duplicate initialization issues (run as needed)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ROLES
create table if not exists roles (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PERMISSIONS
create table if not exists permissions (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROFILES
create table if not exists profiles (
    id uuid primary key, -- References auth.users
    email varchar(255) unique not null,
    first_name varchar(100),
    last_name varchar(100),
    phone varchar(20),
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ADMINS
create table if not exists admins (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade not null,
    role_id uuid references roles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- 5. CATEGORIES
create table if not exists categories (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    slug varchar(100) unique not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. COLLECTIONS
create table if not exists collections (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    slug varchar(100) unique not null,
    description text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. PRODUCTS
create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    slug varchar(255) unique not null,
    description text,
    base_price decimal(10, 2) not null,
    category_id uuid references categories(id) on delete set null,
    collection_id uuid references collections(id) on delete set null,
    rating decimal(3, 2) default 0.00 not null,
    review_count integer default 0 not null,
    size_guide text,
    fit_recommendation text,
    video_url text,
    is_featured boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. SIZES
create table if not exists sizes (
    id uuid primary key default gen_random_uuid(),
    name varchar(20) not null,
    value varchar(20) unique not null -- e.g. XS, S, M, L, XL
);

-- 9. COLORS
create table if not exists colors (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) not null,
    hex_code varchar(7) unique not null -- e.g. #000000, #FFFFFF
);

-- 10. VARIANTS
create table if not exists variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    sku varchar(100) unique not null,
    price_override decimal(10, 2),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. INVENTORY
create table if not exists inventory (
    id uuid primary key default gen_random_uuid(),
    variant_id uuid references variants(id) on delete cascade not null,
    size_id uuid references sizes(id) on delete cascade not null,
    color_id uuid references colors(id) on delete cascade not null,
    quantity integer default 0 not null,
    warehouse varchar(100) default 'Main Warehouse',
    unique(variant_id, size_id, color_id)
);

-- 12. PRODUCT IMAGES
create table if not exists product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    color_id uuid references colors(id) on delete set null,
    image_url text not null,
    is_primary boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. COUPONS
create table if not exists coupons (
    id uuid primary key default gen_random_uuid(),
    code varchar(50) unique not null,
    type varchar(20) not null check (type in ('percentage', 'fixed_amount')),
    value decimal(10, 2) not null,
    min_order_amount decimal(10, 2) default 0.00 not null,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    active boolean default true not null
);

-- 14. ORDERS
create table if not exists orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete set null,
    status varchar(50) default 'pending' not null check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal decimal(10, 2) not null,
    discount decimal(10, 2) default 0.00 not null,
    tax decimal(10, 2) default 0.00 not null,
    shipping_cost decimal(10, 2) default 0.00 not null,
    total decimal(10, 2) not null,
    coupon_code varchar(50) references coupons(code) on delete set null,
    shipping_address jsonb not null,
    billing_address jsonb not null,
    email varchar(255) not null,
    phone varchar(20) not null,
    tracking_number varchar(100),
    courier_name varchar(100),
    estimated_delivery timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. ORDER ITEMS
create table if not exists order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade not null,
    product_id uuid references products(id) on delete cascade not null,
    variant_id uuid references variants(id) on delete set null,
    quantity integer not null,
    price decimal(10, 2) not null
);

-- 16. PAYMENTS
create table if not exists payments (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade not null,
    gateway varchar(50) not null, -- PayPal, Razorpay, etc.
    transaction_id varchar(255) unique not null,
    status varchar(50) not null, -- pending, captured, failed, refunded
    amount decimal(10, 2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 17. TRANSACTIONS
create table if not exists transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete set null,
    payment_id uuid references payments(id) on delete cascade not null,
    amount decimal(10, 2) not null,
    type varchar(50) not null, -- credit, debit, refund
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 18. WISHLIST
create table if not exists wishlist (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade not null,
    product_id uuid references products(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, product_id)
);

-- 19. CART
create table if not exists cart (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade not null,
    product_id uuid references products(id) on delete cascade not null,
    variant_id uuid references variants(id) on delete cascade,
    quantity integer default 1 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, product_id, variant_id)
);

-- 20. ADDRESSES
create table if not exists addresses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade not null,
    title varchar(50) default 'Home' not null,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    address_line1 text not null,
    address_line2 text,
    city varchar(100) not null,
    state varchar(100) not null,
    postal_code varchar(20) not null,
    country varchar(100) not null,
    is_default boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 21. REVIEWS
create table if not exists reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    user_id uuid references profiles(id) on delete cascade not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    title varchar(150),
    comment text,
    helpful_count integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 22. NEWSLETTER
create table if not exists newsletter (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) unique not null,
    subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 23. LOOKBOOK
create table if not exists lookbook (
    id uuid primary key default gen_random_uuid(),
    title varchar(255) not null,
    description text,
    image_url text not null,
    products_featured uuid[] default '{}'::uuid[] not null, -- Array of product IDs
    category varchar(100) default 'Editorial',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 24. BANNERS
create table if not exists banners (
    id uuid primary key default gen_random_uuid(),
    title varchar(255) not null,
    subtitle text,
    image_url text not null,
    cta_text varchar(100),
    cta_link varchar(255),
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 25. ACTIVITY LOGS
create table if not exists activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete set null,
    action varchar(255) not null,
    details jsonb,
    ip_address varchar(45),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 26. NOTIFICATIONS
create table if not exists notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade not null,
    title varchar(255) not null,
    message text not null,
    read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 27. SUPPORT TICKETS
create table if not exists support_tickets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade not null,
    subject varchar(255) not null,
    message text not null,
    status varchar(50) default 'open' not null check (status in ('open', 'in_progress', 'resolved', 'closed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 28. SETTINGS
create table if not exists settings (
    id uuid primary key default gen_random_uuid(),
    key varchar(100) unique not null,
    value text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS Policies
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Setup basic read/write policies
create policy "Allow public read-access on profiles" on profiles for select using (true);
create policy "Allow users to update own profile" on profiles for update using (auth.uid() = id);

create policy "Allow public read-access on products" on products for select using (true);
create policy "Allow authenticated users to read orders" on orders for select using (auth.uid() = user_id);
create policy "Allow authenticated users to create orders" on orders for insert with check (auth.uid() = user_id);
