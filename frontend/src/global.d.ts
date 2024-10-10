import 'react-native';

declare module 'react-native' {
  interface TextProps {
    style?: import('react-native').TextStyle | import('react-native').TextStyle[];
  }

  interface TextInputProps {
    style?: import('react-native').TextStyle | import('react-native').TextStyle[];
  }
}