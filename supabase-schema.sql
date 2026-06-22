-- =============================================
-- HOTEL CALENDAR – Supabase SQL Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------------------------
-- ROOMS
-- -----------------------------------------------
create table if not exists rooms (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  number      text not null,
  name        text not null,
  category    text not null default 'standard',
  capacity    int  not null default 2,
  price_per_night numeric not null default 0,
  color       text not null default '#3b82f6',
  floor       int,
  amenities   text[] default '{}',
  active      boolean default true,
  created_at  timestamptz default now()
);
alter table rooms enable row level security;
create policy "owner access" on rooms for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- GUESTS
-- -----------------------------------------------
create table if not exists guests (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  first_name  text not null,
  last_name   text not null default '',
  phone       text not null default '',
  email       text not null default '',
  notes       text,
  created_at  timestamptz default now()
);
alter table guests enable row level security;
create policy "owner access" on guests for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- BOOKINGS
-- -----------------------------------------------
create table if not exists bookings (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  room_id      uuid references rooms(id) on delete cascade not null,
  guest_id     uuid references guests(id) on delete set null,
  guest_name   text not null,
  check_in     date not null,
  check_out    date not null,
  status       text not null default 'confirmed',
  adults       int not null default 2,
  children     int not null default 0,
  total_price  numeric not null default 0,
  paid_amount  numeric not null default 0,
  notes        text not null default '',
  source       text not null default 'direct',
  color        text,
  created_at   timestamptz default now()
);
alter table bookings enable row level security;
create policy "owner access" on bookings for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- HOTEL PROFILE (one per user)
-- -----------------------------------------------
create table if not exists hotel_profile (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade unique not null,
  hotel_name  text not null default 'Мій готель',
  address     text,
  phone       text,
  email       text,
  logo_url    text,
  created_at  timestamptz default now()
);
alter table hotel_profile enable row level security;
create policy "owner access" on hotel_profile for all using (auth.uid() = user_id);
