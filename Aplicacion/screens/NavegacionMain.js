import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

import InicioSesion from './InicioSesionScreen';
import RegistroScreen from './RegistroScreen';
import RecuperarContrasena from './RecuperarContrasenaScreen';

import InicioScreen from './InicioScreen';
import TransaccionesScreen from './TransaccionesScreen';
import PresupuestoScreen from './PresupuestoScreen';
import GraficosScreen from './GraficasScreen';
import ConfiguracionScreen from './ConfiguracionScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Transacciones') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Presupuestos') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Graficas') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Ajustes') iconName = focused ? 'settings' : 'settings-outline';
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
          shadowOpacity: 0
        },
        tabBarLabelStyle: {
          fontSize: 10,
          textAlign: 'center',
          width: 80
        }
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
      <Tab.Screen name="Presupuestos" component={PresupuestoScreen} />
      <Tab.Screen name="Graficas" component={GraficosScreen} />
      <Tab.Screen name="Ajustes" component={ConfiguracionScreen} />
    </Tab.Navigator>
  );
}

export default function NavegacionMain() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={InicioSesion} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Restablecer" component={RecuperarContrasena} />
        <Stack.Screen name="HomeTabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
