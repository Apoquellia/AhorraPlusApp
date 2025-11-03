import React, { useState } from "react";
import { View, Image, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native'; 
import AppLogo from './../assets/money.png';


const InicioSesion = () => {
    const [Usuario, setUsuario] = useState('');
    const [Contraseña, setContraseña] = useState('');

    const handleLoginPress = () => {
        Alert.alert("Acción de Login", "Presionaste Iniciar Sesión. Implementa la lógica aquí.");
    };

    return (
        <View style={styles.fullContainer}> 

            <View style={styles.container}>
                <Text style={styles.title}>Ahorra+ App</Text>

            <Image 
            source={AppLogo}
            style={styles.logo}
            />

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

              
                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLoginPress} 
                >
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80, 
        backgroundColor: '#ffffffff',
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
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6000EA',
    },
    input: {
        width: '80%',
        fontSize: 25,
        height: '60',
        borderWidth: 1, 
        color: '#ffffff',
        borderColor: '#6000EA',
        padding: 12,
        borderRadius: 9,
        backgroundColor: '#6200ea3a'
    },
    Restablecer: { 
        marginTop: 5,
        marginBottom: 10,
        fontSize: 14,
        color: '#6000EA', 
        textDecorationLine: 'underline',
    },
    loginButton: {
        backgroundColor: '#6000EA', 
        height: '60',
        paddingVertical: 12,        
        paddingHorizontal:91.5,
        borderRadius: 9,            
        alignItems: 'center',       
        justifyContent: 'center',  
    },
    buttonText: {
        color: '#ffffffff',          
        fontSize: 25,               
        fontWeight: 'bold',        
    },
    
});

export default InicioSesion;


