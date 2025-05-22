import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient.js';

// Create a writable store for credit
export const credit = writable(null);

// Function to fetch credit
export async function fetchCredit(uuid) {
  if (!uuid) {
    credit.set(null);
    return;
  }
  
  try {
    const { data, error } = await supabase
      .from('credit_contract_reviews')
      .select('credit')
      .eq('user_id', uuid)
      .single();
      
    if (error) {
      console.error('Error fetching credit:', error);
      credit.set(null);
      return;
    }
    
    credit.set(data?.credit ?? null);
  } catch (err) {
    console.error('Exception fetching credit:', err);
    credit.set(null);
  }
}

// Function to decrement credit after successful API call
export async function decrementCredit(uuid) {
  if (!uuid) {
    console.error('Cannot decrement credit: No user ID provided');
    return false;
  }
  
  try {
    // First get current credit value
    const { data: currentData, error: fetchError } = await supabase
      .from('credit_contract_reviews')
      .select('credit')
      .eq('user_id', uuid)
      .single();
      
    if (fetchError) {
      console.error('Error fetching current credit:', fetchError);
      return false;
    }
    
    if (currentData?.credit === null || currentData?.credit === undefined) {
      console.error('No credit record found for user');
      return false;
    }
    
    // Ensure credit doesn't go below 0
    const newCredit = Math.max(0, currentData.credit - 1);
    
    // Update the credit in the database
    const { error: updateError } = await supabase
      .from('credit_contract_reviews')
      .update({ credit: newCredit })
      .eq('user_id', uuid);
      
    if (updateError) {
      console.error('Error updating credit:', updateError);
      return false;
    }
    
    // Update the store
    credit.set(newCredit);
    console.log('Credit decremented to:', newCredit);
    return true;
  } catch (err) {
    console.error('Exception decrementing credit:', err);
    return false;
  }
}