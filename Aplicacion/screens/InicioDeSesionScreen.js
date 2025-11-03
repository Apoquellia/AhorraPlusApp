import React, { useState } from "react";
import { View, Image, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'; 
import AppLogo from './../assets/money.png';


const InicioSesion = () => {
    const [Usuario, setUsuario] = useState('');
    const [Contraseña, setContraseña] = useState('');

    const handleLoginPress = () => {
        Alert.alert("Acción de Login", "Presionaste Iniciar Sesión. Implementa la lógica aquí.");
    };

    return (
        <View style={styles.fullContainer}> 
            
            <Image 
                source={AppLogo}
                style={styles.logo}
            />

            <View style={styles.container}>
                <Text style={styles.title}>Ahorra+ App</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    value={Usuario}
                    onChangeText={setUsuario}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={Contraseña}
                    onChangeText={setContraseña}
                    secureTextEntry={true}
                    autoCapitalize="none"
                />

                <Text style={styles.Restablecer}>¿Olvidó su contraseña?</Text>

              
                <Button 
                    title="Iniciar Sesión" 
                    onPress={handleLoginPress} 
                    color="#fff347ff"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80, 
        backgroundColor: '#f8ffd3ff', 
    },
    logo: {
        width: 120, 
        height: 120,
        marginBottom: 30,
        resizeMode: 'contain', 
    },
    container: {
        width: '100%',
        alignItems: 'center',
        padding: 20,
        gap: 15,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        borderWidth: 1, 
        color: 'white',
        borderColor: '#0a0513ff',
        padding: 12,
        borderRadius: 9,
        backgroundColor: 'black'
    },
    Restablecer: { 
        marginTop: 5,
        marginBottom: 10,
        fontSize: 14,
        color: '#100380ff', 
        textDecorationLine: 'underline',
    }
});

export default InicioSesion;