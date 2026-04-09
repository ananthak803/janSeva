import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native'
import React, { useState } from 'react'
import CustomSafeArea from '@/src/components/CustomSafeArea'
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const Settings = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    router.replace('/(auth)');
  }

  const SettingItem = ({ icon, label, onPress, rightElement, color = "#64748b" }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      {rightElement ? rightElement : (
        <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
      )}
    </TouchableOpacity>
  );

  return (
    <CustomSafeArea>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <MaterialIcons name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'Not logged in'}</Text>
        </View>

        {/* Settings Groups */}
        <View style={styles.groupsContainer}>
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Account</Text>
            <SettingItem 
              icon="person-outline" 
              label="Profile Information" 
              onPress={() => {}} 
              color="#0c92cb"
            />
            <SettingItem 
              icon="notifications-none" 
              label="Notifications" 
              rightElement={
                <Switch 
                  value={notifications} 
                  onValueChange={setNotifications}
                  trackColor={{ false: "#e2e8f0", true: "#0c92cb" }}
                  thumbColor="#fff"
                />
              }
              color="#f59e0b"
            />
            <SettingItem 
              icon="lock-outline" 
              label="Privacy & Security" 
              onPress={() => {}} 
              color="#10b981"
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.groupTitle}>Support & About</Text>
            <SettingItem 
              icon="help-outline" 
              label="Help Center" 
              onPress={() => {}} 
              color="#6366f1"
            />
            <SettingItem 
              icon="info-outline" 
              label="About JanSeva" 
              onPress={() => {}} 
              color="#8b5cf6"
            />
            <SettingItem 
              icon="feedback" 
              label="Send Feedback" 
              onPress={() => {}} 
              color="#ec4899"
            />
          </View>

          <View style={styles.group}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>JanSeva Version 1.0.0</Text>
        </View>
      </ScrollView>
    </CustomSafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0c92cb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#f0f9ff',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1e293b',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  groupsContainer: {
    padding: 20,
    gap: 25,
  },
  group: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
})

export default Settings