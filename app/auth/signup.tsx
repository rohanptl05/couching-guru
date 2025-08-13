import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { UserDetailContext } from '@/context/UserDetailContext';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const userDetailContext = useContext(UserDetailContext);
  if (!userDetailContext) {
    throw new Error("SignUp must be used within a UserDetailContext.Provider");
  }
  const { userDetail, setUserDetail } = userDetailContext;

  const router = useRouter();

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    if (errorMessage) setErrorMessage(null);
  };

  const SaveUser = async (user: FirebaseUser) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
    });
  };

  const handleSignup = async () => {
    setErrorMessage(null);
    setEmailSent(false);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await SaveUser(user);
      setUserDetail({
        uid: user.uid,
        email: user.email,
      });

      await sendEmailVerification(user);
      setEmailSent(true);
      Alert.alert(
        "Verification Email Sent",
        "Please check your inbox and verify your email before logging in."
      );

      router.push("/auth/signIn");

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
      <View>
        <Text style={styles.title}>Sign up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={handleInputChange(setEmail)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handleInputChange(setPassword)}
            secureTextEntry
            style={styles.input}
          />
        </View>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {!emailSent && (
          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        )}
        {emailSent && (
          <Text style={styles.emailSent}>
            A verification email has been sent to your email address. Please
            verify before logging in.
          </Text>
        )}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={() => router.push("/auth/signIn")}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7FAFC", paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: "bold", color: "#2D3748", marginBottom: 16 },
  inputContainer: { width: "100%", marginBottom: 16 },
  input: { backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "#E2E8F0", color: "#2D3748" },
  button: { backgroundColor: "#3182CE", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, shadowColor: "#3182CE", width: "100%" },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
  errorMessage: { color: "#E53E3E", marginBottom: 16, textAlign: "center" },
  emailSent: { color: "#38A169", marginTop: 16, textAlign: "center" },
  loginContainer: { marginTop: 16 },
  loginText: { color: "#718096" },
  loginLink: { color: "#3182CE", fontWeight: "bold" },
});
