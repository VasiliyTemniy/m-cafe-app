import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { useNavigate } from 'react-router-dom';

interface NavItemProps extends CommonProps {
  path: string;
  label: string;
}

export const NavItem = ({
  classNameOverride,
  classNameAddon,
  path,
  id,
  label
}: NavItemProps) => {

  const { className } = useInitLC({
    componentType: 'nav-item',
    componentName: 'nav-item',
    classNameAddon,
    classNameOverride,
  });

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <li className={className} id={id} onClick={handleNavigate}>
      {label}
    </li>
  );
};