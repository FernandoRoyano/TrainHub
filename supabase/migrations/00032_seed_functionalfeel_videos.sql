-- Migration: seed FunctionalFeel exercise videos
-- Channel: @functionalfeelneverwalkalo7194
-- 314 unique exercises

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Paseo de granjero', 'Paseo de granjero', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-gPJOGerQKtM', 'https://www.youtube.com/watch?v=gPJOGerQKtM', 'https://i.ytimg.com/vi/gPJOGerQKtM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press hombro barra', 'Press hombro barra', '{"shoulders"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-i4DQLqtN_RY', 'https://www.youtube.com/watch?v=i4DQLqtN_RY', 'https://i.ytimg.com/vi/i4DQLqtN_RY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo unilateral con mancuerna', 'Remo unilateral con mancuerna', '{"shoulders","lats","middle back"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-q3KDJ3x7eAg', 'https://www.youtube.com/watch?v=q3KDJ3x7eAg', 'https://i.ytimg.com/vi/q3KDJ3x7eAg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Hip thrust', 'Hip thrust', '{"glutes"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-Q66bnPLwzkU', 'https://www.youtube.com/watch?v=Q66bnPLwzkU', 'https://i.ytimg.com/vi/Q66bnPLwzkU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press banca con barra', 'Press banca con barra', '{"chest"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-cwXPFDS-yEU', 'https://www.youtube.com/watch?v=cwXPFDS-yEU', 'https://i.ytimg.com/vi/cwXPFDS-yEU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla con mancuernas', 'Sentadilla con mancuernas', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-Vi8ROQ_Q5mQ', 'https://www.youtube.com/watch?v=Vi8ROQ_Q5mQ', 'https://i.ytimg.com/vi/Vi8ROQ_Q5mQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dominadas negativas', 'Dominadas negativas', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-vpRy2AQk0SA', 'https://www.youtube.com/watch?v=vpRy2AQk0SA', 'https://i.ytimg.com/vi/vpRy2AQk0SA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Box Jumps + russian twists', 'Box Jumps + russian twists', '{"abdominals"}', '{"other"}', 'intermediate', 'cardio', 'custom', 'yt-4TmH6gkPDaE', 'https://www.youtube.com/watch?v=4TmH6gkPDaE', 'https://i.ytimg.com/vi/4TmH6gkPDaE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Burpee + sentadilla', 'Burpee + sentadilla', '{"quadriceps"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-lN1-w5NNwCw', 'https://www.youtube.com/watch?v=lN1-w5NNwCw', 'https://i.ytimg.com/vi/lN1-w5NNwCw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo, lunges y fondos', 'Remo, lunges y fondos', '{"triceps","lats","middle back","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-xC4a2gPLM44', 'https://www.youtube.com/watch?v=xC4a2gPLM44', 'https://i.ytimg.com/vi/xC4a2gPLM44/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Mountain climbers + KS', 'Mountain climbers + KS', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-3vkw6-n3JSI', 'https://www.youtube.com/watch?v=3vkw6-n3JSI', 'https://i.ytimg.com/vi/3vkw6-n3JSI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'box jump, dominada y snatches', 'box jump, dominada y snatches', '{"lats","middle back"}', '{"other"}', 'intermediate', 'cardio', 'custom', 'yt-Ubvk0cEM3KA', 'https://www.youtube.com/watch?v=Ubvk0cEM3KA', 'https://i.ytimg.com/vi/Ubvk0cEM3KA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'KS, push y jumping', 'KS, push y jumping', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-51mt50yaZ0c', 'https://www.youtube.com/watch?v=51mt50yaZ0c', 'https://i.ytimg.com/vi/51mt50yaZ0c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'kb, remo trx y Russian Twists', 'kb, remo trx y Russian Twists', '{"lats","middle back","abdominals"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-Rd4ezCr7cU4', 'https://www.youtube.com/watch?v=Rd4ezCr7cU4', 'https://i.ytimg.com/vi/Rd4ezCr7cU4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Pecho en poleas', 'Pecho en poleas', '{"chest"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-AM347246Fi4', 'https://www.youtube.com/watch?v=AM347246Fi4', 'https://i.ytimg.com/vi/AM347246Fi4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Chops con cable', 'Chops con cable', '{"obliques"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-3d2n97TgT1A', 'https://www.youtube.com/watch?v=3d2n97TgT1A', 'https://i.ytimg.com/vi/3d2n97TgT1A/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo en polea', 'Remo en polea', '{"lats","middle back"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-JMdpTZZLR0Q', 'https://www.youtube.com/watch?v=JMdpTZZLR0Q', 'https://i.ytimg.com/vi/JMdpTZZLR0Q/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'pajaros', 'pajaros', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-Nfmi6XTiyHY', 'https://www.youtube.com/watch?v=Nfmi6XTiyHY', 'https://i.ytimg.com/vi/Nfmi6XTiyHY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo', 'Remo', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-pfT7CKRPLOE', 'https://www.youtube.com/watch?v=pfT7CKRPLOE', 'https://i.ytimg.com/vi/pfT7CKRPLOE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos triceps asistidos', 'Fondos triceps asistidos', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-53o2V20Gu-c', 'https://www.youtube.com/watch?v=53o2V20Gu-c', 'https://i.ytimg.com/vi/53o2V20Gu-c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl Biceps con polea', 'Curl Biceps con polea', '{"biceps"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-g8Dqb0tRliU', 'https://www.youtube.com/watch?v=g8Dqb0tRliU', 'https://i.ytimg.com/vi/g8Dqb0tRliU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo TRX', 'Remo TRX', '{"lats","middle back"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-ek7dZvzQlXo', 'https://www.youtube.com/watch?v=ek7dZvzQlXo', 'https://i.ytimg.com/vi/ek7dZvzQlXo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Zancada mancuernas', 'Zancada mancuernas', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-JTAxLOXqkCU', 'https://www.youtube.com/watch?v=JTAxLOXqkCU', 'https://i.ytimg.com/vi/JTAxLOXqkCU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha con toque de hombro', 'Plancha con toque de hombro', '{"shoulders","abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-5LNtj4PpJKU', 'https://www.youtube.com/watch?v=5LNtj4PpJKU', 'https://i.ytimg.com/vi/5LNtj4PpJKU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo con barra', 'Remo con barra', '{"lats","middle back"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-nbrBrvnWnHI', 'https://www.youtube.com/watch?v=nbrBrvnWnHI', 'https://i.ytimg.com/vi/nbrBrvnWnHI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla búlgara', 'Sentadilla búlgara', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-PRBI46I8S1k', 'https://www.youtube.com/watch?v=PRBI46I8S1k', 'https://i.ytimg.com/vi/PRBI46I8S1k/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla con barra', 'Sentadilla con barra', '{"quadriceps"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-sH90_-FruTw', 'https://www.youtube.com/watch?v=sH90_-FruTw', 'https://i.ytimg.com/vi/sH90_-FruTw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dead Bug', 'Dead Bug', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-meHYbbQl67g', 'https://www.youtube.com/watch?v=meHYbbQl67g', 'https://i.ytimg.com/vi/meHYbbQl67g/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Subida frontal al cajon', 'Subida frontal al cajon', '{"other"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-TdsskmI8NWc', 'https://www.youtube.com/watch?v=TdsskmI8NWc', 'https://i.ytimg.com/vi/TdsskmI8NWc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha lateral', 'Plancha lateral', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-6vjr_Oc9Coo', 'https://www.youtube.com/watch?v=6vjr_Oc9Coo', 'https://i.ytimg.com/vi/6vjr_Oc9Coo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Wall Ball', 'Wall Ball', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-PRgMcvms2jE', 'https://www.youtube.com/watch?v=PRgMcvms2jE', 'https://i.ytimg.com/vi/PRgMcvms2jE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Jumping Jacks', 'Jumping Jacks', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-XtMfbGrp6zo', 'https://www.youtube.com/watch?v=XtMfbGrp6zo', 'https://i.ytimg.com/vi/XtMfbGrp6zo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press banca inclinada con mancuernas', 'Press banca inclinada con mancuernas', '{"chest"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-0bRfYO64p3c', 'https://www.youtube.com/watch?v=0bRfYO64p3c', 'https://i.ytimg.com/vi/0bRfYO64p3c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso muerto Rumano', 'Peso muerto Rumano', '{"hamstrings"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-kJkCKms_lRQ', 'https://www.youtube.com/watch?v=kJkCKms_lRQ', 'https://i.ytimg.com/vi/kJkCKms_lRQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha con elevacion de pierna', 'Plancha con elevacion de pierna', '{"shoulders","abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-gjrsuRXT1c4', 'https://www.youtube.com/watch?v=gjrsuRXT1c4', 'https://i.ytimg.com/vi/gjrsuRXT1c4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexiones', 'Flexiones', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-Wkbg4YgYPkU', 'https://www.youtube.com/watch?v=Wkbg4YgYPkU', 'https://i.ytimg.com/vi/Wkbg4YgYPkU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla frontal con barra', 'Sentadilla frontal con barra', '{"quadriceps"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-l1GXoQMI5dY', 'https://www.youtube.com/watch?v=l1GXoQMI5dY', 'https://i.ytimg.com/vi/l1GXoQMI5dY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Superman', 'Superman', '{"other"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-dETEzMCcAMw', 'https://www.youtube.com/watch?v=dETEzMCcAMw', 'https://i.ytimg.com/vi/dETEzMCcAMw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha lateral con elevación de cadera', 'Plancha lateral con elevación de cadera', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-d6mKdQasEk0', 'https://www.youtube.com/watch?v=d6mKdQasEk0', 'https://i.ytimg.com/vi/d6mKdQasEk0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Elevaciones laterales hombro', 'Elevaciones laterales hombro', '{"shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-thZRw1wiq1I', 'https://www.youtube.com/watch?v=thZRw1wiq1I', 'https://i.ytimg.com/vi/thZRw1wiq1I/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'KB swing', 'KB swing', '{"other"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-ant9wcqAPKs', 'https://www.youtube.com/watch?v=ant9wcqAPKs', 'https://i.ytimg.com/vi/ant9wcqAPKs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Golpeo balón de rodillas', 'Golpeo balón de rodillas', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-_AQrLkYWyBs', 'https://www.youtube.com/watch?v=_AQrLkYWyBs', 'https://i.ytimg.com/vi/_AQrLkYWyBs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Saltos al cajón', 'Saltos al cajón', '{"other"}', '{"other"}', 'intermediate', 'cardio', 'custom', 'yt-rFkngbT4JNs', 'https://www.youtube.com/watch?v=rFkngbT4JNs', 'https://i.ytimg.com/vi/rFkngbT4JNs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Jalón al pecho prono', 'Jalón al pecho prono', '{"chest","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-VLbz2SkT2gs', 'https://www.youtube.com/watch?v=VLbz2SkT2gs', 'https://i.ytimg.com/vi/VLbz2SkT2gs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flutter kicks', 'Flutter kicks', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt--KnjKvmmSY8', 'https://www.youtube.com/watch?v=-KnjKvmmSY8', 'https://i.ytimg.com/vi/-KnjKvmmSY8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'extensión tríceps en polea', 'extensión tríceps en polea', '{"triceps"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-XOn6A9M1xWo', 'https://www.youtube.com/watch?v=XOn6A9M1xWo', 'https://i.ytimg.com/vi/XOn6A9M1xWo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl concentrado de biceps', 'Curl concentrado de biceps', '{"biceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-WS4y88VbJi0', 'https://www.youtube.com/watch?v=WS4y88VbJi0', 'https://i.ytimg.com/vi/WS4y88VbJi0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dominadas asistidas', 'Dominadas asistidas', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-WIlrStzlu7I', 'https://www.youtube.com/watch?v=WIlrStzlu7I', 'https://i.ytimg.com/vi/WIlrStzlu7I/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla goblet mancuerna', 'Sentadilla goblet mancuerna', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-R7qq6jzZ_oA', 'https://www.youtube.com/watch?v=R7qq6jzZ_oA', 'https://i.ytimg.com/vi/R7qq6jzZ_oA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press de hombros sentado', 'Press de hombros sentado', '{"shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-mAp6OQrNx9Q', 'https://www.youtube.com/watch?v=mAp6OQrNx9Q', 'https://i.ytimg.com/vi/mAp6OQrNx9Q/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso muerto con mancuerna', 'Peso muerto con mancuerna', '{"hamstrings"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-HzbBSNOK8Vw', 'https://www.youtube.com/watch?v=HzbBSNOK8Vw', 'https://i.ytimg.com/vi/HzbBSNOK8Vw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Elevaciones de rodilla en barra', 'Elevaciones de rodilla en barra', '{"shoulders"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-5_w7qyJuxjg', 'https://www.youtube.com/watch?v=5_w7qyJuxjg', 'https://i.ytimg.com/vi/5_w7qyJuxjg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Patada de triceps con mancuerna', 'Patada de triceps con mancuerna', '{"triceps","glutes"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-Fvk1CG_YO0s', 'https://www.youtube.com/watch?v=Fvk1CG_YO0s', 'https://i.ytimg.com/vi/Fvk1CG_YO0s/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl martillo con mancuernas', 'Curl martillo con mancuernas', '{"biceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-m31vMWVJjwE', 'https://www.youtube.com/watch?v=m31vMWVJjwE', 'https://i.ytimg.com/vi/m31vMWVJjwE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso muerto con KB', 'Peso muerto con KB', '{"hamstrings"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-MwUYjxUmD5w', 'https://www.youtube.com/watch?v=MwUYjxUmD5w', 'https://i.ytimg.com/vi/MwUYjxUmD5w/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press de banca con mancuernas', 'Press de banca con mancuernas', '{"other"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-Ek3z66LERgk', 'https://www.youtube.com/watch?v=Ek3z66LERgk', 'https://i.ytimg.com/vi/Ek3z66LERgk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla', 'Sentadilla', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-ghbTp-yxpZ4', 'https://www.youtube.com/watch?v=ghbTp-yxpZ4', 'https://i.ytimg.com/vi/ghbTp-yxpZ4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha', 'Plancha', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-p1Vp1qshNBc', 'https://www.youtube.com/watch?v=p1Vp1qshNBc', 'https://i.ytimg.com/vi/p1Vp1qshNBc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Bird dog', 'Bird dog', '{"other"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-_P3XGWzQgE0', 'https://www.youtube.com/watch?v=_P3XGWzQgE0', 'https://i.ytimg.com/vi/_P3XGWzQgE0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión de cadera en fonderas', 'Flexión de cadera en fonderas', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-eVxd4uNI3AE', 'https://www.youtube.com/watch?v=eVxd4uNI3AE', 'https://i.ytimg.com/vi/eVxd4uNI3AE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha sierra en fitball', 'Plancha sierra en fitball', '{"abdominals"}', '{"exercise ball"}', 'intermediate', 'balance', 'custom', 'yt-uPG9zw26lvI', 'https://www.youtube.com/watch?v=uPG9zw26lvI', 'https://i.ytimg.com/vi/uPG9zw26lvI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha sierra con TRX', 'Plancha sierra con TRX', '{"abdominals"}', '{"other"}', 'intermediate', 'balance', 'custom', 'yt-gLVwNaEVwvA', 'https://www.youtube.com/watch?v=gLVwNaEVwvA', 'https://i.ytimg.com/vi/gLVwNaEVwvA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión de cadera con discos', 'Flexión de cadera con discos', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-s2lArmlm7bI', 'https://www.youtube.com/watch?v=s2lArmlm7bI', 'https://i.ytimg.com/vi/s2lArmlm7bI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Antirotación con kettlebell', 'Antirotación con kettlebell', '{"obliques"}', '{"kettlebells"}', 'intermediate', 'flexibility', 'custom', 'yt-vcB-qHnmqBs', 'https://www.youtube.com/watch?v=vcB-qHnmqBs', 'https://i.ytimg.com/vi/vcB-qHnmqBs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha sierra', 'Plancha sierra', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-gydQKt9ldQE', 'https://www.youtube.com/watch?v=gydQKt9ldQE', 'https://i.ytimg.com/vi/gydQKt9ldQE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Push press', 'Push press', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-cPYLcTzJRjw', 'https://www.youtube.com/watch?v=cPYLcTzJRjw', 'https://i.ytimg.com/vi/cPYLcTzJRjw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press francés', 'Press francés', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-2QhRtkLZrvU', 'https://www.youtube.com/watch?v=2QhRtkLZrvU', 'https://i.ytimg.com/vi/2QhRtkLZrvU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha pull through', 'Plancha pull through', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-08RS2zVQOF8', 'https://www.youtube.com/watch?v=08RS2zVQOF8', 'https://i.ytimg.com/vi/08RS2zVQOF8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha isométrica en fitball', 'Plancha isométrica en fitball', '{"abdominals"}', '{"exercise ball"}', 'intermediate', 'balance', 'custom', 'yt-44xefPbZ9Wo', 'https://www.youtube.com/watch?v=44xefPbZ9Wo', 'https://i.ytimg.com/vi/44xefPbZ9Wo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Patada de glúteo', 'Patada de glúteo', '{"glutes"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-o7iWG0Zc8kM', 'https://www.youtube.com/watch?v=o7iWG0Zc8kM', 'https://i.ytimg.com/vi/o7iWG0Zc8kM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Extension de cadera polea', 'Extension de cadera polea', '{"other"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-pSj3QQmHxt8', 'https://www.youtube.com/watch?v=pSj3QQmHxt8', 'https://i.ytimg.com/vi/pSj3QQmHxt8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla con kettlebell', 'Sentadilla con kettlebell', '{"quadriceps"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-EwKpUZUlhOk', 'https://www.youtube.com/watch?v=EwKpUZUlhOk', 'https://i.ytimg.com/vi/EwKpUZUlhOk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Russian twist', 'Russian twist', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-0S1wfEAMGes', 'https://www.youtube.com/watch?v=0S1wfEAMGes', 'https://i.ytimg.com/vi/0S1wfEAMGes/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Elevación frontal con mancuernas', 'Elevación frontal con mancuernas', '{"shoulders"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-stQMGfJ-G9s', 'https://www.youtube.com/watch?v=stQMGfJ-G9s', 'https://i.ytimg.com/vi/stQMGfJ-G9s/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Bicho muerto', 'Bicho muerto', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-2uHKIecHmHY', 'https://www.youtube.com/watch?v=2uHKIecHmHY', 'https://i.ytimg.com/vi/2uHKIecHmHY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Wod Russian twist + Wall balls + Air Squas', 'Wod Russian twist + Wall balls + Air Squas', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-p4ihqIVH4sc', 'https://www.youtube.com/watch?v=p4ihqIVH4sc', 'https://i.ytimg.com/vi/p4ihqIVH4sc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Wod Fran (for time)', 'Wod Fran (for time)', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-w0HCoUR73Vo', 'https://www.youtube.com/watch?v=w0HCoUR73Vo', 'https://i.ytimg.com/vi/w0HCoUR73Vo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Triceps una mano', 'Triceps una mano', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-LBgwlfQ46II', 'https://www.youtube.com/watch?v=LBgwlfQ46II', 'https://i.ytimg.com/vi/LBgwlfQ46II/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'triceps barra encima cabeza', 'triceps barra encima cabeza', '{"triceps"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-yC1A0K2VKN8', 'https://www.youtube.com/watch?v=yC1A0K2VKN8', 'https://i.ytimg.com/vi/yC1A0K2VKN8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'triceps barra', 'triceps barra', '{"triceps"}', '{"barbell"}', 'intermediate', 'strength', 'custom', 'yt-lEXbObVacSA', 'https://www.youtube.com/watch?v=lEXbObVacSA', 'https://i.ytimg.com/vi/lEXbObVacSA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'skyerg', 'skyerg', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-lNVruM6NmHU', 'https://www.youtube.com/watch?v=lNVruM6NmHU', 'https://i.ytimg.com/vi/lNVruM6NmHU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'press inclinado', 'press inclinado', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-R8XV6eyF3Sk', 'https://www.youtube.com/watch?v=R8XV6eyF3Sk', 'https://i.ytimg.com/vi/R8XV6eyF3Sk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'patada triceps', 'patada triceps', '{"triceps","glutes"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-9FeUDIdhPdA', 'https://www.youtube.com/watch?v=9FeUDIdhPdA', 'https://i.ytimg.com/vi/9FeUDIdhPdA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'burpees', 'burpees', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-mIWB5Slk38o', 'https://www.youtube.com/watch?v=mIWB5Slk38o', 'https://i.ytimg.com/vi/mIWB5Slk38o/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'bicicleta', 'bicicleta', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-BkrgXmoptf4', 'https://www.youtube.com/watch?v=BkrgXmoptf4', 'https://i.ytimg.com/vi/BkrgXmoptf4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'airbike', 'airbike', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-GfBjP1r01qM', 'https://www.youtube.com/watch?v=GfBjP1r01qM', 'https://i.ytimg.com/vi/GfBjP1r01qM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'curl de biceps en polea', 'curl de biceps en polea', '{"biceps"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-32FQHBrqDdM', 'https://www.youtube.com/watch?v=32FQHBrqDdM', 'https://i.ytimg.com/vi/32FQHBrqDdM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dragon flag', 'Dragon flag', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-aSerlLauoRw', 'https://www.youtube.com/watch?v=aSerlLauoRw', 'https://i.ytimg.com/vi/aSerlLauoRw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dragon flag asistida con banda', 'Dragon flag asistida con banda', '{"abdominals"}', '{"bands"}', 'intermediate', 'strength', 'custom', 'yt-_4FzVgl3sVQ', 'https://www.youtube.com/watch?v=_4FzVgl3sVQ', 'https://i.ytimg.com/vi/_4FzVgl3sVQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dragon flag a una pierna', 'Dragon flag a una pierna', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-4l4hPAkUl1U', 'https://www.youtube.com/watch?v=4l4hPAkUl1U', 'https://i.ytimg.com/vi/4l4hPAkUl1U/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dragon flag plegado', 'Dragon flag plegado', '{"abdominals"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-vOEO4Vw8Wvs', 'https://www.youtube.com/watch?v=vOEO4Vw8Wvs', 'https://i.ytimg.com/vi/vOEO4Vw8Wvs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha frontal suspendida asistida con banda', 'Plancha frontal suspendida asistida con banda', '{"abdominals"}', '{"bands"}', 'intermediate', 'balance', 'custom', 'yt-nwDs1ZwCgPg', 'https://www.youtube.com/watch?v=nwDs1ZwCgPg', 'https://i.ytimg.com/vi/nwDs1ZwCgPg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Pseudo push up asistida con banda', 'Pseudo push up asistida con banda', '{"chest"}', '{"bands"}', 'intermediate', 'strength', 'custom', 'yt-LeLkf1GhbsA', 'https://www.youtube.com/watch?v=LeLkf1GhbsA', 'https://i.ytimg.com/vi/LeLkf1GhbsA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Semi pseudo push up asistida con banda', 'Semi pseudo push up asistida con banda', '{"chest"}', '{"bands"}', 'intermediate', 'strength', 'custom', 'yt-1mZ-2zy4-ew', 'https://www.youtube.com/watch?v=1mZ-2zy4-ew', 'https://i.ytimg.com/vi/1mZ-2zy4-ew/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Push up asistida con banda', 'Push up asistida con banda', '{"chest"}', '{"bands"}', 'intermediate', 'strength', 'custom', 'yt-YepW9_VfuaA', 'https://www.youtube.com/watch?v=YepW9_VfuaA', 'https://i.ytimg.com/vi/YepW9_VfuaA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Pseudo push up', 'Pseudo push up', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-SKUN5Mq1Khk', 'https://www.youtube.com/watch?v=SKUN5Mq1Khk', 'https://i.ytimg.com/vi/SKUN5Mq1Khk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Semi pseudo push up', 'Semi pseudo push up', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-exiPECY-IXQ', 'https://www.youtube.com/watch?v=exiPECY-IXQ', 'https://i.ytimg.com/vi/exiPECY-IXQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Push up con protacción escapular', 'Push up con protacción escapular', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-kKxV78ZXKAQ', 'https://www.youtube.com/watch?v=kKxV78ZXKAQ', 'https://i.ytimg.com/vi/kKxV78ZXKAQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Retracción y protación escapular en plancha frontal', 'Retracción y protación escapular en plancha frontal', '{"lats","middle back","abdominals"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-EMXzcBTI8FU', 'https://www.youtube.com/watch?v=EMXzcBTI8FU', 'https://i.ytimg.com/vi/EMXzcBTI8FU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De plancha frontal a pseudo push up', 'De plancha frontal a pseudo push up', '{"chest","abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-sqHPRtyRgMU', 'https://www.youtube.com/watch?v=sqHPRtyRgMU', 'https://i.ytimg.com/vi/sqHPRtyRgMU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Posición plegado suspendida con banda', 'Posición plegado suspendida con banda', '{"other"}', '{"bands"}', 'intermediate', 'strength', 'custom', 'yt-WhTEdyiCXbg', 'https://www.youtube.com/watch?v=WhTEdyiCXbg', 'https://i.ytimg.com/vi/WhTEdyiCXbg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De plancha a plancha frontal plegado (con banda)', 'De plancha a plancha frontal plegado (con banda)', '{"abdominals"}', '{"bands"}', 'intermediate', 'balance', 'custom', 'yt-yNu41lUajlM', 'https://www.youtube.com/watch?v=yNu41lUajlM', 'https://i.ytimg.com/vi/yNu41lUajlM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De trípode a vertical adaptada con piernas estiradas', 'De trípode a vertical adaptada con piernas estiradas', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-uSeuyt8s_-c', 'https://www.youtube.com/watch?v=uSeuyt8s_-c', 'https://i.ytimg.com/vi/uSeuyt8s_-c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De plegado a vertical adaptada', 'De plegado a vertical adaptada', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-_qy7XEsHido', 'https://www.youtube.com/watch?v=_qy7XEsHido', 'https://i.ytimg.com/vi/_qy7XEsHido/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De trípode a vertical (extensión de cadera invertida con piernas estiradas)', 'De trípode a vertical (extensión de cadera invertida con piernas estiradas)', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-su1_ydpBlYg', 'https://www.youtube.com/watch?v=su1_ydpBlYg', 'https://i.ytimg.com/vi/su1_ydpBlYg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De plegado a trípode', 'De plegado a trípode', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-eJN7cUysx28', 'https://www.youtube.com/watch?v=eJN7cUysx28', 'https://i.ytimg.com/vi/eJN7cUysx28/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Push-up vertical espalda contra la pared adaptado', 'Push-up vertical espalda contra la pared adaptado', '{"chest","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-lUAL6BJy82c', 'https://www.youtube.com/watch?v=lUAL6BJy82c', 'https://i.ytimg.com/vi/lUAL6BJy82c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Push-up vertical espalda contra la pared', 'Push-up vertical espalda contra la pared', '{"chest","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-ZhPReal1wvc', 'https://www.youtube.com/watch?v=ZhPReal1wvc', 'https://i.ytimg.com/vi/ZhPReal1wvc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Push-up vertical adaptado', 'Push-up vertical adaptado', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-6jPSaYDwJBY', 'https://www.youtube.com/watch?v=6jPSaYDwJBY', 'https://i.ytimg.com/vi/6jPSaYDwJBY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Vertical isométrica', 'Vertical isométrica', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-gunM7zdtv4Y', 'https://www.youtube.com/watch?v=gunM7zdtv4Y', 'https://i.ytimg.com/vi/gunM7zdtv4Y/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De pike a plancha frontal con cajón', 'De pike a plancha frontal con cajón', '{"chest","abdominals"}', '{"other"}', 'intermediate', 'balance', 'custom', 'yt-1rqJEyL7WV8', 'https://www.youtube.com/watch?v=1rqJEyL7WV8', 'https://i.ytimg.com/vi/1rqJEyL7WV8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Pike push-up con cajón', 'Pike push-up con cajón', '{"chest"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-YU0RgwNsln4', 'https://www.youtube.com/watch?v=YU0RgwNsln4', 'https://i.ytimg.com/vi/YU0RgwNsln4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Pike push-up', 'Pike push-up', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-wj0wIp2HH6I', 'https://www.youtube.com/watch?v=wj0wIp2HH6I', 'https://i.ytimg.com/vi/wj0wIp2HH6I/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De plancha frontal a plegado (tucked)', 'De plancha frontal a plegado (tucked)', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-BnPjST351EI', 'https://www.youtube.com/watch?v=BnPjST351EI', 'https://i.ytimg.com/vi/BnPjST351EI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'De pike a plancha frontal', 'De pike a plancha frontal', '{"chest","abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-g6z7WlIfdlw', 'https://www.youtube.com/watch?v=g6z7WlIfdlw', 'https://i.ytimg.com/vi/g6z7WlIfdlw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Jalón unilateral', 'Jalón unilateral', '{"shoulders","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-BjAPAm5p3vA', 'https://www.youtube.com/watch?v=BjAPAm5p3vA', 'https://i.ytimg.com/vi/BjAPAm5p3vA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press horizontal unilateral', 'Press horizontal unilateral', '{"shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-2PM8PJvbURc', 'https://www.youtube.com/watch?v=2PM8PJvbURc', 'https://i.ytimg.com/vi/2PM8PJvbURc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo desde Plancha', 'Remo desde Plancha', '{"lats","middle back","abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-n9CppgeQswk', 'https://www.youtube.com/watch?v=n9CppgeQswk', 'https://i.ytimg.com/vi/n9CppgeQswk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Cargada más Remo', 'Cargada más Remo', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-Fh6shoIAIrU', 'https://www.youtube.com/watch?v=Fh6shoIAIrU', 'https://i.ytimg.com/vi/Fh6shoIAIrU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento cadena posterior cruzada', 'Estiramiento cadena posterior cruzada', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-D29-JTKfkAg', 'https://www.youtube.com/watch?v=D29-JTKfkAg', 'https://i.ytimg.com/vi/D29-JTKfkAg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento del sóleo', 'Estiramiento del sóleo', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-HcWpSDuk6ok', 'https://www.youtube.com/watch?v=HcWpSDuk6ok', 'https://i.ytimg.com/vi/HcWpSDuk6ok/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento de isquios con goma', 'Estiramiento de isquios con goma', '{"hamstrings"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-91_R-jHyQjg', 'https://www.youtube.com/watch?v=91_R-jHyQjg', 'https://i.ytimg.com/vi/91_R-jHyQjg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento de aductores', 'Estiramiento de aductores', '{"adductors"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-dw97r1QIo94', 'https://www.youtube.com/watch?v=dw97r1QIo94', 'https://i.ytimg.com/vi/dw97r1QIo94/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento dinámico tren inferior', 'Estiramiento dinámico tren inferior', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-f5EPNF3zzpY', 'https://www.youtube.com/watch?v=f5EPNF3zzpY', 'https://i.ytimg.com/vi/f5EPNF3zzpY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Skateboard en el gimnasio', 'Skateboard en el gimnasio', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-ibxaCjEN0E0', 'https://www.youtube.com/watch?v=ibxaCjEN0E0', 'https://i.ytimg.com/vi/ibxaCjEN0E0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Paseo del Granjero Unilateral', 'Paseo del Granjero Unilateral', '{"shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-1B_jHM9n81U', 'https://www.youtube.com/watch?v=1B_jHM9n81U', 'https://i.ytimg.com/vi/1B_jHM9n81U/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Inclinado con mancuernas', 'Press Inclinado con mancuernas', '{"other"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-FXmkOb8zKz0', 'https://www.youtube.com/watch?v=FXmkOb8zKz0', 'https://i.ytimg.com/vi/FXmkOb8zKz0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Paseo del Granjero con mancuernas', 'Paseo del Granjero con mancuernas', '{"other"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-nSD8nbOYc0k', 'https://www.youtube.com/watch?v=nSD8nbOYc0k', 'https://i.ytimg.com/vi/nSD8nbOYc0k/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Antilateral con polea', 'Antilateral con polea', '{"shoulders","obliques"}', '{"cable"}', 'intermediate', 'strength', 'custom', 'yt-mUHDtlmdxXU', 'https://www.youtube.com/watch?v=mUHDtlmdxXU', 'https://i.ytimg.com/vi/mUHDtlmdxXU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Extensiones de Tríceps con cuerda', 'Extensiones de Tríceps con cuerda', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-Tey5xjNoqPY', 'https://www.youtube.com/watch?v=Tey5xjNoqPY', 'https://i.ytimg.com/vi/Tey5xjNoqPY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Carrera', 'Carrera', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-ukklfOXSXIg', 'https://www.youtube.com/watch?v=ukklfOXSXIg', 'https://i.ytimg.com/vi/ukklfOXSXIg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Carrera con inclinación', 'Carrera con inclinación', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-2Od76913Qq0', 'https://www.youtube.com/watch?v=2Od76913Qq0', 'https://i.ytimg.com/vi/2Od76913Qq0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Elíptica', 'Elíptica', '{"other"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-trurw6wvKWg', 'https://www.youtube.com/watch?v=trurw6wvKWg', 'https://i.ytimg.com/vi/trurw6wvKWg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Rotaciones en punta', 'Rotaciones en punta', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-s6OzGEV0iWQ', 'https://www.youtube.com/watch?v=s6OzGEV0iWQ', 'https://i.ytimg.com/vi/s6OzGEV0iWQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Press vertical en punta', 'Sentadilla + Press vertical en punta', '{"chest","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-_CzWDRrJJgc', 'https://www.youtube.com/watch?v=_CzWDRrJJgc', 'https://i.ytimg.com/vi/_CzWDRrJJgc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press unilateral en punta', 'Press unilateral en punta', '{"shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-J8mPej5rReI', 'https://www.youtube.com/watch?v=J8mPej5rReI', 'https://i.ytimg.com/vi/J8mPej5rReI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press vertical en punta', 'Press vertical en punta', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-rcVpYtNKeZI', 'https://www.youtube.com/watch?v=rcVpYtNKeZI', 'https://i.ytimg.com/vi/rcVpYtNKeZI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo en punta', 'Remo en punta', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-GeT2QOyYEjA', 'https://www.youtube.com/watch?v=GeT2QOyYEjA', 'https://i.ytimg.com/vi/GeT2QOyYEjA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla frontal en punta', 'Sentadilla frontal en punta', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-e1sQFkTOjeY', 'https://www.youtube.com/watch?v=e1sQFkTOjeY', 'https://i.ytimg.com/vi/e1sQFkTOjeY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha Dinámica con rueda', 'Plancha Dinámica con rueda', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-9xDvQ8fLLvg', 'https://www.youtube.com/watch?v=9xDvQ8fLLvg', 'https://i.ytimg.com/vi/9xDvQ8fLLvg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Retracción Escapular con goma', 'Retracción Escapular con goma', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-SNHZJw03vAw', 'https://www.youtube.com/watch?v=SNHZJw03vAw', 'https://i.ytimg.com/vi/SNHZJw03vAw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha en fitball', 'Plancha en fitball', '{"abdominals"}', '{"exercise ball"}', 'intermediate', 'balance', 'custom', 'yt-pivzrDQZel0', 'https://www.youtube.com/watch?v=pivzrDQZel0', 'https://i.ytimg.com/vi/pivzrDQZel0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha Dinámica en fitball', 'Plancha Dinámica en fitball', '{"abdominals"}', '{"exercise ball"}', 'intermediate', 'balance', 'custom', 'yt-2B8fi2VJKXc', 'https://www.youtube.com/watch?v=2B8fi2VJKXc', 'https://i.ytimg.com/vi/2B8fi2VJKXc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Extensión de Cadera con Fitball', 'Extensión de Cadera con Fitball', '{"other"}', '{"exercise ball"}', 'intermediate', 'strength', 'custom', 'yt-qEadOuFEYEA', 'https://www.youtube.com/watch?v=qEadOuFEYEA', 'https://i.ytimg.com/vi/qEadOuFEYEA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl Femoral con fitball', 'Curl Femoral con fitball', '{"biceps","hamstrings"}', '{"exercise ball"}', 'intermediate', 'strength', 'custom', 'yt-_KEgFffqZB4', 'https://www.youtube.com/watch?v=_KEgFffqZB4', 'https://i.ytimg.com/vi/_KEgFffqZB4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha + Flexión  de Cadera con fitball', 'Plancha + Flexión  de Cadera con fitball', '{"chest","abdominals"}', '{"exercise ball"}', 'intermediate', 'balance', 'custom', 'yt-cHeDw3HeNRg', 'https://www.youtube.com/watch?v=cHeDw3HeNRg', 'https://i.ytimg.com/vi/cHeDw3HeNRg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Pallof', 'Press Pallof', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-eOorwF7I9Yg', 'https://www.youtube.com/watch?v=eOorwF7I9Yg', 'https://i.ytimg.com/vi/eOorwF7I9Yg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión de Cadera en paralelas', 'Flexión de Cadera en paralelas', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-YtFljLutKAI', 'https://www.youtube.com/watch?v=YtFljLutKAI', 'https://i.ytimg.com/vi/YtFljLutKAI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión Unilt. De Cadera en paralelas', 'Flexión Unilt. De Cadera en paralelas', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-90wGxluVaio', 'https://www.youtube.com/watch?v=90wGxluVaio', 'https://i.ytimg.com/vi/90wGxluVaio/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos en Paralelas', 'Fondos en Paralelas', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-FN_ezI3x6Lc', 'https://www.youtube.com/watch?v=FN_ezI3x6Lc', 'https://i.ytimg.com/vi/FN_ezI3x6Lc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Golpeó al Suelo con balón de rodillas', 'Golpeó al Suelo con balón de rodillas', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-_LRgQUSmVAs', 'https://www.youtube.com/watch?v=_LRgQUSmVAs', 'https://i.ytimg.com/vi/_LRgQUSmVAs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Lanzm. Posterior de balón', 'Sentadilla + Lanzm. Posterior de balón', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-V1RkBvScLIc', 'https://www.youtube.com/watch?v=V1RkBvScLIc', 'https://i.ytimg.com/vi/V1RkBvScLIc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Golpeó al suelo con balón', 'Sentadilla + Golpeó al suelo con balón', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-VCUXQOPaQ-I', 'https://www.youtube.com/watch?v=VCUXQOPaQ-I', 'https://i.ytimg.com/vi/VCUXQOPaQ-I/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Giro dinamico + Lanz. Horizontal de balón', 'Giro dinamico + Lanz. Horizontal de balón', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-W-mI6tMS7Bk', 'https://www.youtube.com/watch?v=W-mI6tMS7Bk', 'https://i.ytimg.com/vi/W-mI6tMS7Bk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Bote + Lanzm. Horizontal de balón con rotación', 'Bote + Lanzm. Horizontal de balón con rotación', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-3QOZrqToMjE', 'https://www.youtube.com/watch?v=3QOZrqToMjE', 'https://i.ytimg.com/vi/3QOZrqToMjE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lanzm. Horizontal de balón + Rotación', 'Lanzm. Horizontal de balón + Rotación', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-2t8TEx6vd1Q', 'https://www.youtube.com/watch?v=2t8TEx6vd1Q', 'https://i.ytimg.com/vi/2t8TEx6vd1Q/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Lanzm. Vertical de balón', 'Sentadilla + Lanzm. Vertical de balón', '{"chest","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-ArXgHcOHps4', 'https://www.youtube.com/watch?v=ArXgHcOHps4', 'https://i.ytimg.com/vi/ArXgHcOHps4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Golpes Simultáneos + Sentadilla', 'Golpes Simultáneos + Sentadilla', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-VwW3k0naIjc', 'https://www.youtube.com/watch?v=VwW3k0naIjc', 'https://i.ytimg.com/vi/VwW3k0naIjc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Anterior con goma', 'Lunge Anterior con goma', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-xJifXzx221E', 'https://www.youtube.com/watch?v=xJifXzx221E', 'https://i.ytimg.com/vi/xJifXzx221E/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Abducción de Cadera con goma', 'Abducción de Cadera con goma', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-RjjaOSw1qOE', 'https://www.youtube.com/watch?v=RjjaOSw1qOE', 'https://i.ytimg.com/vi/RjjaOSw1qOE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Pasos altérales con goma', 'Pasos altérales con goma', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-nWMFhZOyXjk', 'https://www.youtube.com/watch?v=nWMFhZOyXjk', 'https://i.ytimg.com/vi/nWMFhZOyXjk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge en Kinesis', 'Lunge en Kinesis', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-EWXFsSHT4Oc', 'https://www.youtube.com/watch?v=EWXFsSHT4Oc', 'https://i.ytimg.com/vi/EWXFsSHT4Oc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Subida Frontal al Step en Kinesis', 'Subida Frontal al Step en Kinesis', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt--KsMo7kFx-s', 'https://www.youtube.com/watch?v=-KsMo7kFx-s', 'https://i.ytimg.com/vi/-KsMo7kFx-s/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Posterior en Kinesis', 'Lunge Posterior en Kinesis', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-cZPnDraMGeM', 'https://www.youtube.com/watch?v=cZPnDraMGeM', 'https://i.ytimg.com/vi/cZPnDraMGeM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla en Kinesis', 'Sentadilla en Kinesis', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-wk866StHub8', 'https://www.youtube.com/watch?v=wk866StHub8', 'https://i.ytimg.com/vi/wk866StHub8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Alto en Kinesis', 'Remo Alto en Kinesis', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-FGpETpxMSpA', 'https://www.youtube.com/watch?v=FGpETpxMSpA', 'https://i.ytimg.com/vi/FGpETpxMSpA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Horizontal en Kinesis', 'Remo Horizontal en Kinesis', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-YC0rmNY-bNY', 'https://www.youtube.com/watch?v=YC0rmNY-bNY', 'https://i.ytimg.com/vi/YC0rmNY-bNY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Vertical en Kinesis', 'Press Vertical en Kinesis', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-uKVJUdCr7VY', 'https://www.youtube.com/watch?v=uKVJUdCr7VY', 'https://i.ytimg.com/vi/uKVJUdCr7VY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Horizontal en kinesis', 'Press Horizontal en kinesis', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-uhiOS-go7FQ', 'https://www.youtube.com/watch?v=uhiOS-go7FQ', 'https://i.ytimg.com/vi/uhiOS-go7FQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl de Cuádriceps', 'Curl de Cuádriceps', '{"biceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-JWXqMRQMaW4', 'https://www.youtube.com/watch?v=JWXqMRQMaW4', 'https://i.ytimg.com/vi/JWXqMRQMaW4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl Femoral Tumbado', 'Curl Femoral Tumbado', '{"biceps","hamstrings"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-SEvUzP42H0Y', 'https://www.youtube.com/watch?v=SEvUzP42H0Y', 'https://i.ytimg.com/vi/SEvUzP42H0Y/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla Frontal con mancuernas', 'Sentadilla Frontal con mancuernas', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-f9J4Ha2k1X4', 'https://www.youtube.com/watch?v=f9J4Ha2k1X4', 'https://i.ytimg.com/vi/f9J4Ha2k1X4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Dinámico con mancuerna', 'Lunge Dinámico con mancuerna', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-1u5xh5Qd3ho', 'https://www.youtube.com/watch?v=1u5xh5Qd3ho', 'https://i.ytimg.com/vi/1u5xh5Qd3ho/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Posterior + Curl de Biceps con mancuerna', 'Lunge Posterior + Curl de Biceps con mancuerna', '{"biceps","quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-yQ8jdoptefo', 'https://www.youtube.com/watch?v=yQ8jdoptefo', 'https://i.ytimg.com/vi/yQ8jdoptefo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Curl de Biceps', 'Sentadilla + Curl de Biceps', '{"biceps","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-V28y-eLqaaM', 'https://www.youtube.com/watch?v=V28y-eLqaaM', 'https://i.ytimg.com/vi/V28y-eLqaaM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Arrancada Unilateral con mancuerna', 'Arrancada Unilateral con mancuerna', '{"shoulders"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-ciHUmslUIB4', 'https://www.youtube.com/watch?v=ciHUmslUIB4', 'https://i.ytimg.com/vi/ciHUmslUIB4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Elevación Frontal con mancuernas', 'Sentadilla + Elevación Frontal con mancuernas', '{"shoulders","quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-5Pbny3rfWOQ', 'https://www.youtube.com/watch?v=5Pbny3rfWOQ', 'https://i.ytimg.com/vi/5Pbny3rfWOQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Posterior + Press Vertical con mancuerna', 'Lunge Posterior + Press Vertical con mancuerna', '{"chest","quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-GoTRRiQjb4o', 'https://www.youtube.com/watch?v=GoTRRiQjb4o', 'https://i.ytimg.com/vi/GoTRRiQjb4o/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge + Press Vertical con mancuernas', 'Lunge + Press Vertical con mancuernas', '{"chest","quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-aDU8Eg0hrao', 'https://www.youtube.com/watch?v=aDU8Eg0hrao', 'https://i.ytimg.com/vi/aDU8Eg0hrao/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Curl de Biceps + Press Vertical con mancuerna', 'Sentadilla + Curl de Biceps + Press Vertical con mancuerna', '{"chest","biceps","quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-G_jjEjzliTU', 'https://www.youtube.com/watch?v=G_jjEjzliTU', 'https://i.ytimg.com/vi/G_jjEjzliTU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Press Vertical Unilateral con mancuerna', 'Sentadilla + Press Vertical Unilateral con mancuerna', '{"chest","shoulders","quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-pCkI3dwnzYA', 'https://www.youtube.com/watch?v=pCkI3dwnzYA', 'https://i.ytimg.com/vi/pCkI3dwnzYA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Press Vertical con mancuerna', 'Sentadilla + Press Vertical con mancuerna', '{"chest","quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-GwImVz9naxs', 'https://www.youtube.com/watch?v=GwImVz9naxs', 'https://i.ytimg.com/vi/GwImVz9naxs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Elevaciones Frontales con mancuerna', 'Elevaciones Frontales con mancuerna', '{"shoulders"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-MoF9eNqMVic', 'https://www.youtube.com/watch?v=MoF9eNqMVic', 'https://i.ytimg.com/vi/MoF9eNqMVic/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Aperturas Laterales con mancuernas', 'Aperturas Laterales con mancuernas', '{"shoulders"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-d6-1XPkYH8g', 'https://www.youtube.com/watch?v=d6-1XPkYH8g', 'https://i.ytimg.com/vi/d6-1XPkYH8g/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curo de Biceps', 'Curo de Biceps', '{"biceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-QYkBJIZUOUA', 'https://www.youtube.com/watch?v=QYkBJIZUOUA', 'https://i.ytimg.com/vi/QYkBJIZUOUA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Vertical Unilateral de pie con mancuernas', 'Press Vertical Unilateral de pie con mancuernas', '{"chest","shoulders"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-U2cNicrr2L8', 'https://www.youtube.com/watch?v=U2cNicrr2L8', 'https://i.ytimg.com/vi/U2cNicrr2L8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Vertical de Pie con mancuernas', 'Press Vertical de Pie con mancuernas', '{"chest"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-Vpj_2delRVM', 'https://www.youtube.com/watch?v=Vpj_2delRVM', 'https://i.ytimg.com/vi/Vpj_2delRVM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Vertical Unilateral con mancuernas', 'Press Vertical Unilateral con mancuernas', '{"chest","shoulders"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-L5JwXVZwGYI', 'https://www.youtube.com/watch?v=L5JwXVZwGYI', 'https://i.ytimg.com/vi/L5JwXVZwGYI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Vertical con mancuernas', 'Press Vertical con mancuernas', '{"chest"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-Eh9ijqq_VZc', 'https://www.youtube.com/watch?v=Eh9ijqq_VZc', 'https://i.ytimg.com/vi/Eh9ijqq_VZc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Frances con mancuernas', 'Press Frances con mancuernas', '{"other"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-nQMimDY1n_I', 'https://www.youtube.com/watch?v=nQMimDY1n_I', 'https://i.ytimg.com/vi/nQMimDY1n_I/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Horizontal Unilateral con mancuerna', 'Press Horizontal Unilateral con mancuerna', '{"shoulders"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-v_bCPpwFgBs', 'https://www.youtube.com/watch?v=v_bCPpwFgBs', 'https://i.ytimg.com/vi/v_bCPpwFgBs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Horizontal con mancuernas', 'Press Horizontal con mancuernas', '{"other"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-STsIGD_VHgg', 'https://www.youtube.com/watch?v=STsIGD_VHgg', 'https://i.ytimg.com/vi/STsIGD_VHgg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Unilateral con apoyo', 'Remo Unilateral con apoyo', '{"shoulders","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-uS57kDim_m4', 'https://www.youtube.com/watch?v=uS57kDim_m4', 'https://i.ytimg.com/vi/uS57kDim_m4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo con mancuerna', 'Remo con mancuerna', '{"lats","middle back"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-GJftTOLM4vk', 'https://www.youtube.com/watch?v=GJftTOLM4vk', 'https://i.ytimg.com/vi/GJftTOLM4vk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso Muerto Unilateral con mancuerna', 'Peso Muerto Unilateral con mancuerna', '{"shoulders","hamstrings"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-f9BV14SYwbg', 'https://www.youtube.com/watch?v=f9BV14SYwbg', 'https://i.ytimg.com/vi/f9BV14SYwbg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Posterior Frontal con mancuerna', 'Lunge Posterior Frontal con mancuerna', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-OoH5ubKgX6E', 'https://www.youtube.com/watch?v=OoH5ubKgX6E', 'https://i.ytimg.com/vi/OoH5ubKgX6E/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge posterior con mancuerna', 'Lunge posterior con mancuerna', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-uzAbyA6K8v4', 'https://www.youtube.com/watch?v=uzAbyA6K8v4', 'https://i.ytimg.com/vi/uzAbyA6K8v4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Anterior con mancuerna', 'Lunge Anterior con mancuerna', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-Y0oCcQjjETo', 'https://www.youtube.com/watch?v=Y0oCcQjjETo', 'https://i.ytimg.com/vi/Y0oCcQjjETo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge con mancuernas', 'Lunge con mancuernas', '{"quadriceps"}', '{"dumbbell"}', 'intermediate', 'strength', 'custom', 'yt-222erK-yUng', 'https://www.youtube.com/watch?v=222erK-yUng', 'https://i.ytimg.com/vi/222erK-yUng/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla Globet', 'Sentadilla Globet', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-o-iXClucWZQ', 'https://www.youtube.com/watch?v=o-iXClucWZQ', 'https://i.ytimg.com/vi/o-iXClucWZQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Swing de kettlebell', 'Swing de kettlebell', '{"other"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-vqdQ9snz60Y', 'https://www.youtube.com/watch?v=vqdQ9snz60Y', 'https://i.ytimg.com/vi/vqdQ9snz60Y/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Swing Americano de kettlebell', 'Swing Americano de kettlebell', '{"other"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-hx2LLi7KAEE', 'https://www.youtube.com/watch?v=hx2LLi7KAEE', 'https://i.ytimg.com/vi/hx2LLi7KAEE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Levantamiento Turco con kettlebell', 'Levantamiento Turco con kettlebell', '{"other"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-FAQspIvVkeA', 'https://www.youtube.com/watch?v=FAQspIvVkeA', 'https://i.ytimg.com/vi/FAQspIvVkeA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Swing Unilateral de kettlebell', 'Swing Unilateral de kettlebell', '{"shoulders"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-os-wt6DQ-Kc', 'https://www.youtube.com/watch?v=os-wt6DQ-Kc', 'https://i.ytimg.com/vi/os-wt6DQ-Kc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Swing Lateral de Kettlebell', 'Swing Lateral de Kettlebell', '{"shoulders"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-funY6bjXdNU', 'https://www.youtube.com/watch?v=funY6bjXdNU', 'https://i.ytimg.com/vi/funY6bjXdNU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Cargada de kettlebell', 'Sentadilla + Cargada de kettlebell', '{"quadriceps"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-t3ZOgoc0EF0', 'https://www.youtube.com/watch?v=t3ZOgoc0EF0', 'https://i.ytimg.com/vi/t3ZOgoc0EF0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Cargada Unilateral de kettlebell', 'Cargada Unilateral de kettlebell', '{"shoulders"}', '{"kettlebells"}', 'intermediate', 'strength', 'custom', 'yt-x0mah5Xw7XI', 'https://www.youtube.com/watch?v=x0mah5Xw7XI', 'https://i.ytimg.com/vi/x0mah5Xw7XI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Horizontal Trx', 'Press Horizontal Trx', '{"other"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-vmsazpgGqwg', 'https://www.youtube.com/watch?v=vmsazpgGqwg', 'https://i.ytimg.com/vi/vmsazpgGqwg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha + Pull Over', 'Plancha + Pull Over', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-SfurJgIi18g', 'https://www.youtube.com/watch?v=SfurJgIi18g', 'https://i.ytimg.com/vi/SfurJgIi18g/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla Búlgara Trx', 'Sentadilla Búlgara Trx', '{"quadriceps"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-E-_kyhWAN38', 'https://www.youtube.com/watch?v=E-_kyhWAN38', 'https://i.ytimg.com/vi/E-_kyhWAN38/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Unilateral', 'Lunge Unilateral', '{"shoulders","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-n-algGjqKls', 'https://www.youtube.com/watch?v=n-algGjqKls', 'https://i.ytimg.com/vi/n-algGjqKls/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl Femoral Trx', 'Curl Femoral Trx', '{"biceps","hamstrings"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-Ng1DnT6DnLg', 'https://www.youtube.com/watch?v=Ng1DnT6DnLg', 'https://i.ytimg.com/vi/Ng1DnT6DnLg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha Trx', 'Plancha Trx', '{"abdominals"}', '{"other"}', 'intermediate', 'balance', 'custom', 'yt-Ho8llOX0w0I', 'https://www.youtube.com/watch?v=Ho8llOX0w0I', 'https://i.ytimg.com/vi/Ho8llOX0w0I/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha + Flexión Oblicua de Cadera', 'Plancha + Flexión Oblicua de Cadera', '{"chest","abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-yJ20mEjEc14', 'https://www.youtube.com/watch?v=yJ20mEjEc14', 'https://i.ytimg.com/vi/yJ20mEjEc14/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl de Bíceps Trx', 'Curl de Bíceps Trx', '{"biceps"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-iapyYLjUTgY', 'https://www.youtube.com/watch?v=iapyYLjUTgY', 'https://i.ytimg.com/vi/iapyYLjUTgY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl de Tríceps Trx', 'Curl de Tríceps Trx', '{"triceps","biceps"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-l1fyV6nJeyY', 'https://www.youtube.com/watch?v=l1fyV6nJeyY', 'https://i.ytimg.com/vi/l1fyV6nJeyY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo + Plancha Trx', 'Remo + Plancha Trx', '{"lats","middle back","abdominals"}', '{"other"}', 'intermediate', 'balance', 'custom', 'yt-DYT3Cs_HUXE', 'https://www.youtube.com/watch?v=DYT3Cs_HUXE', 'https://i.ytimg.com/vi/DYT3Cs_HUXE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge + Pull Over Trx', 'Lunge + Pull Over Trx', '{"quadriceps"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-BUjgXFGzxnU', 'https://www.youtube.com/watch?v=BUjgXFGzxnU', 'https://i.ytimg.com/vi/BUjgXFGzxnU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Skipping Trx', 'Skipping Trx', '{"other"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-Bc1bKv_QhEM', 'https://www.youtube.com/watch?v=Bc1bKv_QhEM', 'https://i.ytimg.com/vi/Bc1bKv_QhEM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge + Aperturas Anteriores', 'Lunge + Aperturas Anteriores', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-K6HyIwC7pog', 'https://www.youtube.com/watch?v=K6HyIwC7pog', 'https://i.ytimg.com/vi/K6HyIwC7pog/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Superman Trx', 'Superman Trx', '{"other"}', '{"other"}', 'intermediate', 'balance', 'custom', 'yt-0xfMmU68KNY', 'https://www.youtube.com/watch?v=0xfMmU68KNY', 'https://i.ytimg.com/vi/0xfMmU68KNY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo + Curl de tríceps Trx', 'Remo + Curl de tríceps Trx', '{"triceps","biceps","lats","middle back"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-HAVwu9d7MYg', 'https://www.youtube.com/watch?v=HAVwu9d7MYg', 'https://i.ytimg.com/vi/HAVwu9d7MYg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Remo Trx', 'Sentadilla + Remo Trx', '{"lats","middle back","quadriceps"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-RleoWNC3m8M', 'https://www.youtube.com/watch?v=RleoWNC3m8M', 'https://i.ytimg.com/vi/RleoWNC3m8M/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Rotaciones Verticales', 'Rotaciones Verticales', '{"chest"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-nnEtoBKAB84', 'https://www.youtube.com/watch?v=nnEtoBKAB84', 'https://i.ytimg.com/vi/nnEtoBKAB84/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Rotación Horizontal', 'Sentadilla + Rotación Horizontal', '{"quadriceps"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-iTAWre60Cv8', 'https://www.youtube.com/watch?v=iTAWre60Cv8', 'https://i.ytimg.com/vi/iTAWre60Cv8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Pallof + Lunge Isom.', 'Press Pallof + Lunge Isom.', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-JW6lxHkYvHo', 'https://www.youtube.com/watch?v=JW6lxHkYvHo', 'https://i.ytimg.com/vi/JW6lxHkYvHo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Unilateral  + Rotación', 'Remo Unilateral  + Rotación', '{"shoulders","lats","middle back"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-tEtlTXTDXA8', 'https://www.youtube.com/watch?v=tEtlTXTDXA8', 'https://i.ytimg.com/vi/tEtlTXTDXA8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Horizontal Unilateral + Rotación', 'Press Horizontal Unilateral + Rotación', '{"shoulders"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-V-o_pVMX720', 'https://www.youtube.com/watch?v=V-o_pVMX720', 'https://i.ytimg.com/vi/V-o_pVMX720/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Rotaciones Horizontales + Flexión de Columna', 'Rotaciones Horizontales + Flexión de Columna', '{"chest"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-PVZRVR2mRY4', 'https://www.youtube.com/watch?v=PVZRVR2mRY4', 'https://i.ytimg.com/vi/PVZRVR2mRY4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Rotaciones Horizontales', 'Rotaciones Horizontales', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-dEAkqPv50Co', 'https://www.youtube.com/watch?v=dEAkqPv50Co', 'https://i.ytimg.com/vi/dEAkqPv50Co/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge + Press Horizontal Unilateral', 'Lunge + Press Horizontal Unilateral', '{"shoulders","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt--ZX2IFVPCFs', 'https://www.youtube.com/watch?v=-ZX2IFVPCFs', 'https://i.ytimg.com/vi/-ZX2IFVPCFs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge + Press Horizontal', 'Lunge + Press Horizontal', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-5tX60RVznE4', 'https://www.youtube.com/watch?v=5tX60RVznE4', 'https://i.ytimg.com/vi/5tX60RVznE4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge', 'Lunge', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-5SPQgF_A89k', 'https://www.youtube.com/watch?v=5SPQgF_A89k', 'https://i.ytimg.com/vi/5SPQgF_A89k/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Rotación de Columna con Flexión de Cadera', 'Rotación de Columna con Flexión de Cadera', '{"chest"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-m-h8MHmZ77s', 'https://www.youtube.com/watch?v=m-h8MHmZ77s', 'https://i.ytimg.com/vi/m-h8MHmZ77s/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Cobra + Estiramiento Posterior.', 'Cobra + Estiramiento Posterior.', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-ksCIBc2_mco', 'https://www.youtube.com/watch?v=ksCIBc2_mco', 'https://i.ytimg.com/vi/ksCIBc2_mco/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento Psoas + Rotación de Columna', 'Estiramiento Psoas + Rotación de Columna', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-W4qA5g2FbOo', 'https://www.youtube.com/watch?v=W4qA5g2FbOo', 'https://i.ytimg.com/vi/W4qA5g2FbOo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento antero-posterior', 'Estiramiento antero-posterior', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-NlW0a0A96UE', 'https://www.youtube.com/watch?v=NlW0a0A96UE', 'https://i.ytimg.com/vi/NlW0a0A96UE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento del Cuádriceps', 'Estiramiento del Cuádriceps', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-f7hsv_uVEg0', 'https://www.youtube.com/watch?v=f7hsv_uVEg0', 'https://i.ytimg.com/vi/f7hsv_uVEg0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento del Dorsal + Mov. De Cadera', 'Estiramiento del Dorsal + Mov. De Cadera', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-I-4JqOfES4c', 'https://www.youtube.com/watch?v=I-4JqOfES4c', 'https://i.ytimg.com/vi/I-4JqOfES4c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento Isquios', 'Estiramiento Isquios', '{"hamstrings"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-k6e0TFGpUwc', 'https://www.youtube.com/watch?v=k6e0TFGpUwc', 'https://i.ytimg.com/vi/k6e0TFGpUwc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento Glúteo y Piramidal', 'Estiramiento Glúteo y Piramidal', '{"glutes"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-9obtzIdUauQ', 'https://www.youtube.com/watch?v=9obtzIdUauQ', 'https://i.ytimg.com/vi/9obtzIdUauQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento Isquios + Rotación', 'Estiramiento Isquios + Rotación', '{"hamstrings"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-vGvP8Fk9DI0', 'https://www.youtube.com/watch?v=vGvP8Fk9DI0', 'https://i.ytimg.com/vi/vGvP8Fk9DI0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Movilidad Escapular + Rotación de Columna', 'Movilidad Escapular + Rotación de Columna', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-62YlypXyRYI', 'https://www.youtube.com/watch?v=62YlypXyRYI', 'https://i.ytimg.com/vi/62YlypXyRYI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Movilidad Cintura Escapular', 'Movilidad Cintura Escapular', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-LweWSui4_fQ', 'https://www.youtube.com/watch?v=LweWSui4_fQ', 'https://i.ytimg.com/vi/LweWSui4_fQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión Profunda + Rotación de Columna', 'Flexión Profunda + Rotación de Columna', '{"chest"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-lUzqXttGlAY', 'https://www.youtube.com/watch?v=lUzqXttGlAY', 'https://i.ytimg.com/vi/lUzqXttGlAY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Movilidad De la Cadera', 'Movilidad De la Cadera', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-Go2t5o9WYL0', 'https://www.youtube.com/watch?v=Go2t5o9WYL0', 'https://i.ytimg.com/vi/Go2t5o9WYL0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento Cadena Posterior', 'Estiramiento Cadena Posterior', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-ZzQ7NOA4ko0', 'https://www.youtube.com/watch?v=ZzQ7NOA4ko0', 'https://i.ytimg.com/vi/ZzQ7NOA4ko0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento Adductor e isquio', 'Estiramiento Adductor e isquio', '{"hamstrings"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-5RjqeRIbtBo', 'https://www.youtube.com/watch?v=5RjqeRIbtBo', 'https://i.ytimg.com/vi/5RjqeRIbtBo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento Posterior + Rotación de Columna', 'Estiramiento Posterior + Rotación de Columna', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-P5-GWmK6jC0', 'https://www.youtube.com/watch?v=P5-GWmK6jC0', 'https://i.ytimg.com/vi/P5-GWmK6jC0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión Dorsal', 'Flexión Dorsal', '{"chest","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-vhwdKUsS2Zo', 'https://www.youtube.com/watch?v=vhwdKUsS2Zo', 'https://i.ytimg.com/vi/vhwdKUsS2Zo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Estiramiento del Piramidal', 'Estiramiento del Piramidal', '{"other"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-KNCzrTuqCHU', 'https://www.youtube.com/watch?v=KNCzrTuqCHU', 'https://i.ytimg.com/vi/KNCzrTuqCHU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión de cadera + Mov Escapular', 'Flexión de cadera + Mov Escapular', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-HxOF4lFXqy0', 'https://www.youtube.com/watch?v=HxOF4lFXqy0', 'https://i.ytimg.com/vi/HxOF4lFXqy0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Lateral + Remo Unilateral', 'Lunge Lateral + Remo Unilateral', '{"shoulders","lats","middle back","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-W3ickugRNMI', 'https://www.youtube.com/watch?v=W3ickugRNMI', 'https://i.ytimg.com/vi/W3ickugRNMI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Posterior + Remo Unilateral', 'Lunge Posterior + Remo Unilateral', '{"shoulders","lats","middle back","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-XQOqrd3n0X8', 'https://www.youtube.com/watch?v=XQOqrd3n0X8', 'https://i.ytimg.com/vi/XQOqrd3n0X8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge + Remo Unilateral', 'Lunge + Remo Unilateral', '{"shoulders","lats","middle back","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-cFAQkRKRqD4', 'https://www.youtube.com/watch?v=cFAQkRKRqD4', 'https://i.ytimg.com/vi/cFAQkRKRqD4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Remo Unilateral', 'Sentadilla + Remo Unilateral', '{"shoulders","lats","middle back","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-RLU43xVyb58', 'https://www.youtube.com/watch?v=RLU43xVyb58', 'https://i.ytimg.com/vi/RLU43xVyb58/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla + Remo', 'Sentadilla + Remo', '{"lats","middle back","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-bLQG5shF-2A', 'https://www.youtube.com/watch?v=bLQG5shF-2A', 'https://i.ytimg.com/vi/bLQG5shF-2A/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso Muerto Unilateral', 'Peso Muerto Unilateral', '{"shoulders","hamstrings"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-br2oZmzLIRk', 'https://www.youtube.com/watch?v=br2oZmzLIRk', 'https://i.ytimg.com/vi/br2oZmzLIRk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Lateral', 'Lunge Lateral', '{"shoulders","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-Mu-z4TM0KgY', 'https://www.youtube.com/watch?v=Mu-z4TM0KgY', 'https://i.ytimg.com/vi/Mu-z4TM0KgY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Banca', 'Press Banca', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-v2skYTMaRpM', 'https://www.youtube.com/watch?v=v2skYTMaRpM', 'https://i.ytimg.com/vi/v2skYTMaRpM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Banca Cerrado', 'Press Banca Cerrado', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-IG9UARBsGkA', 'https://www.youtube.com/watch?v=IG9UARBsGkA', 'https://i.ytimg.com/vi/IG9UARBsGkA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Dinámico Posterior', 'Lunge Dinámico Posterior', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-OpvrfEfAHLo', 'https://www.youtube.com/watch?v=OpvrfEfAHLo', 'https://i.ytimg.com/vi/OpvrfEfAHLo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Dinámico Anterior', 'Lunge Dinámico Anterior', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-M_STSirFM2o', 'https://www.youtube.com/watch?v=M_STSirFM2o', 'https://i.ytimg.com/vi/M_STSirFM2o/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla Trasera', 'Sentadilla Trasera', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-ud0TZ93c6gA', 'https://www.youtube.com/watch?v=ud0TZ93c6gA', 'https://i.ytimg.com/vi/ud0TZ93c6gA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla Profunda', 'Sentadilla Profunda', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-QE0OOrtQVG4', 'https://www.youtube.com/watch?v=QE0OOrtQVG4', 'https://i.ytimg.com/vi/QE0OOrtQVG4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Vertical', 'Press Vertical', '{"chest"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-eChPVVhRhKI', 'https://www.youtube.com/watch?v=eChPVVhRhKI', 'https://i.ytimg.com/vi/eChPVVhRhKI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso Muerto Convencional', 'Peso Muerto Convencional', '{"hamstrings"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-OHwfSBvfS3c', 'https://www.youtube.com/watch?v=OHwfSBvfS3c', 'https://i.ytimg.com/vi/OHwfSBvfS3c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Curl de Biceps', 'Curl de Biceps', '{"biceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-BRdewaFaJ1Y', 'https://www.youtube.com/watch?v=BRdewaFaJ1Y', 'https://i.ytimg.com/vi/BRdewaFaJ1Y/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso Muerto', 'Peso Muerto', '{"hamstrings"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-bS1qQtJX5pY', 'https://www.youtube.com/watch?v=bS1qQtJX5pY', 'https://i.ytimg.com/vi/bS1qQtJX5pY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo al Mentón', 'Remo al Mentón', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-NqMONsVXXEg', 'https://www.youtube.com/watch?v=NqMONsVXXEg', 'https://i.ytimg.com/vi/NqMONsVXXEg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Supino', 'Remo Supino', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-c8Q4D9osvAk', 'https://www.youtube.com/watch?v=c8Q4D9osvAk', 'https://i.ytimg.com/vi/c8Q4D9osvAk/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Prono', 'Remo Prono', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-G8rPyi-6Sbg', 'https://www.youtube.com/watch?v=G8rPyi-6Sbg', 'https://i.ytimg.com/vi/G8rPyi-6Sbg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Peso Muerto Sumó', 'Peso Muerto Sumó', '{"hamstrings"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-VKoJyhNqJ1c', 'https://www.youtube.com/watch?v=VKoJyhNqJ1c', 'https://i.ytimg.com/vi/VKoJyhNqJ1c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla Un Agarre', 'Sentadilla Un Agarre', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-jLGaottKyQw', 'https://www.youtube.com/watch?v=jLGaottKyQw', 'https://i.ytimg.com/vi/jLGaottKyQw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Flexión de Hombros Frontal', 'Flexión de Hombros Frontal', '{"chest","shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt--Gwe4wjgOfg', 'https://www.youtube.com/watch?v=-Gwe4wjgOfg', 'https://i.ytimg.com/vi/-Gwe4wjgOfg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Abd de Hombro Unilateral', 'Abd de Hombro Unilateral', '{"shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-fZqDh-n5alc', 'https://www.youtube.com/watch?v=fZqDh-n5alc', 'https://i.ytimg.com/vi/fZqDh-n5alc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Abducción de Hombro', 'Abducción de Hombro', '{"shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-lFzV-PkwPhc', 'https://www.youtube.com/watch?v=lFzV-PkwPhc', 'https://i.ytimg.com/vi/lFzV-PkwPhc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Vertical Unilateral', 'Press Vertical Unilateral', '{"chest","shoulders"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-ERF138ELDVQ', 'https://www.youtube.com/watch?v=ERF138ELDVQ', 'https://i.ytimg.com/vi/ERF138ELDVQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Declinado', 'Press Declinado', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-bHsemmwYSPw', 'https://www.youtube.com/watch?v=bHsemmwYSPw', 'https://i.ytimg.com/vi/bHsemmwYSPw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Press Horizontal', 'Press Horizontal', '{"other"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-4EfvtrI4twQ', 'https://www.youtube.com/watch?v=4EfvtrI4twQ', 'https://i.ytimg.com/vi/4EfvtrI4twQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Gironda', 'Remo Gironda', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-S6IWfJBAks8', 'https://www.youtube.com/watch?v=S6IWfJBAks8', 'https://i.ytimg.com/vi/S6IWfJBAks8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Cerrado Alto', 'Remo Cerrado Alto', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-UDRpH9I1dk0', 'https://www.youtube.com/watch?v=UDRpH9I1dk0', 'https://i.ytimg.com/vi/UDRpH9I1dk0/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo cerrado horizontal', 'Remo cerrado horizontal', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-omJH5Ohe5-U', 'https://www.youtube.com/watch?v=omJH5Ohe5-U', 'https://i.ytimg.com/vi/omJH5Ohe5-U/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Abierto Horizontal', 'Remo Abierto Horizontal', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-0yA2Lg67bqg', 'https://www.youtube.com/watch?v=0yA2Lg67bqg', 'https://i.ytimg.com/vi/0yA2Lg67bqg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Jalón de Pie', 'Jalón de Pie', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-CLWHq5yGlHQ', 'https://www.youtube.com/watch?v=CLWHq5yGlHQ', 'https://i.ytimg.com/vi/CLWHq5yGlHQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Alto Abierto', 'Remo Alto Abierto', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-CArgX53PuT8', 'https://www.youtube.com/watch?v=CArgX53PuT8', 'https://i.ytimg.com/vi/CArgX53PuT8/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Bajo Abierto', 'Remo Bajo Abierto', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-sRKxotWY5Xw', 'https://www.youtube.com/watch?v=sRKxotWY5Xw', 'https://i.ytimg.com/vi/sRKxotWY5Xw/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Unilateral', 'Remo Unilateral', '{"shoulders","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-2IJEZ6uhT9s', 'https://www.youtube.com/watch?v=2IJEZ6uhT9s', 'https://i.ytimg.com/vi/2IJEZ6uhT9s/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Unilateral Alto', 'Remo Unilateral Alto', '{"shoulders","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-a4jqjkP2NyM', 'https://www.youtube.com/watch?v=a4jqjkP2NyM', 'https://i.ytimg.com/vi/a4jqjkP2NyM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Remo Unilateral Bajo', 'Remo Unilateral Bajo', '{"shoulders","lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-g2_chJIXI4c', 'https://www.youtube.com/watch?v=g2_chJIXI4c', 'https://i.ytimg.com/vi/g2_chJIXI4c/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dominada Neutra', 'Dominada Neutra', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-BR1Q5_ju3Lc', 'https://www.youtube.com/watch?v=BR1Q5_ju3Lc', 'https://i.ytimg.com/vi/BR1Q5_ju3Lc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dominada Supino', 'Dominada Supino', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-EPfAyemSw9Q', 'https://www.youtube.com/watch?v=EPfAyemSw9Q', 'https://i.ytimg.com/vi/EPfAyemSw9Q/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Dominada Prono', 'Dominada Prono', '{"lats","middle back"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-0Erzpm0beGY', 'https://www.youtube.com/watch?v=0Erzpm0beGY', 'https://i.ytimg.com/vi/0Erzpm0beGY/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Subida al Cajón Dinámica', 'Subida al Cajón Dinámica', '{"other"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-P91zQ5aozBc', 'https://www.youtube.com/watch?v=P91zQ5aozBc', 'https://i.ytimg.com/vi/P91zQ5aozBc/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Subida al Cajón Lateral', 'Subida al Cajón Lateral', '{"shoulders"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-jbt1HpqzZRg', 'https://www.youtube.com/watch?v=jbt1HpqzZRg', 'https://i.ytimg.com/vi/jbt1HpqzZRg/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Subida al Cajon Frontal', 'Subida al Cajon Frontal', '{"other"}', '{"other"}', 'intermediate', 'strength', 'custom', 'yt-DXanWesS8OU', 'https://www.youtube.com/watch?v=DXanWesS8OU', 'https://i.ytimg.com/vi/DXanWesS8OU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos con Despegue', 'Fondos con Despegue', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-6eVzXx41EDI', 'https://www.youtube.com/watch?v=6eVzXx41EDI', 'https://i.ytimg.com/vi/6eVzXx41EDI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos Spiderman', 'Fondos Spiderman', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-MzZtMp12hwI', 'https://www.youtube.com/watch?v=MzZtMp12hwI', 'https://i.ytimg.com/vi/MzZtMp12hwI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos Superman', 'Fondos Superman', '{"triceps"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-vAukxkivJQo', 'https://www.youtube.com/watch?v=vAukxkivJQo', 'https://i.ytimg.com/vi/vAukxkivJQo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos Cerrados', 'Fondos Cerrados', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-zqXtkVGsQVs', 'https://www.youtube.com/watch?v=zqXtkVGsQVs', 'https://i.ytimg.com/vi/zqXtkVGsQVs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos', 'Fondos', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-LDpNvyS5rjs', 'https://www.youtube.com/watch?v=LDpNvyS5rjs', 'https://i.ytimg.com/vi/LDpNvyS5rjs/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Fondos con Rodillas', 'Fondos con Rodillas', '{"triceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-nzIBb7_4muQ', 'https://www.youtube.com/watch?v=nzIBb7_4muQ', 'https://i.ytimg.com/vi/nzIBb7_4muQ/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha Lateral + Abd de Cadera', 'Plancha Lateral + Abd de Cadera', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-Ga-TC7ZsKDI', 'https://www.youtube.com/watch?v=Ga-TC7ZsKDI', 'https://i.ytimg.com/vi/Ga-TC7ZsKDI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha + Rotación', 'Plancha + Rotación', '{"abdominals"}', '{"body only"}', 'intermediate', 'flexibility', 'custom', 'yt-zg_zNMCZ7W4', 'https://www.youtube.com/watch?v=zg_zNMCZ7W4', 'https://i.ytimg.com/vi/zg_zNMCZ7W4/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha Un Apoyo Superior', 'Plancha Un Apoyo Superior', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-NqcC7gn8Bdo', 'https://www.youtube.com/watch?v=NqcC7gn8Bdo', 'https://i.ytimg.com/vi/NqcC7gn8Bdo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha + Ext. De Cadera', 'Plancha + Ext. De Cadera', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-iyzngG1GFtA', 'https://www.youtube.com/watch?v=iyzngG1GFtA', 'https://i.ytimg.com/vi/iyzngG1GFtA/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha + Abd de Cadera', 'Plancha + Abd de Cadera', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-X9X6Ou5sbSM', 'https://www.youtube.com/watch?v=X9X6Ou5sbSM', 'https://i.ytimg.com/vi/X9X6Ou5sbSM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha Apoyo Cruzado', 'Plancha Apoyo Cruzado', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-DOGLLdsdHqI', 'https://www.youtube.com/watch?v=DOGLLdsdHqI', 'https://i.ytimg.com/vi/DOGLLdsdHqI/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Plancha Un Apoyo Inferior', 'Plancha Un Apoyo Inferior', '{"abdominals"}', '{"body only"}', 'intermediate', 'balance', 'custom', 'yt-7kLH88w-wGM', 'https://www.youtube.com/watch?v=7kLH88w-wGM', 'https://i.ytimg.com/vi/7kLH88w-wGM/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla Sumo', 'Sentadilla Sumo', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt--2-jCCJkvbo', 'https://www.youtube.com/watch?v=-2-jCCJkvbo', 'https://i.ytimg.com/vi/-2-jCCJkvbo/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge + Salto', 'Lunge + Salto', '{"quadriceps"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-cWzF_arOfCU', 'https://www.youtube.com/watch?v=cWzF_arOfCU', 'https://i.ytimg.com/vi/cWzF_arOfCU/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Salto Vertical', 'Salto Vertical', '{"chest"}', '{"body only"}', 'intermediate', 'cardio', 'custom', 'yt-Jzm_G_6i77w', 'https://www.youtube.com/watch?v=Jzm_G_6i77w', 'https://i.ytimg.com/vi/Jzm_G_6i77w/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Lunge Dinámico Lateral', 'Lunge Dinámico Lateral', '{"shoulders","quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-QxYLOKJxgeE', 'https://www.youtube.com/watch?v=QxYLOKJxgeE', 'https://i.ytimg.com/vi/QxYLOKJxgeE/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;

INSERT INTO exercises (id, trainer_id, name, name_es, muscle_groups, equipment, difficulty, category, source, source_id, video_url, thumbnail_url)
VALUES (gen_random_uuid(), '3b0a1f7d-9b63-47d7-90ec-ea4a0745a06f', 'Sentadilla libre', 'Sentadilla libre', '{"quadriceps"}', '{"body only"}', 'intermediate', 'strength', 'custom', 'yt-PKHbHagnQec', 'https://www.youtube.com/watch?v=PKHbHagnQec', 'https://i.ytimg.com/vi/PKHbHagnQec/mqdefault.jpg')
ON CONFLICT (source, source_id) DO NOTHING;
