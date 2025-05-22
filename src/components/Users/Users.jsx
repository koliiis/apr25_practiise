import cn from 'classnames';
import usersFromServer from '../../api/users';

export const Users = ({ activeUserId, setActiveUserId }) => {
  return (
    <>
      <a
        data-cy="FilterAllUsers"
        href="#/"
        onClick={e => {
          e.preventDefault();
          setActiveUserId('');
        }}
        className={cn({ 'is-active': activeUserId === '' })}
      >
        All
      </a>

      {usersFromServer.map(user => {
        return (
          <a
            data-cy="FilterUser"
            href="#/"
            key={user.id}
            onClick={e => {
              e.preventDefault();
              setActiveUserId(user.id);
            }}
            className={cn({ 'is-active': activeUserId === user.id })}
          >
            {user.name}
          </a>
        );
      })}
    </>
  );
};
