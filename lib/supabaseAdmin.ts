import { createClient } from '@supabase/supabase-js';

// ⚠️ SUNUCU TARAFI — service_role anahtarı RLS'i bypass eder ve TAM yetkiye sahiptir.
// Bu modül ASLA bir client bileşeninden import edilmemeli. SUPABASE_SERVICE_ROLE_KEY
// NEXT_PUBLIC_ ön eki taşımadığı için client bundle'a girmez; yine de kazara kullanımı
// engellemek için aşağıdaki guard var.
if (typeof window !== 'undefined') {
  throw new Error('supabaseAdmin yalnızca sunucu tarafında kullanılabilir.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Eksik ortam değişkeni: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı'
  );
}

// Service-role client: RLS'i bypass eder. Sadece güvenilir sunucu route'larında kullan.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

