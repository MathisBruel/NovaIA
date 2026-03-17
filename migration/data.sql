USE specialweek;

INSERT INTO user_account (email, first_name, last_name)
VALUES
    ('alice@example.com', 'Alice', 'Durand'),
    ('bob@example.com', 'Bob', 'Martin'),
    ('charlie@example.com', 'Charlie', 'Dupont');

INSERT INTO event (name, description, start_date, end_date)
VALUES
    ('Special Week Day 1', 'Ouverture de la semaine spéciale', '2026-03-16 09:00:00', '2026-03-16 18:00:00'),
    ('Special Week Day 2', 'Deuxième jour de la semaine spéciale', '2026-03-17 09:00:00', '2026-03-17 18:00:00');

INSERT INTO registration (user_id, event_id)
VALUES
    (1, 1),
    (2, 1),
    (3, 2);

