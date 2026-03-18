import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NeoInputProps {
  text: string;
  color: string;
  onChangeText?: (text: string) => void;
  value?: string;
    width?: number;
    height?: number;
    secureTextEntry?: boolean;
}


export default function NeoInput({ text, color, onChangeText, value, width, height, secureTextEntry = false}: NeoInputProps) {
    return (
        <View style={[styles.wrapper, { width: width, height: height, position: 'relative', marginBottom: 20 }]}>
            <View style={styles.shadow} />
            <TextInput style={[styles.input, { backgroundColor: color, textAlign: "center" }]} placeholder={text} secureTextEntry={secureTextEntry} onChangeText={onChangeText} value={value}/>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper : { width: '100%', height: '100%' },
    shadow: { position: 'absolute', top: 4, left: 4, width: '100%', height: '100%', backgroundColor: 'black', borderRadius: 15 },
    input: { width: '100%', height: '100%', borderRadius: 15, borderWidth: 3, borderColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 10 },
    text: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});