import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userDetailContext = useContext(UserDetailContext);
  if (!userDetailContext) {
    throw new Error("SignIn must be used within a UserDetailContext.Provider");
  }
  const { userDetail, setUserDetail } = userDetailContext;

  const router = useRouter();

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
      setter(value);
      if (errorMessage) setErrorMessage(null);
    };

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified === true) {
        // Save in global context
        setUserDetail({
          uid: user.uid,
          email: user.email,
        });

        console.log(`User logged in: ${user.uid}`);
        console.log(`User email: ${user.email}`);

        Alert.alert("Success", "Login Successful!");
        router.push("/");
      } else {
        setErrorMessage("Please verify your email before logging in.");
      }

      // Clear form
      setEmail("");
      setPassword("");
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("No account found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        default:
          setErrorMessage(`Login failed. Please try again. ${error.message}`);
          break;
      }
    }
  };

  return (
    <SafeAreaView>
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-4">Sign in (Login)</Text>

        <View className="w-full mb-4">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={handleInputChange(setEmail)}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
          />
        </View>

        <View className="w-full mb-4">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handleInputChange(setPassword)}
            secureTextEntry
            className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
          />
        </View>

        {errorMessage && (
          <Text className="text-red-500 mb-4 text-center">{errorMessage}</Text>
        )}

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-500 py-3 px-10 rounded-lg shadow-md w-full"
        >
          <Text className="text-center text-white text-lg font-semibold">Sign in</Text>
        </TouchableOpacity>

        <View className="mt-4">
          <Text className="text-gray-600">
            Don’t have an account?{" "}
            <Text
              className="text-blue-500 font-semibold"
              onPress={() => router.push("/auth/signup")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
