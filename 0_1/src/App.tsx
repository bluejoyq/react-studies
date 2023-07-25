import { ReactElement, useEffect, useRef, useState } from 'react';

enum numberType {
  RADIX,
  DECIMAL,
}
enum operationType {
  ADD,
  MINUS,
  MULTIPLE,
  DIVIDE,
  SIGN_CHANGE,
  PERCENTAGE,
}
enum calculationStatusType {
  OK,
  ERROR,
  OVERFLOW,
  END,
}
enum keyType {
  NUMBER,
  OPERATION,
  DOT,
  CLEAR,
  ZERO,
  RESULT,
  OTHER,
}

const keyData = [
  [
    { type: keyType.CLEAR, key: 'AC', value: keyType.CLEAR },
    { type: keyType.OTHER, key: '+/-', value: operationType.SIGN_CHANGE },
    { type: keyType.OTHER, key: '%', value: operationType.PERCENTAGE },
    {
      type: keyType.OPERATION,
      key: '/',
      value: operationType.DIVIDE,
    },
    { type: keyType.NUMBER, key: '7', value: 7 },
    { type: keyType.NUMBER, key: '8', value: 6 },
    { type: keyType.NUMBER, key: '9', value: 5 },
    {
      type: keyType.OPERATION,
      key: '*',
      value: operationType.MULTIPLE,
    },
    { type: keyType.NUMBER, key: '4', value: 4 },
    { type: keyType.NUMBER, key: '5', value: 5 },
    { type: keyType.NUMBER, key: '6', value: 6 },
    { type: keyType.OPERATION, key: '-', value: operationType.MINUS },
    { type: keyType.NUMBER, key: '1', value: 1 },
    { type: keyType.NUMBER, key: '2', value: 2 },
    { type: keyType.NUMBER, key: '3', value: 3 },
    { type: keyType.OPERATION, key: '+', value: operationType.ADD },
  ],
  [
    { type: keyType.ZERO, key: '0', value: keyType.ZERO },
    { type: keyType.DOT, key: '.', value: keyType.DOT },
    { type: keyType.RESULT, key: '=', value: keyType.RESULT },
  ],
];
interface calculationResult {
  status: calculationStatusType;
  result: number | null;
}

export const App = (): ReactElement => {
  const calculationHistory: React.MutableRefObject<number[] | operationType[]> =
    useRef([0]);
  const calculationStatus: React.MutableRefObject<calculationStatusType> =
    useRef(calculationStatusType.END);
  const inputNumberType: React.MutableRefObject<numberType> = useRef(
    numberType.RADIX
  );
  const [display, setDisplay] = useState<string>('0');

  const calculate = (
    num1: number,
    num2: number,
    operation: operationType
  ): calculationResult => {
    switch (operation) {
      case operationType.ADD:
        return { status: calculationStatusType.OK, result: num1 + num2 };
      case operationType.MINUS:
        return { status: calculationStatusType.OK, result: num1 - num2 };
      case operationType.DIVIDE:
        if (num2 == 0) {
          return { status: calculationStatusType.ERROR, result: null };
        }
        return { status: calculationStatusType.OK, result: num1 / num2 };
      case operationType.MULTIPLE:
        return { status: calculationStatusType.OK, result: num1 * num2 };
      default:
        return { status: calculationStatusType.ERROR, result: null };
    }
  };
  const calculateResult = () => {
    console.log(calculationHistory.current);
    if (calculationHistory.current.length <= 0) {
      return;
    }
    if (calculationHistory.current.length % 2 === 0) {
      return;
    }

    let result: number | null = Number(calculationHistory.current[0]);
    for (let i = 2; i < calculationHistory.current.length; i = i + 2) {
      const operation = calculationHistory.current[i - 1];
      const num = Number(calculationHistory.current[i]);
      const calculationResult = calculate(result, num, operation);
      calculationStatus.current = calculationResult.status;
      if (
        calculationStatus.current === calculationStatusType.ERROR ||
        calculationResult.result === null
      ) {
        handleError();
        return;
      }
      if (isOverflow(calculationResult.result.toString())) {
        calculationStatus.current = calculationStatusType.OVERFLOW;
        handleOverflow();
        return;
      }
      result = calculationResult.result;
    }

    calculationHistory.current = [result];
    calculationStatus.current = calculationStatusType.END;
    inputNumberType.current = numberType.RADIX;
    setDisplay(result.toString());
  };

  const resetCalculation = () => {
    calculationHistory.current = [0];
    resetCalculationStatus();
  };
  const resetCalculationStatus = () => {
    calculationStatus.current = calculationStatusType.OK;
    inputNumberType.current = numberType.RADIX;
  };
  const clearDisplay = () => {
    setDisplay('0');
    inputNumberType.current = numberType.RADIX;

    const size = calculationHistory.current.length;
    if (size <= 0) {
      return;
    }
    if (size % 2 == 0) {
      return;
    }
    calculationHistory.current[size - 1] = 0;
  };

  const isOverflow = (num: string) => {
    return num.length >= 10;
  };

  const handleOverflow = () => {
    setDisplay('OVERFLOW');
    resetCalculation();
  };
  const handleError = () => {
    setDisplay('ERROR');
    resetCalculation();
  };

  const addNumber = (num: number) => {
    let newDisplay;

    console.log(
      calculationStatus.current.toString(),
      inputNumberType.current.toString()
    );
    const size = calculationHistory.current.length;
    if (calculationStatus.current === calculationStatusType.END) {
      newDisplay = num.toString();
      calculationHistory.current[0] = num;
      resetCalculationStatus();
    } else if (inputNumberType.current === numberType.DECIMAL) {
      newDisplay = display + num.toString();
      calculationHistory.current[size - 1] = Number(newDisplay);
    } else {
      if (size % 2 == 1) {
        calculationHistory.current[size - 1] =
          calculationHistory.current[size - 1] * 10 + num;
        newDisplay = calculationHistory.current[size - 1].toString();
      } else {
        calculationHistory.current.push(num);
        newDisplay = num.toString();
      }
    }

    if (isOverflow(newDisplay)) {
      handleOverflow();
      return;
    }

    setDisplay(newDisplay);
  };
  const addDot = () => {
    if (inputNumberType.current === numberType.DECIMAL) {
      return;
    }

    inputNumberType.current = numberType.DECIMAL;
    setDisplay(display + '.');
  };
  const addOperation = (op: operationType) => {
    if (calculationHistory.current.length % 2 == 0) {
      return;
    }
    calculationHistory.current.push(op);
    resetCalculationStatus();
    console.log(calculationHistory.current);
  };
  const calculateCurrentNumber = (op: operationType) => {
    const size = calculationHistory.current.length;
    if (size % 2 == 0) {
      return;
    }
    let newDisplay = display;
    if (op == operationType.SIGN_CHANGE) {
      calculationHistory.current[size - 1] *= -1;
      newDisplay = calculationHistory.current[size - 1].toString();
    } else if (op == operationType.PERCENTAGE) {
      calculationHistory.current[size - 1] = Number(
        (calculationHistory.current[size - 1] / 100).toFixed(10)
      );
      newDisplay = calculationHistory.current[size - 1].toString();
    }

    if (isOverflow(newDisplay)) {
      calculationStatus.current = calculationStatusType.OVERFLOW;
      handleOverflow();
      return;
    }

    setDisplay(newDisplay);
    console.log(calculationHistory.current);
  };

  const renderKey = (type: keyType, key: string, value: number) => {
    switch (type) {
      case keyType.NUMBER:
        return (
          <button key={key} onClick={() => addNumber(value)}>
            {key}
          </button>
        );
      case keyType.OPERATION:
        return (
          <button
            key={key}
            onClick={() => {
              calculateCurrentNumber(value);
            }}
          >
            {key}
          </button>
        );
      case keyType.CLEAR:
        return (
          <button
            key={key}
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
        );
      case keyType.DOT:
        return (
          <button key={key} onClick={() => addDot()}>
            {key}
          </button>
        );
      case keyType.ZERO:
        return (
          <button
            key={key}
            css={{
              backgroundColor: '#2c2e34',
              color: 'lightgray',
              aspectRatio: '2/1',
              border: 'none',
              fontSize: '8vmin',
            }}
            onClick={() => addNumber(value)}
          >
            {key}
          </button>
        );
      case keyType.RESULT:
        return (
          <button key={key} onClick={calculateResult}>
            {key}
          </button>
        );
      case keyType.OTHER:
        return (
          <button
            key={key}
            onClick={() => {
              calculateCurrentNumber(value);
            }}
          >
            {key}
          </button>
        );
      default:
        return;
    }
  };

  const handleKeyUp = (e: any) => {
    if (e.key === 'Enter') {
      calculateResult();
    } else if (e.key === 'Add') {
      addOperation(operationType.ADD);
    } else if (e.key === 'Subtract') {
      addOperation(operationType.MINUS);
    } else if (e.key === 'Divide') {
      addOperation(operationType.DIVIDE);
    } else if (e.key === 'Multiply') {
      addOperation(operationType.MULTIPLE);
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
        padding: 20,
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
          gridTemplateColumns: `repeat(4, 1fr)`,
          gridTemplateRows: `repeat(4, 1fr)`,
          gridGap: 2,
          width: '90%',
          height: '100%',
        }}
      >
        {keyData[0].map((data: any) => {
          return renderKey(data.type, data.key, data.value);
        })}
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
        {keyData[1].map((data: any) => {
          return renderKey(data.type, data.key, data.value);
        })}
      </div>
    </div>
  );
};
