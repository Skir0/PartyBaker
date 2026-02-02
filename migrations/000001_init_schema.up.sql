create table Users
(
    id            bigint primary key,
    first_name    text,
    last_name     text,
    username      text,
    created_at    date,
    lang_code text

);

create table Events
(
    id       serial primary key,
    name     text,
    date     timestamptz,
    deadline timestamptz,

    admin_id int not null,

    CONSTRAINT event_participant
        FOREIGN KEY (admin_id)
            REFERENCES Users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

create table Participants
(
    id       serial primary key,
    role     text,

    user_id  int not null,
    event_id int not null,

    CONSTRAINT participant_event
        FOREIGN KEY (event_id)
            REFERENCES Events (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT participant_user
        FOREIGN KEY (user_id)
            REFERENCES Users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

create table Gifts
(
    id               serial primary key,
    name             text,
    link             text,
    price            bigint,
    status           text not null default 'active',
    contract_address text,
    jetton_address   text,

    event_id         int not null,
    recipient_id     int not null,
    admin_id         int not null,

    CONSTRAINT gift_event
        FOREIGN KEY (event_id)
            REFERENCES Events (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT gift_recipient
        FOREIGN KEY (recipient_id)
            REFERENCES Users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT gift_admin
        FOREIGN KEY (admin_id)
            REFERENCES Users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

create table Participant_Gift
(
    is_paid          boolean,
    amount           bigint,
    transaction_hash text unique,

    participant_id   int not null,
    gift_id          int not null,

    CONSTRAINT pg_participant
        FOREIGN KEY (participant_id)
            REFERENCES Participants (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT pg_gift
        FOREIGN KEY (gift_id)
            REFERENCES Gifts (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);