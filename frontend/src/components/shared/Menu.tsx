import React from 'react';

type MenuProps = {
  isOpen: boolean;
  toggleMenu: () => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
};

const Menu = ({
  isOpen,
  toggleMenu,
  selectedTypes,
  setSelectedTypes,
}: MenuProps) => {
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const includesType = prev.includes(type);
      const shouldRemove = includesType && prev.length > 1;

      return shouldRemove
        ? prev.filter(t => t !== type)
        : includesType
        ? prev
        : [...prev, type];
    });
  };

  return (
    <>
      <div
        className={`cursor-pointer absolute top-5 left-5 max-sm:mix-blend-color-dodge text-neutral-400 dark:text-neutral-500 transition-colors duration-300 ${
          isOpen ? 'dark:!text-neutral-100 !text-neutral-600' : ''
        }`}
        onClick={toggleMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="24"
          height="24"
        >
          <line
            x1="50"
            y1="190"
            x2={isOpen ? '350' : '400'}
            y2="190"
            stroke="currentColor"
            strokeWidth="30"
            strokeLinecap="round"
            style={{
              transform: isOpen ? 'translate(0px, 30px) rotate(45deg)' : 'none',
              transformOrigin: '200px 260px',
              transition: 'transform 300ms, x2 300ms',
            }}
          />
          <line
            x1="50"
            y1="330"
            x2={isOpen ? '350' : '350'}
            y2="330"
            stroke="currentColor"
            strokeWidth="30"
            strokeLinecap="round"
            style={{
              transform: isOpen
                ? 'translate(0px, -70px) rotate(-45deg)'
                : 'none',
              transformOrigin: '200px 260px',
              transition: 'transform 300ms',
            }}
          />
        </svg>
      </div>

      <button
        className={`cursor-pointer text-sm leading-3.5 absolute top-6 transition-all duration-300 -z-10 opacity-0 ${
          selectedTypes.includes('Ustawa')
            ? 'text-neutral-600 dark:text-neutral-100'
            : 'text-neutral-400 dark:text-neutral-500'
        }
        ${isOpen && 'opacity-100 !pointer-events-auto translate-x-12 z-0'}`}
        onClick={() => toggleType('Ustawa')}
      >
        Ustawy
      </button>
      <button
        className={`cursor-pointer text-sm leading-3.5 absolute top-6 transition-all duration-300 -z-10 opacity-0 ${
          selectedTypes.includes('Rozporządzenie')
            ? 'text-neutral-600 dark:text-neutral-100'
            : 'text-neutral-400 dark:text-neutral-500'
        }
        ${
          isOpen &&
          'opacity-100 !pointer-events-auto translate-x-12 translate-y-5 z-0'
        }`}
        onClick={() => toggleType('Rozporządzenie')}
      >
        Rozporządzenia
      </button>
    </>
  );
};

export default Menu;
