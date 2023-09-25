import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) return (
    <div>
      <p style={{color: 'red', fontSize:'30px'}}>
        {error.status === 404 ? '404 Page Not Found' : ''}
      </p>
    </div>
  );
  else return (
    <div>
      <p style={{color: 'red', fontSize:'30px'}}>
        Unknown error!
      </p>
    </div>
  );
};