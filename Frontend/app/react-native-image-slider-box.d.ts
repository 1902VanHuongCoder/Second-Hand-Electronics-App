declare module 'react-native-image-slider-box' {
    import { Component } from 'react';
    import { ImageStyle, StyleProp, ViewStyle } from 'react-native';
  
    interface ImageSliderBoxProps {
      images: string[];
      onCurrentImagePressed?: (index: number) => void;
      onCurrentImageChanged?: (index: number) => void;
      sliderBoxHeight?: number;
      parentWidth?: number;
      dotColor?: string;
      inactiveDotColor?: string;
      dotStyle?: StyleProp<ViewStyle>;
      paginationBoxVerticalPadding?: number;
      autoplay?: boolean;
      circleLoop?: boolean;
      ImageComponentStyle?: StyleProp<ImageStyle>;
      imageLoadingColor?: string;
    }
  
    export class SliderBox extends Component<ImageSliderBoxProps> {}
  }