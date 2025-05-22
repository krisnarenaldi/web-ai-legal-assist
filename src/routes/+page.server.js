import { supabase } from '$lib/supabaseClient.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  let creditValue = null;
  
  try {
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    console.log("userData",userData);
    
    if (userData?.user?.id) {
      // Fetch credit for this user
      const { data, error } = await supabase
        .from('credit_contract_reviews')
        .select('credit')
        .eq('user_id', userData.user.id)
        .single();
        
      if (!error && data) {
        creditValue = data.credit;
      }
    }
  } catch (err) {
    console.error('Error in server load function:', err);
  }
  
  return {
    creditValue
  };
}
