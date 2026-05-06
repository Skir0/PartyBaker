begin;

truncate table participant_gift, gifts, participants, events, users restart identity cascade;

insert into users (id, first_name, last_name, username, created_at, lang_code, wallet_address)
values
    (1, 'Kirill', 'Admin', 'kirill_admin', current_date, 'en', 'EQADMINWALLET0001'),
    (2, 'Sarah', 'Connor', 'sarah_c', current_date, 'en', 'EQRECIPIENT0002'),
    (3, 'Alex', 'Morgan', 'alex_m', current_date, 'en', 'EQRECIPIENT0003'),
    (4, 'Jordan', 'Lee', 'jordan_l', current_date, 'en', 'EQPARTICIPANT004');

insert into events (name, date, deadline, admin_id)
values ('Summer Birthday Pool', '2026-06-20 18:00:00+00', '2026-06-12 18:00:00+00', 1);

insert into participants (role, user_id, event_id)
values
    ('contributor', 1, 1),
    ('recipient', 2, 1),
    ('recipient', 3, 1),
    ('contributor', 4, 1);

insert into gifts (
    name,
    link,
    target_amount,
    collected_amount,
    contract_address,
    jetton_address,
    event_id,
    recipient_id,
    admin_id,
    description,
    image_url,
    likes_amount
)
values
    (
        'Instant Film Camera',
        'https://example.com/gifts/instant-film-camera',
        79,
        55,
        'contract_sarah_camera',
        'jetton_mock_1',
        1,
        2,
        1,
        'Compact instant camera for party photos and printed memories.',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80',
        12
    ),
    (
        'Italian Cookbook Set',
        'https://example.com/gifts/italian-cookbook',
        35,
        20,
        'contract_sarah_cookbook',
        'jetton_mock_2',
        1,
        2,
        1,
        'Hardcover recipe collection with classic regional dishes.',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        4
    ),
    (
        'Espresso Machine',
        'https://example.com/gifts/espresso-machine',
        160,
        90,
        'contract_alex_espresso',
        'jetton_mock_3',
        1,
        3,
        1,
        'Compact espresso setup for a stronger home coffee routine.',
        'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=600&q=80',
        8
    ),
    (
        'Weekend Travel Bag',
        'https://example.com/gifts/weekend-bag',
        98,
        30,
        'contract_alex_bag',
        'jetton_mock_4',
        1,
        3,
        1,
        'Durable carry-on bag sized for short trips and cabin travel.',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        3
    );

insert into participant_gift (is_paid, amount, transaction_hash, participant_id, gift_id)
values
    (true, 25, 'tx_sarah_camera_1', 1, 1),
    (true, 30, 'tx_sarah_camera_2', 4, 1),
    (true, 20, 'tx_sarah_cookbook_1', 1, 2),
    (true, 50, 'tx_alex_espresso_1', 1, 3),
    (true, 40, 'tx_alex_espresso_2', 4, 3),
    (true, 30, 'tx_alex_bag_1', 4, 4);

commit;
