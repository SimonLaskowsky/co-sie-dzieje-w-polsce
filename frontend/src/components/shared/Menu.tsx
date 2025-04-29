import React from 'react';

type MenuProps = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const Menu = ({ isOpen, toggleMenu }: MenuProps) => {
  return (
    <div
      className="cursor-pointer fixed top-5 left-5 text-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-100 hover:text-neutral-500"
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
            transform: isOpen ? 'translate(0px, -70px) rotate(-45deg)' : 'none',
            transformOrigin: '200px 260px',
            transition: 'transform 300ms',
          }}
        />
      </svg>
    </div>
  );
};

export default Menu;
