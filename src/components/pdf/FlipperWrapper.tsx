import React, { ReactNode, useState } from "react";
import HTMLFlipBook from "react-pageflip";

interface FlipBookWrapperProps {
  currentPage?: number;
  onPageChange?: (page: number) => void;
  children: ReactNode;
  onFlip?: (e:any) => void;
  onChangeOrientation?: (e:any) => void;
  onChangeState?: (e:any) => void;
  className?: string;
  [key: string]: any;
}

const FlipBookWrapper: React.FC<FlipBookWrapperProps> = ({
  currentPage,
  onPageChange,
  children,
  onFlip,
  onChangeOrientation,
  onChangeState,
  className = "",
  ...rest
}) => {
  const [isBookView, setIsBookView] = useState(false);
  const handleFlip = (e:any) => {
    if (onPageChange) {
      onPageChange(e.data + 1);
    }
  };

  return (
    <HTMLFlipBook
      size="stretch"
      width={500}
      height={700}
      minWidth={315}
      maxWidth={1000}
      maxHeight={1000}
      minHeight={400}
      showCover={true}
      usePortrait={true}
      onChangeOrientation={(e) => {
        const orientation = e.data;
        setIsBookView(orientation === "landscape");
        console.log(
          "Current view:",
          orientation === "landscape" ? "Book" : "Single"
        );
      }}
      style={{}}
      startPage={0}
      drawShadow={true}
      flippingTime={500}
      startZIndex={0}
      autoSize={true}
      maxShadowOpacity={0.5}
      mobileScrollSupport={true}
      clickEventForward={true}
      useMouseEvents={true}
      swipeDistance={30}
      showPageCorners={true}
      disableFlipByClick={false}
      className={className}
      onFlip={handleFlip}
      onChangeState={onChangeState}
      {...rest}
    >
      {children}
    </HTMLFlipBook>
  );
};

export default FlipBookWrapper;
