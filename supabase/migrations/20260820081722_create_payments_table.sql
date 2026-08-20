-- =====================================================
-- Create Payment Status Enum
-- =====================================================

create type payment_status as enum (

    'pending',

    'stk_sent',

    'waiting_callback',

    'success',

    'failed',

    'cancelled',

    'expired'

);

-- =====================================================
-- Payments Table
-- =====================================================

create table public.payments (

    id uuid primary key
        default gen_random_uuid(),

    reference text
        not null
        unique,

    phone text
        not null,

    amount numeric(12,2)
        not null,

    description text
        not null,

    status payment_status
        not null
        default 'pending',

    merchant_request_id text,

    checkout_request_id text
        unique,

    mpesa_receipt_number text
        unique,

    result_code integer,

    result_description text,

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now()

);

create index idx_payments_status on public.payments (status);

alter table public.payments enable row level security;