create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;

create role authenticator noinherit login password 'root';
grant anon to authenticator;
grant authenticated to authenticator;
grant service_role to authenticator;

create role supabase_auth_admin noinherit login password 'root';

create schema if not exists auth;
grant usage on schema auth to supabase_auth_admin;
grant all on schema auth to supabase_auth_admin;

create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
