import 'react-native-get-random-values';
import { Slot, usePathname, useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Text, useColorScheme } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import { Home, ShoppingBag, Package, BarChart2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  
  // Only show bottom tabs on main screens
  const showBottomTabs = ['/', '/index', '/sales', '/inventory', '/analytics'].includes(pathname);
  
  // Define navigation items with explicit path types
  const navItems = [
    { name: 'Home', icon: Home, path: '/' as const },
    { name: 'Sales', icon: ShoppingBag, path: '/sales' as const },
    { name: 'Inventory', icon: Package, path: '/inventory' as const },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' as const },
  ];
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF', 
    },
    content: {
      flex: 1,
    },
    contentWithNav: {
      paddingBottom: 60, 
    },
    bottomNav: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      right: 20,
      flexDirection: 'row',
      borderTopWidth: 1,
      paddingTop: 8,
      borderRadius: 30,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      paddingVertical: 6,
    },
    navText: {
      fontSize: 12,
      marginTop: 4,
      fontFamily: 'Inter-Medium',
    },
    activeIndicator: {
      position: 'absolute',
      top: 0,
      width: 4,
      height: 4,
      borderRadius: 2,
    }
  });
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <View style={[styles.content, showBottomTabs && styles.contentWithNav]}>
          <Slot />
        </View>
      
      {showBottomTabs && (
        <View style={[
          styles.bottomNav,
          {
            paddingBottom: Math.max(8, insets.bottom)
          }
        ]}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || 
                            (item.path === '/' && pathname === '/index');
            
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => router.push(item.path)}
              >
                <item.icon
                  size={24}
                  color={isActive ? '#007AFF' : '#999999'} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.navText,
                    {
                      color: isActive ? '#007AFF' : '#999999',
                      fontWeight: isActive ? '600' : 'normal',
                      fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Regular'
                    }
                  ]}
                >
                  {item.name}
                </Text>
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: '#007AFF' }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      </View>
    </GestureHandlerRootView>
  );
}
