import { useEffect, useState } from 'react';

const useShowFooter = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const container = document.getElementById('main-scroll');

    let handleScroll;

    if (container) {
      handleScroll = () => {
        const { scrollTop } = container;
        const visibleHeight = container.clientHeight;
        const fullHeight = container.scrollHeight;

        const hasScroll = fullHeight > visibleHeight;
        const isBottom = scrollTop + visibleHeight >= fullHeight - 5;

        setShow(!hasScroll || isBottom);
      };

      handleScroll();
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container && handleScroll) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return show;
};

export default useShowFooter;
