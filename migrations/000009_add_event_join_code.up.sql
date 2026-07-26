alter table events
add column join_code varchar(6) unique;

create index idx_events_join_code on Events (join_code);