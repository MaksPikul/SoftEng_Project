/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import LoginProvider from "./context/loginProvider";
import MainLayout from "./_MainLayout";
import useSessionCheck from "./useSessionCheck";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

function App(): React.JSX.Element {
  


  Linking.addEventListener('url', ({ url }) => {
    console.log("Heard")
  });

  //for now show header
  //login page should be first with a conditional to check cookies (saving log in)
  //first is home for now
  return (
    <LoginProvider>

        <MainLayout />

    </LoginProvider>
  );
}

export default App;
