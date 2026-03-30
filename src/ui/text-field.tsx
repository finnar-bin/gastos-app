import { forwardRef } from "react";
import {
  Platform,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";

const BASE_INPUT_STYLE: TextStyle = Platform.select({
  android: {
    textAlignVertical: "center",
    includeFontPadding: false,
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 0,
  },
  ios: {
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  default: {
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 0,
  },
}) as TextStyle;

type TextFieldProps = TextInputProps & {
  className?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ className, style, ...props }, ref) => {
    const mergedStyle: StyleProp<TextStyle> = [BASE_INPUT_STYLE, style];
    const mergedClassName = className
      ? `input-field ${className}`.trim()
      : "input-field";

    return (
      <TextInput
        ref={ref}
        {...props}
        className={mergedClassName}
        style={mergedStyle}
      />
    );
  },
);

TextField.displayName = "TextField";
