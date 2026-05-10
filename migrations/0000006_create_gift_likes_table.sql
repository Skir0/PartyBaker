CREATE TABLE GiftLikes (
                           user_id INT REFERENCES Users(id),
                           gift_id INT REFERENCES Gifts(id),
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           PRIMARY KEY (user_id, gift_id)
);