import { Button } from 'antd';
import { useSpring, animated } from 'react-spring';
import "./button.css"

const AnimatedButton = ({ children, onClick }) => {
  const [props, set] = useSpring(() => ({
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }));

  return (
    <animated.div
      style={props}
      onMouseEnter={() => set({ transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' })}
      onMouseLeave={() => set({ transform: 'translateY(0)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' })}
    >
      <Button type="primary" onClick={onClick}>
        {children}
      </Button>
    </animated.div>
  );
};

export default AnimatedButton;