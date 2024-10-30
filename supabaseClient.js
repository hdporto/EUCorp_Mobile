import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eqkwwbmbswmpjpfzttov.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3d3Ym1ic3dtcGpwZnp0dG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMDgzMTAsImV4cCI6MjA0NDg4NDMxMH0.ls_6JYk4ofeuvkr3X6aJtqJ3I9FoDxZd4wWbt0OJDlU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchNotifications = async (userId) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  
    return data;
  };
  

  export const sendNotification = async (userId, message) => {
    const { error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, message }]);
  
    if (error) {
      console.error('Error sending notification:', error);
    }
  };
  

  export const markNotificationAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  
    if (error) {
      console.error('Error marking notification as read:', error);
    }
  };