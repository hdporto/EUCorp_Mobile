import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../../../supabaseClient';

const AdminDetails = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const user = useUser();

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setEmail(user.email);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
          return;
        }

        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setProfilePic(data.profile_pic || null);
          setProfileExists(true);
        }
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    setHasChanges(
      firstName !== '' || lastName !== '' || profilePic !== null
    );
  }, [firstName, lastName, profilePic]);

  const handleInsert = async () => {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        profile_pic: profilePic,
      });

    if (error) {
      console.error('Error inserting profile:', error.message);
      Alert.alert('Error', 'Error adding profile. Please try again.');
      return;
    }

    Alert.alert('Success', 'Profile added successfully!');
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        profile_pic: profilePic,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'Error updating profile. Please try again.');
      return;
    }

    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSave = async () => {
    setLoading(true);
    if (profileExists) {
      await handleUpdate();
    } else {
      await handleInsert();
    }
    setLoading(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Logout method from Supabase

    if (error) {
      console.error('Error logging out:', error.message);
      Alert.alert('Error', 'Error logging out. Please try again.');
      return;
    }

    Alert.alert('Success', 'Logged out successfully!');
    // Optionally navigate to login screen or home screen after logout
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* Profile Picture Selection */}
      <View style={styles.imageContainer}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>Pick a Profile Picture</Text>
        )}
        <TouchableOpacity onPress={pickImage} style={styles.editButton}>
          <Text style={styles.hoverText}>Select Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={false}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity
          style={[styles.button, { opacity: hasChanges ? 1 : 0.5 }]}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
  editButton: {
    marginTop: 10,
  },
  hoverText: {
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#dc3545', // Bootstrap danger color for logout
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminDetails;