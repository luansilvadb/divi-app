-- Seed: Default categories for new users
-- NOTE: This seed should be run per-user after signup.
-- Replace the user_id value or use a function parameter.

-- Usage via Supabase SQL Editor:
--   1. Replace '<USER_ID>' with the actual user UUID
--   2. Run the query

INSERT INTO categories (user_id, name, icon, color) VALUES
  ('<USER_ID>', 'Alimentação', '🍽️', '#FF6B6B'),
  ('<USER_ID>', 'Transporte', '🚗', '#4ECDC4'),
  ('<USER_ID>', 'Moradia', '🏠', '#45B7D1'),
  ('<USER_ID>', 'Lazer', '🎮', '#96CEB4'),
  ('<USER_ID>', 'Saúde', '💊', '#FFEAA7'),
  ('<USER_ID>', 'Educação', '📚', '#DDA0DD'),
  ('<USER_ID>', 'Vestuário', '👕', '#98D8C8'),
  ('<USER_ID>', 'Serviços', '📱', '#F7DC6F'),
  ('<USER_ID>', 'Investimentos', '📈', '#82E0AA'),
  ('<USER_ID>', 'Salário', '💰', '#85C1E9'),
  ('<USER_ID>', 'Freelance', '💻', '#BB8FCE'),
  ('<USER_ID>', 'Outros', '📦', '#AEB6BF')
ON CONFLICT DO NOTHING;
