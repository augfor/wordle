import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { colors } from './src/constants';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 6;

export default function App() {
  const word = 'hello';
  const letters = word.split('');

  const rows = new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('a'));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View style={styles.row} key={i}>
            {row.map((cell, i) => (
              <View style={styles.cell} key={i}>
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: 'lightgrey',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
  },
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
    height: 100,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  },
});
