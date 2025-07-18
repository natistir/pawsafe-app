import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { SettingsScreenNavigationProp } from '../types';

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>⚙️ Settings</Title>
          <Paragraph>Temperature Unit: Fahrenheit</Paragraph>
          <Paragraph>Location Services: Enabled</Paragraph>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Back to Home
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    elevation: 4,
  },
});

export default SettingsScreen;
