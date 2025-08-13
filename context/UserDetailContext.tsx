
// import { createContext } from "react";

// export type UserDetail = {
//   uid: string;
//   email: string | null;
// }; 
// type UserDetailContextType = {
//   userDetail: UserDetail | null; 
//   setUserDetail: React.Dispatch<React.SetStateAction<string | null>>;
// };


// export const UserDetailContext = createContext<UserDetailContextType | null>(null);
import { createContext } from "react";

export type UserDetail = {
  uid: string;
  email: string | null;
};

export const UserDetailContext = createContext<{
  userDetail: UserDetail | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
}>({
  userDetail: null,
  setUserDetail: () => {},
});