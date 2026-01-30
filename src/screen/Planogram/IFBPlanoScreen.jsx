import React from 'react';
import { View, Alert, Vibration } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      body { margin:0; background:black; }
      video { width:100%; height:100%; object-fit:cover; }
      #msg { position:fixed; top:10px; color:white; z-index:10; }
    </style>
  </head>
  <body>
    <div id="msg">Initializing camera...</div>
    <video id="video" autoplay></video>

    <script>
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          document.getElementById("video").srcObject = stream;
          document.getElementById("msg").innerText = "Camera started";
        })
        .catch(err => {
          document.getElementById("msg").innerText = "Camera error: " + err;
        });
    </script>
  </body>
</html>
`;

const IFBPlanoScreen = () => {
  const onMessage = (event) => {
    const barcode = event.nativeEvent.data;

    Vibration.vibrate(200);
    Alert.alert('Barcode Scanned', barcode);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ html }}
        javaScriptEnabled
        onMessage={onMessage}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

export default IFBPlanoScreen;
