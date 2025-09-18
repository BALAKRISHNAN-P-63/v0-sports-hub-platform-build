-- Insert sample challenges for different sports
INSERT INTO public.challenges (title, description, sport, difficulty_level, requirements, reward_points, expires_at) VALUES
(
  'Perfect Free Throw Challenge',
  'Record yourself making 10 consecutive free throws with proper form. Focus on consistent shooting stance and follow-through.',
  'Basketball',
  'beginner',
  ARRAY['Basketball', 'Hoop access', 'Video recording capability'],
  100,
  NOW() + INTERVAL '30 days'
),
(
  'Sprint Technique Analysis',
  'Record a 50-meter sprint focusing on proper running form. Our AI will analyze your posture, stride length, and technique.',
  'Track and Field',
  'intermediate',
  ARRAY['50m track or straight path', 'Video recording from side angle'],
  150,
  NOW() + INTERVAL '45 days'
),
(
  'Soccer Ball Control Mastery',
  'Demonstrate advanced ball control skills including juggling, dribbling through cones, and precision passing.',
  'Soccer',
  'advanced',
  ARRAY['Soccer ball', '6 cones or markers', 'Open space'],
  200,
  NOW() + INTERVAL '60 days'
),
(
  'Perfect Push-up Form',
  'Record yourself performing 20 push-ups with perfect form. AI will analyze your body alignment and movement quality.',
  'Fitness',
  'beginner',
  ARRAY['Exercise mat (optional)', 'Clear floor space'],
  75,
  NOW() + INTERVAL '30 days'
),
(
  'Tennis Serve Technique',
  'Record your tennis serve from multiple angles. Focus on proper grip, stance, and follow-through for maximum power and accuracy.',
  'Tennis',
  'intermediate',
  ARRAY['Tennis racket', 'Tennis balls', 'Court access'],
  125,
  NOW() + INTERVAL '45 days'
);
