import { TypeAnimation } from "react-type-animation";

export const SlideText = () => {
  return (
    <>
      <TypeAnimation
        sequence={[
          "IPhone",
          1000,
          "Samsung",
          1000,
          "Nothing",
          1000,
          "Oneplus",
          1000,
        ]}
        speed={40}
        repeat={Infinity}
      />
    </>
  );
};
