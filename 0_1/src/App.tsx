import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

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
interface calculationResult {
  status: calculationStatusType;
  result: number | null;
}

type keyDataType = {
  label: string;
  click: () => void;
  className: string;
};

export const App = (): ReactElement => {
  const calculationHistory: React.MutableRefObject<number[] | operationType[]> =
    useRef([0]);
  const calculationStatus: React.MutableRefObject<calculationStatusType> =
    useRef(calculationStatusType.END);
  const inputNumberType: React.MutableRefObject<numberType> = useRef(
    numberType.RADIX
  );
  const [display, setDisplay] = useState<string>('0');

  const keyData: Array<keyDataType> = [
    {
      label: 'AC',
      click: () => clearDisplay(),
      className: 'button-style-1',
    },
    {
      label: '+/-',
      click: () => calculateCurrentNumber(operationType.SIGN_CHANGE),
      className: 'button-style-1',
    },
    {
      label: '%',
      click: () => calculateCurrentNumber(operationType.PERCENTAGE),
      className: 'button-style-1',
    },
    {
      label: '/',
      click: () => addOperation(operationType.DIVIDE),
      className: 'button-style-1',
    },
    {
      label: '7',
      click: () => addNumber(7),
      className: 'button-style-1',
    },
    {
      label: '8',
      click: () => addNumber(8),
      className: 'button-style-1',
    },
    {
      label: '9',
      click: () => addNumber(9),
      className: 'button-style-1',
    },
    {
      label: '*',
      click: () => addOperation(operationType.MULTIPLE),
      className: 'button-style-1',
    },
    {
      label: '4',
      click: () => addNumber(4),
      className: 'button-style-1',
    },
    {
      label: '5',
      click: () => addNumber(5),
      className: 'button-style-1',
    },
    {
      label: '6',
      click: () => addNumber(6),
      className: 'button-style-1',
    },
    {
      label: '-',
      click: () => addOperation(operationType.MINUS),
      className: 'button-style-1',
    },
    {
      label: '1',
      click: () => addNumber(1),
      className: 'button-style-1',
    },
    {
      label: '2',
      click: () => addNumber(2),
      className: 'button-style-1',
    },
    {
      label: '3',
      click: () => addNumber(3),
      className: 'button-style-1',
    },
    {
      label: '+',
      click: () => addOperation(operationType.ADD),
      className: 'button-style-1',
    },
    {
      label: '0',
      click: () => addNumber(0),
      className: 'button-style-2',
    },
    {
      label: '.',
      click: () => addDot(),
      className: 'button-style-1',
    },
    {
      label: '=',
      click: () => calculateResult(),
      className: 'button-style-1',
    },
  ];

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
  };

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        calculateResult();
      } else if (e.key === '+') {
        addOperation(operationType.ADD);
      } else if (e.key === '-') {
        addOperation(operationType.MINUS);
      } else if (e.key === '/') {
        addOperation(operationType.DIVIDE);
      } else if (e.key === '*') {
        addOperation(operationType.MULTIPLE);
      } else if (e.key === 'Escape') {
        clearDisplay();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex-box">
      <div className="grid">
        <div css={{ marginRight: '5px' }}>{display}</div>
      </div>
      <div className="grid-style-1">
        {keyData.map((data: keyDataType) => {
          return (
            <button
              key={data.label}
              className={data.className}
              onClick={(e) => {
                e.currentTarget.blur();
                data.click();
              }}
            >
              {data.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
