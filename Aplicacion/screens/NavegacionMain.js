import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

// Screens del proyecto.
import PresupuestoScreen from './PresupuestoScreen';
import InicioSesion from './InicioSesionScreen';
import NotificacionesScreen from './NotificacionesScreen';
import GraficosScreen from './GraficasScreen';
import ConfiguracionScreen from './ConfiguracionScreen';
import TransaccionesScreen from './TransaccionesScreen';
import InicioScreen from './InicioScreen';
import RegistroScreen from './RegistroScreen'

const Tab = createBottomTabNavigator();

export default function NavegacionMain() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Transacciones') {
              iconName = focused ? 'receipt' : 'receipt-outline';
            } else if (route.name === 'Presupuestos') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'Graficas') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Ajustes') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          
    tabBarActiveTintColor: 'white',
    tabBarInactiveTintColor: 'white',
    headerShown: false,
    tabBarLabelPosition: 'below-icon',        

    tabBarStyle: {
      backgroundColor: '#6200ee',
      height: 70,
      paddingTop: 8,
      borderTopWidth: 0,        
      elevation: 0,             
      shadowOpacity: 0,         
    },
        
      tabBarLabelStyle: {
      fontSize: 10,
      textAlign: 'center',
      width: 80
    },

    })}
      >
        <Tab.Screen name="Inicio" component={InicioScreen} />
        <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
        <Tab.Screen name="Presupuestos" component={PresupuestoScreen} />
        <Tab.Screen name="Graficas" component={GraficosScreen} />
        <Tab.Screen name="Ajustes" component={ConfiguracionScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}