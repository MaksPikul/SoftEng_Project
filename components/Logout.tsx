import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/loginProvider';



export const logout = async () => {


  try {
    
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('sessionData');
    await AsyncStorage.removeItem('name');
    console.log('User logged out successfully.');
  } catch (error) {
    console.error('Logout error:', error);
  }

};
