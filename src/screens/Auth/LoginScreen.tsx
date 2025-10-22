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
import { useLoginMutation } from "../../services/api";
import { useAuth } from "../../contexts";
import { MyText } from "../../components/ui/MyText";
import MyTextInput from "../../components/ui/MyTextInput";
import { MyButton } from "../../components/ui/MyButton";
import { useThemeColor } from "../../hooks/useThemeColor";
import { loginSchema, LoginFormData } from "../../utils/validationSchemas";
import { responsive, spacing, fs } from "../../constants/Responsive";
import { useDispatch } from "react-redux";
import { showMessage } from "../../store/snackbarSlice";

export function LoginScreen({ navigation }: any) {
  const [login, { isLoading }] = useLoginMutation();
  const { login: authLogin } = useAuth();
  const dispatch = useDispatch();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      await authLogin(result.user, result.token);
      dispatch(
        showMessage({
          message: "Welcome back! Login successful.",
          type: "success",
          duration: 3000,
        })
      );
    } catch (error: any) {
      dispatch(
        showMessage({
          message:
            error?.data?.message ||
            "Login failed. Please check your credentials.",
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
          Welcome Back
        </MyText>
        <MyText style={[styles.subtitle, { color: textColor }]}>
          Sign in to continue
        </MyText>
        <View style={styles.form}>
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

          <MyButton
            title={isLoading ? "Signing in..." : "Sign In"}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={styles.button}
          />

          {isLoading && (
            <ActivityIndicator size="small" style={styles.loader} />
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={styles.linkContainer}>
            <MyText style={[styles.linkText, { color: textColor }]}>
              Don&apos;t have an account?{" "}
              <MyText style={styles.linkTextBold}>Sign Up</MyText>
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
    paddingHorizontal: spacing(16),
  },
  title: {
    fontSize: fs(32),
    fontWeight: "bold",
    marginBottom: spacing(8),
    textAlign: "center",
  },
  subtitle: {
    fontSize: fs(16),
    marginBottom: spacing(16),
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
