import { LoginForm } from "../components/AuthForm";
import { useEffect, useState } from "react";
import { getRandomBackgroungImage } from "../services/random_background";
export const LoginPage = () => {
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getRandomBackgroungImage();
      if (data) {
        setBackground(data);
      }
    };
    fetch();
  }, []);
  return (
    <div className="flex w-full h-full justify-center items-center">
      {background && (
        <img
          src={background}
          className="w-full h-full absolute top-0 left-0 z-[-1]"
        />
      )}
      <LoginForm></LoginForm>
    </div>
  );
};
