import React from 'react';
import DarkMode from '@/components/shared/DarkMode';
import Menu from '@/components/shared/Menu';
import Logo from '@/components/shared/Logo';
import { useState, useEffect } from 'react';

const Navbar = ({ selectedTypes, setSelectedTypes }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div>
      <Menu
        isOpen={isOpen}
        toggleMenu={() => setIsOpen(!isOpen)}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />
      <Logo />
      <DarkMode isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

export default Navbar;
