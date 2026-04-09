import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import CustomSafeArea from '@/src/components/CustomSafeArea'
import { useRouter } from 'expo-router'
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

const LandingPage = () => {
  const router = useRouter();

  return (
    <CustomSafeArea>
      <View style={styles.container}>
        {/* Top Visual Section */}
        <View style={styles.visualSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <FontAwesome5 name="hands-helping" size={40} color="#fff" />
            </View>
            <Text style={styles.appName}>JanSeva</Text>
          </View>
          <View style={styles.illustrationPlaceholder}>
            <MaterialIcons name="location-city" size={120} color="#e2e8f0" />
            <View style={styles.floatingBadge}>
              <MaterialIcons name="check-circle" size={24} color="#10b981" />
              <Text style={styles.badgeText}>Verified Issues</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.headline}>Build a Better Community Together</Text>
          <Text style={styles.subHeadline}>
            Report local issues, track progress, and contribute to your neighborhood's improvement in real-time.
          </Text>

          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryBtn} 
              activeOpacity={0.8}
              onPress={() => router.push('/ResidentAuth')}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryBtn} 
              activeOpacity={0.7}
              onPress={() => router.push('/ResidentAuth')}
            >
              <Text style={styles.secondaryBtnText}>Already have an account? Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <MaterialIcons name="speed" size={24} color="#0c92cb" />
            <Text style={styles.featureLabel}>Fast</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialIcons name="security" size={24} color="#0c92cb" />
            <Text style={styles.featureLabel}>Secure</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialIcons name="people" size={24} color="#0c92cb" />
            <Text style={styles.featureLabel}>Community</Text>
          </View>
        </View>
      </View>
    </CustomSafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  visualSection: {
    height: height * 0.45,
    backgroundColor: '#0c92cb',
    borderBottomLeftRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  illustrationPlaceholder: {
    width: width * 0.7,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 36,
    marginBottom: 15,
  },
  subHeadline: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 40,
  },
  actionContainer: {
    gap: 15,
  },
  primaryBtn: {
    backgroundColor: '#0c92cb',
    paddingVertical: 18,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 8,
    shadowColor: '#0c92cb',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
  },
})

export default LandingPage