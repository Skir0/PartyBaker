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
insert into Gifts (name, link, price,
                   contract_address, jetton_address,
                   event_id, recipient_id, admin_id)
values ($1, $2, $3, $4, $5,
        $6, $7, $8)
returning *;

-- name: CreateParticipantGift :one
insert into Participant_Gift (is_paid, amount,
                              transaction_hash, participant_id, gift_id)
values ($1, $2, $3, $4, $5)
on conflict (transaction_hash) do nothing
returning *;

-- name: GetAllActiveGiftsAddresses :many
select contract_address from Gifts
where status = 'active';

-- name: GetAllParticipantsOfGift :many
select * from Participants
inner join Participant_gift as pg on Participants.id = pg.participant_id
where pg.gift_id = $1;

-- name: GetGiftByContract :one
select * from Gifts
where Gifts.contract_address = $1
limit 1;

-- name: IsActiveGiftByContract :one
select exists(
    select 1 from Gifts
    where contract_address = $1 and status = 'active'
);

-- name: CancelGiftByContract :execresult
update Gifts
set status = 'cancelled'
where contract_address = $1;

-- name: GetUserByWallet :one
select id from Users
where wallet_address = $1
limit 1;

-- name: ChangeAdminByContract :exec
update Gifts
set admin_id = $1
where contract_address = $2;
