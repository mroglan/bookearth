WITH book AS (
  INSERT INTO books (title, author, description, published_year, map_composition)
  VALUES (
    'Around the World in Eighty Days',
    'Jules Verne',
    'A fast-paced journey led by Phileas Fogg to circumnavigate the globe.',
    1873,
    '{"base":"terrain","overlays":[{"type":"borders","variant":"classic","opacity":0.6}],"postProcessing":{"colorGrade":"muted"}}'::jsonb
  )
  RETURNING id
)
INSERT INTO events (book_id, title, description, event_date, lat, lon, geom, zoom_level, importance, narrative_index)
SELECT
  book.id,
  v.title,
  v.description,
  v.event_date,
  v.lat,
  v.lon,
  ST_SetSRID(ST_MakePoint(v.lon, v.lat), 4326),
  v.zoom_level,
  v.importance,
  v.narrative_index
FROM book
CROSS JOIN (
  VALUES
    ('London Departure', 'Phileas Fogg departs London to begin the wager.', DATE '1872-10-02', 51.5074, -0.1278, 6, 1, 1),
    ('Calais Connection', 'The travelers cross the Channel en route to the continent.', DATE '1872-10-03', 50.9513, 1.8587, 6, 1, 2),
    ('Brindisi Junction', 'A crucial rail connection pushes the schedule forward.', DATE '1872-10-05', 40.6321, 17.9410, 6, 1, 3),
    ('Suez Canal Stop', 'The party reaches Suez and checks in with authorities.', DATE '1872-10-09', 29.9668, 32.5498, 6, 1, 4),
    ('Aden Harbor', 'A coal stop in Aden keeps the voyage on track.', DATE '1872-10-14', 12.7855, 45.0187, 6, 1, 5),
    ('Bombay Arrival', 'Arrival in Bombay introduces the next leg by rail.', DATE '1872-10-20', 19.0760, 72.8777, 6, 1, 6),
    ('Allahabad Crossing', 'A rail delay forces a switch to an elephant journey.', DATE '1872-10-23', 25.4358, 81.8463, 6, 1, 7),
    ('Calcutta Stop', 'Calcutta brings new obstacles and renewed urgency.', DATE '1872-10-25', 22.5726, 88.3639, 6, 1, 8),
    ('Singapore Layover', 'A short stop refuels the journey toward China.', DATE '1872-11-02', 1.3521, 103.8198, 6, 1, 9),
    ('Hong Kong Pivot', 'A missed connection changes the itinerary.', DATE '1872-11-06', 22.3193, 114.1694, 6, 1, 10),
    ('Shanghai Rumor', 'News of a faster vessel spreads among travelers.', DATE '1872-11-10', 31.2304, 121.4737, 6, 1, 11),
    ('Yokohama Search', 'A frantic search reunites the group in Japan.', DATE '1872-11-14', 35.4437, 139.6380, 6, 1, 12),
    ('San Francisco Landing', 'The Pacific crossing ends in California.', DATE '1872-11-21', 37.7749, -122.4194, 6, 1, 13),
    ('Sacramento Sprint', 'A rail dash races across the American west.', DATE '1872-11-23', 38.5816, -121.4944, 6, 1, 14),
    ('Omaha Snowbound', 'A blizzard threatens the schedule across the plains.', DATE '1872-11-27', 41.2565, -95.9345, 6, 1, 15),
    ('Chicago Transfer', 'A brief stop keeps the timetable intact.', DATE '1872-11-28', 41.8781, -87.6298, 6, 1, 16),
    ('New York Arrival', 'The party reaches New York with little time to spare.', DATE '1872-12-01', 40.7128, -74.0060, 6, 1, 17),
    ('Liverpool Passage', 'An Atlantic crossing inches toward the finish.', DATE '1872-12-10', 53.4084, -2.9916, 6, 1, 18),
    ('Queenstown Delay', 'A final delay threatens the outcome.', DATE '1872-12-11', 51.8517, -8.2940, 6, 1, 19),
    ('London Return', 'Phileas Fogg returns to London under the wire.', DATE '1872-12-21', 51.5074, -0.1278, 6, 1, 20)
) AS v(title, description, event_date, lat, lon, zoom_level, importance, narrative_index);
