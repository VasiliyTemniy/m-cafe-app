// import { Link, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  path: string;
  label: string;
}

export const NavItem = ({ path, label }: NavItemProps) => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <li className='nav-item' onClick={handleNavigate}>
      {/* <Link to={path}> */}
      {label}
      {/* </Link> */}
    </li>
  );
};