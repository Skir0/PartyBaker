begin;

alter table gifts
    drop constraint if exists gift_recipient;


update gifts g
set recipient_id = p.id
from participants p
where p.user_id = g.recipient_id
  and p.event_id = g.event_id
  and p.role = 'recipient';

do $$
    begin
        if exists (
            select 1
            from gifts g
                     left join participants p on p.id = g.recipient_id
            where p.id is null
        ) then
            raise exception 'Migration failed: some gifts.recipient_id values were not mapped to participants.id';
        end if;
    end $$;

alter table gifts
    add constraint gift_recipient
        foreign key (recipient_id)
            references participants (id)
            on delete cascade
            on update cascade;

commit;