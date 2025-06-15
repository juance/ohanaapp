
type Props = {
  setUser: (user: null) => void;
};

export const useAuthLogout = ({ setUser }: Props) => {
  return async () => {
    setUser(null);
    localStorage.removeItem('authUser');
    window.location.href = '/auth';
  };
};
