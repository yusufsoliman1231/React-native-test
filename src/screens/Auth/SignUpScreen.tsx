import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignUpMutation } from "../../services/api";
import { useAuth } from "../../contexts";
import { MyText } from "../../components/ui/MyText";
import MyTextInput from "../../components/ui/MyTextInput";
import { MyButton } from "../../components/ui/MyButton";
import { useThemeColor } from "../../hooks/useThemeColor";
import { signUpSchema, SignUpFormData } from "../../utils/validationSchemas";
import { spacing, fs } from "../../constants/Responsive";
import { useDispatch } from "react-redux";
import { showMessage } from "../../store/snackbarSlice";

export function SignUpScreen({ navigation }: any) {
  const [signUp, { isLoading }] = useSignUpMutation();
  const { login: authLogin } = useAuth();
  const dispatch = useDispatch();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { name, email, password } = data;
      const result = await signUp({ name, email, password }).unwrap();
      // Use AuthContext instead of Redux for auth state
      await authLogin(result.user, result.token);
      dispatch(
        showMessage({
          message: "Account created successfully! Welcome!",
          type: "success",
          duration: 3000,
        })
      );
    } catch (error: any) {
      dispatch(
        showMessage({
          message: error?.data?.message || "Sign up failed. Please try again.",
          type: "error",
          duration: 5000,
        })
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.scrollContent}
      bottomOffset={50}
      keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <MyText style={[styles.title, { color: textColor }]}>
          Create Account
        </MyText>
        <MyText style={[styles.subtitle, { color: textColor }]}>
          Sign up to get started
        </MyText>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your full name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <MyButton
            title={isLoading ? "Creating Account..." : "Sign Up"}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={styles.button}
          />

          {isLoading && (
            <ActivityIndicator size="small" style={styles.loader} />
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.linkContainer}>
            <MyText style={[styles.linkText, { color: textColor }]}>
              Already have an account?{" "}
              <MyText style={styles.linkTextBold}>Sign In</MyText>
            </MyText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing(24),
  },
  title: {
    fontSize: fs(32),
    fontWeight: "bold",
    marginBottom: spacing(8),
    textAlign: "center",
  },
  subtitle: {
    fontSize: fs(16),
    marginBottom: spacing(32),
    textAlign: "center",
    opacity: 0.7,
  },
  form: {
    gap: spacing(0),
  },
  button: {
    marginTop: spacing(8),
  },
  loader: {
    marginTop: spacing(16),
  },
  linkContainer: {
    marginTop: spacing(16),
    alignItems: "center",
  },
  linkText: {
    fontSize: fs(14),
  },
  linkTextBold: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
