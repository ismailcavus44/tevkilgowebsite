// Tarayıcıdaki oturumun kullanıcısını döndürür. Oturum o an tazeleniyorsa ilk okuma
// boş dönebiliyor; bu durumda oturum bir kez yenilenip tekrar denenir.
export async function oturumKullanicisi(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return user;
  const { data } = await supabase.auth.refreshSession();
  return data?.user ?? null;
}
