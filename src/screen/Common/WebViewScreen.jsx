import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const WebViewScreen = ({ route, navigation }) => {
  const { url } = route.params;

  const secureUrl = url?.replace(/^http:\/\//i, 'https://');
  const encodedUrl = encodeURI(secureUrl);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffffff' }}>
        <View style={{ flex: 1, backgroundColor: '#ffffffff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <StatusBar backgroundColor="#ffffffff" barStyle="dark-content" />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <WebView source={{ uri: encodedUrl }} style={{ flex: 1 }} /></View>

      </SafeAreaView>
    </SafeAreaProvider>

  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  backText: {
    fontSize: 18,
    fontWeight:'600',
    color: '#007aff',
  },
});

export default WebViewScreen;