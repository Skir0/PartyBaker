-- name: CreateUser :one
insert into Users (first_name, last_name, username, lang_code, wallet_address)
values ($1, $2, $3, $4, $5)
returning *;

-- name: CreateEvent :one
insert into Events (name, date, deadline, admin_id, join_code)
values ($1, $2, $3, $4, $5)
returning *;

-- name: CreateParticipant :one
insert into Participants (role, user_id, event_id)
values ($1, $2, $3)
returning *;

-- name: CreateGift :one
insert into Gifts (name, link, target_amount,
                   contract_address, jetton_address,
                   event_id, recipient_id, admin_id, description, image_url)
values ($1, $2, $3,$4, $5,
        $6, $7, $8, $9, $10)
returning *;

-- name: CreateParticipantGift :one
insert into Participant_Gift (is_paid, amount,
                              transaction_hash, participant_id, gift_id)
values ($1, $2, $3, $4, $5)
on conflict (transaction_hash) do nothing
returning *;

-- name: GetEventsInfoByUserID :many
select
    e.id,
    e.name,
    e.date,
    e.deadline,
    e.admin_id,
    count(distinct p.id)::int as participants_count
from events e
         left join participants p on p.event_id = e.id
where e.admin_id = $1
   or e.id in (
    select event_id
    from participants
    where user_id = $1
)
group by e.id, e.name, e.date, e.deadline, e.admin_id
order by e.date asc;

-- name: GetAllActiveGiftsAddresses :many
select contract_address
from Gifts
where status = 'active';


-- name: GetGifts :many
select * from Gifts;

-- name: GetAllParticipantsOfGift :many
select *
from Participants
         inner join Participant_gift as pg on Participants.id = pg.participant_id
where pg.gift_id = $1;

-- name: GetGiftByContract :one
select *
from Gifts
where Gifts.contract_address = $1
limit 1;

-- name: GetUserBasicInfo :one
select first_name, last_name, username
from users
where id = $1
limit 1;

-- name: IsActiveGift :one
select exists(select 1
              from Gifts
              where contract_address = $1
                and status = 'active');

-- name: CancelGift :execresult
update Gifts
set status = 'cancelled'
where contract_address = $1;

-- name: ChangeAdmin :exec
update Gifts
set admin_id = (select id
                from Users
                where wallet_address = $1
                limit 1)
where contract_address = $2;

-- name: ChangeTargetAmount :exec
update Gifts
set target_amount = $1
where contract_address = $2;

-- name: DecreaseCollectedAmount :exec
update Gifts
set collected_amount = collected_amount - $1
where contract_address = $2;

-- name: IncreaseCollectedAmount :exec
update Gifts
set collected_amount = collected_amount - $1
where contract_address = $2;


-- name: DeleteParticipantGift :exec
delete
from participant_gift
    using participants, users, gifts
where participant_gift.participant_id = participants.id
  and participants.user_id = users.id
  and participant_gift.gift_id = gifts.id
  and gifts.contract_address = $1
  and users.wallet_address = $2;

-- name: RecordTransfer :exec
insert into participant_gift (participant_id, gift_id, amount, transaction_hash, is_paid)
values ((select participants.id
         from participants
                  join users on participants.user_id = users.id
         where users.wallet_address = $1
           and participants.event_id = (select event_id
                                        from gifts
                                        where gifts.contract_address = $2)
         limit 1),
        (select id from Gifts where contract_address = $2),
        $3, $4, true)
on conflict (transaction_hash) do nothing;

-- name: UpdateEvent :one
update events
set name = $1,
    date = $2,
    deadline = $3
where id = $4 and admin_id = $5
returning id, name, date, deadline, admin_id;

-- name: UpdateGift :one
update gifts
set name = $1,
    description = $2,
    target_amount = $3,
    link = $4
where id = $5 and admin_id = $6
returning id, name, description, target_amount, link;

-- name: DeleteEvent :execrows
delete from events
where id = $1 and admin_id = $2;

-- name: DeleteGift :execrows
delete from gifts
where id = $1 and admin_id = $2;

-- name: GetGiftRecipientsOfCurrentEvent :many
select p.id, u.first_name, u.last_name
from participants p
         join users u on u.id = p.user_id
where p.event_id = $1 and p.user_id != $2
  and p.role in ('recipient', 'participant');

-- name: GetGiftsInfoByRecipient :many
select g.*,
       (select count(*) from giftlikes where giftlikes.gift_id = g.id) as likes_amount,
       exists(select 1 from giftlikes where giftlikes.user_id = $1 and giftlikes.gift_id = g.id)
from gifts g
where g.event_id = $2
  and g.recipient_id = $3;

-- name: AddGiftLike :exec
insert into giftlikes (user_id, gift_id)
values ($1, $2)
ON CONFLICT DO NOTHING;

-- name: RemoveGiftLike :exec
delete from giftlikes
WHERE user_id = $1 AND gift_id = $2;

-- name: CheckEventJoinCodeExists :one
select EXISTS (
    select 1
    from Events
    where join_code = $1
);

-- name: GetEventIdByJoinCode :one
select id from events
where join_code = $1
limit 1;

-- name: CheckParticipantExists :one
select exists(
    select 1 from participants
             where user_id = $1 and event_id = $2
);

-- name: GetEventInfoById :one
select events.* , count(distinct p.id)::int as participants_count from events
                                                           left join participants p on events.id = p.event_id
where events.id = $1
group by events.id, name, date, deadline, admin_id, join_code
limit 1;

-- name: FinalizeGiftStatusesOfEvent :exec
with ranked as (
    select
        g.id,
        row_number() over (
            partition by g.recipient_id
            order by count(gl.gift_id) desc, g.id asc
            ) as rn
    from gifts g
             left join giftlikes gl on gl.gift_id = g.id
    where g.event_id = $1 and g.status in ('active', 'selected')
    group by g.id, g.recipient_id
)
update gifts g
set status = case when r.rn = 1 then 'selected' else 'rejected' end
from ranked r
where g.id = r.id and g.status in ('active', 'selected');

-- name: GetSelectedGiftsOfEvent :many
select * from gifts
where event_id = $1 and status = 'selected';


-- name: CheckRecipientParticipantForEvent :one
select exists(
    select 1
    from participants
    where id = $1
      and event_id = $2
      and role in ('recipient', 'participant')
);


-- name: GetPayersForRecipient :many
select p.id, u.first_name, u.last_name from participants p
         join users u on p.user_id = u.id
where event_id = $1 and role in ('contributor', 'participant') and p.id != $2;

-- name: GetPayersInfoForRecipient :many
select p.id, u.first_name, u.last_name, pg.is_paid, pg.amount from participants p
                                        join users u on p.user_id = u.id
                                        join participant_gift pg on p.id = pg.participant_id
                                        join gifts g on pg.gift_id = g.id
where p.event_id = $1 and role in ('contributor', 'participant') and p.id != $2 and g.recipient_id = $2;