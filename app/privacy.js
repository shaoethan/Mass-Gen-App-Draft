import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Privacy Policy</Text>

      <Text style={styles.paragraph}>
        This privacy policy applies to the Actipain Tracker app (“Application”), created by Massachusetts General Hospital (“Service Provider”) as a free service. It is provided “AS IS”.
      </Text>

      <Text style={styles.subheading}>Information Collection and Use</Text>
      <Text style={styles.paragraph}>
        We collect data such as IP address, operating system, app usage, and accelerometer sensor data. This is used for research on pain-related activity patterns. No precise location is collected. Firebase is used to store your data securely.
      </Text>

      <Text style={styles.subheading}>User Consent</Text>
      <Text style={styles.paragraph}>
        By using the app, you consent to this data collection. You may stop by uninstalling the app or emailing us to request data deletion.
      </Text>

      <Text style={styles.subheading}>Third-Party Access</Text>
      <Text style={styles.paragraph}>
        Only anonymized, aggregated data may be shared with research collaborators. We do not sell or share user data for tracking or advertising.
      </Text>

      <Text style={styles.subheading}>Opt-Out & Data Retention</Text>
      <Text style={styles.paragraph}>
        To delete your data, contact us at actipaintracker@gmail.com with your user ID. We will delete your records within 30 days.
      </Text>

      <Text style={styles.subheading}>Children</Text>
      <Text style={styles.paragraph}>
        This app is not intended for children under 13. No data is knowingly collected from them.
      </Text>

      <Text style={styles.subheading}>Security</Text>
      <Text style={styles.paragraph}>
        We use reasonable measures to protect your data, including secure storage on Firebase.
      </Text>

      <Text style={styles.subheading}>Medical Disclaimer</Text>
      <Text style={styles.paragraph}>
        This app is for research and educational purposes only. It is not a medical device and does not diagnose or treat conditions.
      </Text>

      <Text style={styles.subheading}>Changes</Text>
      <Text style={styles.paragraph}>
        This policy may be updated. Continued use of the app means you accept any changes.
      </Text>

      <Text style={styles.subheading}>Contact Us</Text>
      <Text style={styles.paragraph}>
        Questions? Email actipaintracker@gmail.com
      </Text>

      <Text style={styles.footer}>Effective: July 10, 2025</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subheading: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20
  },
  footer: {
    fontSize: 12,
    color: 'gray',
    marginTop: 20
  }
});
