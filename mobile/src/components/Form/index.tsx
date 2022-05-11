import React, { useState } from "react";
import { ArrowLeft } from "phosphor-react-native";
import { View, TextInput, Image, Text, TouchableOpacity } from "react-native";
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";

import { api } from "../../libs/api";
import { theme } from "../../theme";
import { feedbackTypes } from "../../utils/feedbackTypes";

import { FeedbackType } from "../Widget";
import { ScreenshotButton } from "../ScreenshotButton";
import { Button } from "../Button";
import { Copyright } from "../Copyright";

import { styles } from "./styles";

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent,
}: Props) {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: "jpg",
      quality: 0.8,
    })
      .then((uri) => setScreenshot(uri))
      .catch((error) => console.log(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) return;

    setIsSendingFeedback(true);

    const payload = {
      type: feedbackType,
      screenshot: "",
      comment,
    };

    if (screenshot) {
      const screenshotBase64 = await FileSystem.readAsStringAsync(screenshot, {
        encoding: "base64",
      });

      payload.screenshot = `data:image/png;base64,${screenshotBase64}`;
    }

    console.log(payload);

    try {
      await api.post("/feedbacks", payload);

      onFeedbackSent();
    } catch (error) {
      console.log(error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />

          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShoot={handleScreenshot}
          onRemoveShoot={handleScreenshotRemove}
          screenshot={screenshot}
        />
        <Button isLoading={isSendingFeedback} onPress={handleSendFeedback} />
      </View>

      <Copyright />
    </View>
  );
}
