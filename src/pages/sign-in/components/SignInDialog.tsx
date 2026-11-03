import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  Text,
  Box,
  TextInput,
  Flex,
  Button,
  PasswordInput,
} from "@mantine/core";

import { useTheme } from "../../../context/ThemeContext";

import { useLogin } from "../../../query/auth";
import useAuthState from "../../../store/useAuthStore";
import { fetchCurrentUser } from "../../../api/auth.api";

import type { FetchUserRequest } from "../../../types/auth.types";

const GUEST_CREDENTIALS: FetchUserRequest = {
  emailOrUsername: "guest",
  password: "Passw0rd!Guest",
};

interface SignInDialogProps {
  mobile: boolean;
}

export default function SignInDialog({ mobile }: SignInDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthState();

  const { colors } = useTheme();

  const loginMutation = useLogin();

  const [errorMessage, setErrorMessage] = useState("");

  const [loginForm, setLoginForm] = useState<FetchUserRequest>({
    emailOrUsername: "",
    password: "",
  });

  const finishLogin = async () => {
    const currentUser = await fetchCurrentUser();
    if (currentUser.user) login(currentUser.user);
    const state = location.state as { from?: string; intent?: { type: "add" | "edit" | "delete"; itemId?: number } } | null;
    navigate(state?.from ?? "/dashboard", { replace: true, state: state?.intent ? { intent: state.intent } : undefined });
  };

  const handleSubmit = () =>
    loginMutation.mutate(loginForm, {
      onSuccess: () => void finishLogin(),

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data.message ?? "Something went wrong.",
          );
          setLoginForm({
            emailOrUsername: "",
            password: "",
          });
        } else {
          setErrorMessage("Something went wrong.");
        }
      },
    });
  return (
    <>
      <Paper
        shadow="xl"
        style={{
          border: `3px solid ${colors.accPrimary}`,
        }}
        w={mobile ? "90%" : "35%"}
        bg={colors.bgHighlight}
        c={colors.accPrimary}
      >
        <Box
          p={10}
          style={{
            borderBottom: `3px solid ${colors.accPrimary}`,
          }}
        >
          <Text fw={600} fz={18} ta={"center"}>
            WELCOME BACK, MARJORIE!
          </Text>
          <Text mt={-10} ta={"center"}>
            Sign in to continue building your professional story.
          </Text>
        </Box>
        <Box px={20} py={20}>
          <Flex direction={"column"} gap={20}>
            <TextInput
              value={loginForm.emailOrUsername ?? ""}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  emailOrUsername: e.currentTarget.value,
                })
              }
              label="Email or Username"
              placeholder="Enter your email or username..."
              size="md"
              styles={{
                label: {
                  color: colors.accPrimary,
                },
                input: {
                  color: colors.text,
                  border: `2px solid ${colors.accPrimary}`,
                  backgroundColor: colors.bgHighlight,
                },
              }}
            />
            <PasswordInput
              value={loginForm.password ?? ""}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  password: e.currentTarget.value,
                })
              }
              label="Password"
              placeholder="Enter your password..."
              size="md"
              styles={{
                label: {
                  color: colors.accPrimary,
                },
                input: {
                  color: colors.text,
                  border: `2px solid ${colors.accPrimary}`,
                  backgroundColor: colors.bgHighlight,
                },
                visibilityToggle: {
                  color: colors.accPrimary,
                },
              }}
            />
            <Flex w={"100%"} align={"center"} justify={"center"} gap="sm">
              <Button
                w={100}
                variant="outline"
                color={colors.accPrimary}
                onClick={handleSubmit}
                loading={loginMutation.isPending}
              >
                SIGN-IN
              </Button>
              <Button variant="light" color={colors.accPrimary} onClick={() => loginMutation.mutate(GUEST_CREDENTIALS, { onSuccess: () => void finishLogin() })} loading={loginMutation.isPending}>
                GUEST
              </Button>
            </Flex>
            {errorMessage && (
              <Text c="red" size="sm" ta={"center"}>
                {errorMessage}
              </Text>
            )}
          </Flex>
        </Box>
      </Paper>
    </>
  );
}
