import { useEffect, useState } from 'react';
import { Alert, StyleSheet, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';

import { CLEAR, colors, colorsToEmoji, ENTER } from './src/constants';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

export default function App() {
  const word = 'hello';
  const letters = word.split('');

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('active');

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const checkGameState = () => {
    if (checkIfCorrect() && gameState !== 'won') {
      Alert.alert('Hurray!', 'Correct answer', [{ text: 'Share', onPress: shareScore }]);
      setGameState('won');
    } else if (checkIfWrong() && gameState !== 'lost') {
      Alert.alert('Out tries :(', 'Try again tomorrow...');
      setGameState('lost');
    }
  };

  const shareScore = () => {
    const shareText = rows
      .map((row, i) => row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join(''))
      .filter((row) => row)
      .join('\n');

    Clipboard.setString(shareText);

    Alert.alert('Copied successfully', 'Share your score on your social media');
  };

  const checkIfCorrect = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfWrong = () => !checkIfCorrect() && curRow === rows.length;

  const onKeyPressed = (key) => {
    if (gameState !== 'active') return;

    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;

      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = '';

        setRows(updatedRows);
        setCurCol(prevCol);
      }

      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;

      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) return colors.black;
    if (letter === letters[col]) return colors.primary;
    if (letters.includes(letter)) return colors.secondary;

    return colors.darkgrey;
  };

  const coloredKeycaps = (color) => {
    return rows.flatMap((row, i) => row.filter((cell, j) => getCellBGColor(i, j) === color));
  };

  const greenCaps = coloredKeycaps(colors.primary);
  const yellowCaps = coloredKeycaps(colors.secondary);
  const greyCaps = coloredKeycaps(colors.darkgrey);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View style={styles.row} key={`row-${i}`}>
            {row.map((letter, j) => (
              <View
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j) ? colors.lightgrey : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}
                key={`row-${i}-${j}`}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
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
