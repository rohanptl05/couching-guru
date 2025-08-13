import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import {createUserWithEmailAndPassword,sendEmailVerification} from 'firebase/auth'
import {auth}  from '@/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

const signUp = () => {
    const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const router = useRouter();

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
      setter(value);
      if (errorMessage) setErrorMessage(null);
    };

  const handleSignup = async () => {
    setErrorMessage(null);
    setEmailSent(false);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(`User created: ${user}`);

      await sendEmailVerification(user);
      setEmailSent(true);
      Alert.alert(
        "Verification Email Sent",
        "Please check your inbox and verify your email before logging in."
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      router.push("/auth/signIn");

      // Reset form fields after signup
      setEmail("");
      setPassword("");
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("This email is already registered.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        case "auth/weak-password":
          setErrorMessage("Password should be at least 6 characters.");
          break;
        default:
          setErrorMessage(`Signup failed. Please try again. ${error.message}`);
          break;
      }
    }
  };
  return (
   <SafeAreaView>
        
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <Text className="text-3xl font-bold text-gray-800 mb-4">Sign up</Text>

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

      {!emailSent && (
        <TouchableOpacity
          onPress={handleSignup}
          className="bg-blue-500 py-3 px-10 rounded-lg shadow-md w-full"
        >
          <Text className="text-center text-white text-lg font-semibold">
            Sign up
          </Text>
        </TouchableOpacity>
      )}

      {emailSent && (
        <Text className="text-green-500 mt-4 text-center">
          A verification email has been sent to your email address. Please
          verify before logging in.
        </Text>
      )}

      <View className="mt-4">
        <Text className="text-gray-600">
          Already have an account?{" "}
          <Text
            className="text-blue-500 font-semibold"
            onPress={() => router.push("/auth/signIn")}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>

      </SafeAreaView>
  )
}

export default signUp

const styles = StyleSheet.create({})