import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  useGetEventByIdQuery,
  useRegisterForEventMutation,
  useGetRegisteredEventsQuery,
  useCancelRegistrationMutation,
} from "../../services/api";
import { useAuth } from "../../contexts";
import { MyText } from "../../components/ui/MyText";
import { MyButton } from "../../components/ui/MyButton";
import { useThemeColor } from "../../hooks/useThemeColor";
import { spacing, fs } from "../../constants/Responsive";
import { useDispatch } from "react-redux";
import { showMessage } from "../../store/snackbarSlice";
import { ModalSnackbarContainer } from "../../components/Snackbar";

export function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const { data: event, isLoading, error } = useGetEventByIdQuery(eventId);
  const [registerForEvent, { isLoading: isRegistering }] =
    useRegisterForEventMutation();
  const [cancelRegistration, { isLoading: isCancelling }] =
    useCancelRegistrationMutation();
  const { user: currentUser, isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  // Check if user is already registered for this event
  const { data: registeredEvents } = useGetRegisteredEventsQuery(
    currentUser?.id || "",
    {
      skip: !currentUser,
    }
  );

  const isRegistered = registeredEvents?.some((reg) => reg.eventId === eventId);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleRegister = async () => {
    if (!isAuthenticated || !currentUser) {
      dispatch(
        showMessage({
          message: "Please log in to register for events",
          type: "error",
          duration: 4000,
          scope: "modal",
        })
      );
      return;
    }

    if (!event) {
      return;
    }

    if (event.availableSpots <= 0) {
      dispatch(
        showMessage({
          message: "Sorry, this event is fully booked",
          type: "error",
          duration: 4000,
          scope: "modal",
        })
      );
      return;
    }

    try {
      await registerForEvent({
        userId: currentUser.id,
        eventId: event.id,
      }).unwrap();

      dispatch(
        showMessage({
          message: `Successfully registered for ${event.name}!`,
          type: "success",
          duration: 5000,
          scope: "global",
          action: {
            label: "UNDO",
            actionType: "UNDO",
          },
        })
      );

      // Navigate back or to Main tab
      navigation.goBack();
    } catch (err: any) {
      dispatch(
        showMessage({
          message:
            err?.data?.message || "Failed to register. Please try again.",
          type: "error",
          duration: 4000,
          scope: "modal",
        })
      );
    }
  };

  const handleCancelRegistration = async () => {
    if (!currentUser || !event) return;

    try {
      await cancelRegistration({
        userId: currentUser.id,
        eventId: event.id,
      }).unwrap();

      dispatch(
        showMessage({
          message: `Registration cancelled for ${event.name}`,
          type: "info",
          duration: 4000,
          scope: "modal",
        })
      );
    } catch (err: any) {
      dispatch(
        showMessage({
          message:
            err?.data?.message ||
            "Failed to cancel registration. Please try again.",
          type: "error",
          duration: 4000,
          scope: "modal",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <MyText style={[styles.errorText, { color: textColor }]}>
          Failed to load event details
        </MyText>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <Image
          source={{ uri: event.image }}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <MyText style={[styles.title, { color: textColor }]}>
            {event.name}
          </MyText>

          <View style={styles.infoSection}>
            <InfoItem
              icon="📅"
              label="Date & Time"
              value={`${event.date} at ${event.time}`}
              textColor={textColor}
            />
            <InfoItem
              icon="📍"
              label="Location"
              value={event.location}
              textColor={textColor}
            />
            <InfoItem
              icon="💰"
              label="Price"
              value={event.price === 0 ? "Free" : `$${event.price}`}
              textColor={textColor}
            />
            <InfoItem
              icon="👥"
              label="Capacity"
              value={`${event.capacity} people`}
              textColor={textColor}
            />
            <InfoItem
              icon="✅"
              label="Available Spots"
              value={`${event.availableSpots} spots remaining`}
              textColor={textColor}
            />
          </View>

          <View style={styles.section}>
            <MyText style={[styles.sectionTitle, { color: textColor }]}>
              About Event
            </MyText>
            <MyText style={[styles.description, { color: textColor }]}>
              {event.description}
            </MyText>
          </View>

          {event.speakers && event.speakers.length > 0 && (
            <View style={styles.section}>
              <MyText style={[styles.sectionTitle, { color: textColor }]}>
                Speakers
              </MyText>
              {event.speakers.map((speaker, index) => (
                <MyText
                  key={index}
                  style={[styles.speakerItem, { color: textColor }]}>
                  • {speaker}
                </MyText>
              ))}
            </View>
          )}

          {isRegistered ? (
            <MyButton
              title={isCancelling ? "Cancelling..." : "Cancel Registration"}
              onPress={handleCancelRegistration}
              disabled={isCancelling}
              style={styles.cancelButton}
            />
          ) : (
            <MyButton
              title={isRegistering ? "Registering..." : "Register for Event"}
              onPress={handleRegister}
              disabled={isRegistering || event.availableSpots <= 0}
              style={styles.registerButton}
            />
          )}

          {event.availableSpots <= 0 && !isRegistered && (
            <MyText style={[styles.fullText, { color: "red" }]}>
              This event is fully booked
            </MyText>
          )}

          {isRegistered && (
            <MyText style={[styles.fullText, { color: "#007AFF" }]}>
              ✓ You are registered for this event
            </MyText>
          )}
        </View>
      </ScrollView>
      <ModalSnackbarContainer />
    </>
  );
}

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  textColor: string;
}

function InfoItem({ icon, label, value, textColor }: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <MyText style={styles.infoIcon}>{icon}</MyText>
      <View style={styles.infoContent}>
        <MyText style={[styles.infoLabel, { color: textColor }]}>
          {label}
        </MyText>
        <MyText style={[styles.infoValue, { color: textColor }]}>
          {value}
        </MyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: spacing(250),
    backgroundColor: "#E0E0E0",
  },
  content: {
    padding: spacing(16),
  },
  title: {
    fontSize: fs(28),
    fontWeight: "bold",
    marginBottom: spacing(16),
  },
  infoSection: {
    marginBottom: spacing(24),
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing(12),
  },
  infoIcon: {
    fontSize: fs(24),
    marginRight: spacing(12),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fs(12),
    opacity: 0.6,
    marginBottom: spacing(2),
  },
  infoValue: {
    fontSize: fs(16),
    fontWeight: "500",
  },
  section: {
    marginBottom: spacing(24),
  },
  sectionTitle: {
    fontSize: fs(20),
    fontWeight: "bold",
    marginBottom: spacing(12),
  },
  description: {
    fontSize: fs(16),
    lineHeight: spacing(24),
    opacity: 0.8,
  },
  speakerItem: {
    fontSize: fs(16),
    marginBottom: spacing(8),
    paddingLeft: spacing(8),
  },
  registerButton: {
    marginTop: spacing(8),
    marginBottom: spacing(16),
  },
  cancelButton: {
    marginTop: spacing(8),
    marginBottom: spacing(16),
    backgroundColor: "#FF3B30",
  },
  fullText: {
    textAlign: "center",
    fontSize: fs(14),
    fontWeight: "500",
  },
  errorText: {
    fontSize: fs(16),
    opacity: 0.6,
  },
});
