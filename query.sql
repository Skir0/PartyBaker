-- name: CreateUser :one
insert into Users (first_name, last_name, username, lang_code, wallet_address)
values ($1, $2, $3, $4, $5)
returning *;

-- name: CreateEvent :one
insert into Events (name, date, deadline, admin_id)
values ($1, $2, $3, $4)
returning *;

-- name: CreateParticipant :one
insert into Participants (role, user_id, event_id)
values ($1, $2, $3)
returning *;

-- name: CreateGift :one
insert into Gifts (name, link, target_amount, collected_amount,
                   contract_address, jetton_address,
                   event_id, recipient_id, admin_id)
values ($1, $2, $3, $4, $5,
        $6, $7, $8, $9)
returning *;

-- name: CreateParticipantGift :one
insert into Participant_Gift (is_paid, amount,
                              transaction_hash, participant_id, gift_id)
values ($1, $2, $3, $4, $5)
on conflict (transaction_hash) do nothing
returning *;

-- name: GetAllActiveGiftsAddresses :many
select contract_address
from Gifts
where status = 'active';

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
