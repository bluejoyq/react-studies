import { ReactElement, useEffect, useState } from 'react';

export enum type {
  'Number',
  'Operation',
}

let operations: Array<string> = [];
let curType: number = type.Number;

export const App = (): ReactElement => {
  const [display, setDisplay] = useState<string>('0');

  const calculateResult = () => {
    if (operations.length <= 1) {
      return;
    }
    operations.push(display);
    if (operations.length % 2 === 0) {
      return;
    }

    let result = Number(operations[0]);
    for (let i = 2; i < operations.length; i = i + 2) {
      const operation = operations[i - 1];
      const num = Number(operations[i]);
      if (operation == '+') {
        result += num;
      } else if (operation == '-') {
        result -= num;
      } else if (operation == '/') {
        if (num == 0) {
          operations = [];
          curType = type.Number;
          setDisplay('ERROR');
          return;
        }
        result /= num;
      } else if (operation == '*') {
        result *= num;
      }
    }

    if (isOverflow(result.toString())) {
      handleOverflow();
      return;
    }
    operations = [result.toString()];
    curType = type.Number;
    setDisplay(result.toString());
  };

  const clearDisplay = () => {
    operations = [];
    curType = type.Number;
    setDisplay('0');
  };

  const isOverflow = (num: string) => {
    return num.length >= 10;
  };

  const handleOverflow = () => {
    operations = [];
    curType = type.Number;
    setDisplay('Overflow');
  };

  const addNumber = (num: string) => {
    if (isOverflow(display)) {
      handleOverflow();
      return;
    }

    if (num === '.' && display[display.length - 1] === '.') {
      return;
    }

    if (curType === type.Number || display === '0') {
      curType = type.Operation;
      setDisplay(num);
      if (operations.length == 1) {
        operations = [];
      }
    } else {
      setDisplay(display + num);
    }
  };

  const selectOperation = (op: string) => {
    if (op == '+/-') {
      setDisplay((Number(display) * -1).toString());
    } else if (op == '%') {
      setDisplay((Number(display) / 100).toString());
    } else {
      if (operations.length === 1) {
        operations.push(op);
        curType = type.Number;
        return;
      }
      if (curType === type.Operation) {
        operations.push(display);
        operations.push(op);
        curType = type.Number;
      }
    }
  };

  const handleKeyUp = (e: any) => {
    if (e.key === 'Enter') {
      calculateResult();
    } else if (e.key === 'Add') {
      selectOperation('+');
    } else if (e.key === 'Subtract') {
      selectOperation('-');
    } else if (e.key === 'Divide') {
      selectOperation('/');
    } else if (e.key === 'Multiply') {
      selectOperation('*');
    } else if (e.key === 'Escape') {
      clearDisplay();
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div
      css={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        gap: 2,
        backgroundColor: 'black',
      }}
    >
      <div
        css={{
          textAlign: 'right',
          backgroundColor: '#383a40',
          color: 'lightgray',
          fontSize: '15vmin',
          width: '90%',
        }}
      >
        <div css={{ marginRight: '5px' }}>{display}</div>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: `repeat(${4}, 1fr)`,
          gridTemplateRows: `repeat(${4}, 1fr)`,
          gridGap: 2,
          width: '90%',
          height: '100%',
        }}
      >
        <button
          css={{
            backgroundColor: '#2c2e34',
            color: 'lightgray',
            aspectRatio: '1/1',
            border: 'none',
            fontSize: '8vmin',
          }}
          onClick={clearDisplay}
        >
          AC
        </button>
        <button
          onClick={() => {
            selectOperation('+/-');
          }}
        >
          +/-
        </button>
        <button
          onClick={() => {
            selectOperation('%');
          }}
        >
          %
        </button>
        <button
          onClick={() => {
            selectOperation('/');
          }}
        >
          /
        </button>
        <button onClick={() => addNumber('7')}>7</button>
        <button onClick={() => addNumber('8')}>8</button>
        <button onClick={() => addNumber('9')}>9</button>
        <button
          onClick={() => {
            selectOperation('*');
          }}
        >
          *
        </button>
        <button onClick={() => addNumber('4')}>4</button>
        <button onClick={() => addNumber('5')}>5</button>
        <button onClick={() => addNumber('6')}>6</button>
        <button
          onClick={() => {
            selectOperation('-');
          }}
        >
          -
        </button>
        <button onClick={() => addNumber('3')}>3</button>
        <button onClick={() => addNumber('2')}>2</button>
        <button onClick={() => addNumber('1')}>1</button>
        <button
          onClick={() => {
            selectOperation('+');
          }}
        >
          +
        </button>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: `2fr 1fr 1fr`,
          gridGap: 2,
          width: '90%',
          height: '100%',
        }}
      >
        <button
          css={{
            backgroundColor: '#2c2e34',
            color: 'lightgray',
            aspectRatio: '2/1',
            border: 'none',
            fontSize: '8vmin',
          }}
          onClick={() => addNumber('0')}
        >
          0
        </button>
        <button onClick={() => addNumber('.')}>.</button>
        <button onClick={calculateResult}>=</button>
      </div>
    </div>
  );
};
