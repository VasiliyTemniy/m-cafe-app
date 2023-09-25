import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Link } from 'react-router-dom';

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

  return (
    <li className={className} id={id}>
      <Link to={path}>{label}</Link>
    </li>
  );
};